const db = require('../../../config/db');

class JournalVoucher {
    // ✅ Pre-Check: Verify tables exist before operations
    static async checkTablesExist() {
        try {
            const [tables] = await db.query(`
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME IN ('journal_vouchers', 'journal_voucher_entries', 'account_heads', 'sub_account_heads')
            `);
            
            const tableNames = tables.map(table => table.TABLE_NAME);
            const requiredTables = ['journal_vouchers', 'journal_voucher_entries', 'account_heads', 'sub_account_heads'];
            
            return requiredTables.every(table => tableNames.includes(table));
        } catch (error) {
            console.error('Error checking tables existence:', error);
            return false;
        }
    }

    // ✅ Pre-Check: Validate account references
    static async validateAccountReferences(entries) {
        try {
            for (const entry of entries) {
                const { debit_account_head_id, debit_account_subhead_id, credit_account_head_id, credit_account_subhead_id } = entry;
                
                // Check debit account head and sub-account head
                const [debitCheck] = await db.query(`
                    SELECT ah.id, ah.account_head, ah.is_active as ah_active,
                           sah.id as sub_id, sah.sub_account_head, sah.is_active as sah_active
                    FROM account_heads ah
                    LEFT JOIN sub_account_heads sah ON sah.id = ? AND sah.account_head_id = ah.id
                    WHERE ah.id = ?
                `, [debit_account_subhead_id, debit_account_head_id]);

                if (debitCheck.length === 0 || !debitCheck[0].ah_active || !debitCheck[0].sub_id || !debitCheck[0].sah_active) {
                    return { valid: false, error: 'Invalid or inactive debit account references' };
                }

                // Check credit account head and sub-account head
                const [creditCheck] = await db.query(`
                    SELECT ah.id, ah.account_head, ah.is_active as ah_active,
                           sah.id as sub_id, sah.sub_account_head, sah.is_active as sah_active
                    FROM account_heads ah
                    LEFT JOIN sub_account_heads sah ON sah.id = ? AND sah.account_head_id = ah.id
                    WHERE ah.id = ?
                `, [credit_account_subhead_id, credit_account_head_id]);

                if (creditCheck.length === 0 || !creditCheck[0].ah_active || !creditCheck[0].sub_id || !creditCheck[0].sah_active) {
                    return { valid: false, error: 'Invalid or inactive credit account references' };
                }
            }

            return { valid: true };
        } catch (error) {
            console.error('Error validating account references:', error);
            return { valid: false, error: 'Database error during validation' };
        }
    }

    // ✅ Generate next voucher number
    static async generateVoucherNumber() {
        try {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            
            // Get or create sequence record
            const [existing] = await db.query(`
                SELECT last_number, prefix FROM voucher_sequences 
                WHERE voucher_type = 'Journal' AND year = ? AND month = ?
            `, [year, month]);

            let nextNumber, prefix;
            
            if (existing.length === 0) {
                // Create new sequence
                nextNumber = 1;
                prefix = 'JV';
                await db.query(`
                    INSERT INTO voucher_sequences (voucher_type, year, month, last_number, prefix)
                    VALUES ('Journal', ?, ?, ?, ?)
                `, [year, month, nextNumber, prefix]);
            } else {
                // Update existing sequence
                nextNumber = existing[0].last_number + 1;
                prefix = existing[0].prefix;
                await db.query(`
                    UPDATE voucher_sequences 
                    SET last_number = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE voucher_type = 'Journal' AND year = ? AND month = ?
                `, [nextNumber, year, month]);
            }

            // Format: JV-2025-01-001
            const voucherNo = `${prefix}-${year}-${month.toString().padStart(2, '0')}-${nextNumber.toString().padStart(3, '0')}`;
            return voucherNo;
        } catch (error) {
            console.error('Error generating voucher number:', error);
            throw new Error('Failed to generate voucher number');
        }
    }

    // ✅ Get all vouchers with entries
    static async getAll(page = 1, limit = 10, search = '') {
        try {
            // Pre-check: Verify tables exist
            const tablesExist = await this.checkTablesExist();
            if (!tablesExist) {
                throw new Error('Required database tables are missing');
            }

            const offset = (page - 1) * limit;
            
            let whereClause = 'WHERE jv.is_active = TRUE';
            const queryParams = [];
            
            if (search) {
                whereClause += ` AND (
                    jv.voucher_no LIKE ? OR 
                    jv.payment_type LIKE ? OR 
                    jv.remarks LIKE ?
                )`;
                const searchParam = `%${search}%`;
                queryParams.push(searchParam, searchParam, searchParam);
            }

            // Get total count
            const [countResult] = await db.query(`
                SELECT COUNT(*) as total
                FROM journal_vouchers jv
                ${whereClause}
            `, queryParams);

            // Get paginated data with entries
            const [vouchers] = await db.query(`
                SELECT 
                    jv.id,
                    jv.voucher_no,
                    jv.date,
                    jv.payment_type,
                    jv.total_amount,
                    jv.status,
                    jv.remarks,
                    jv.created_at,
                    jv.updated_at
                FROM journal_vouchers jv
                ${whereClause}
                ORDER BY jv.date DESC, jv.id DESC
                LIMIT ? OFFSET ?
            `, [...queryParams, limit, offset]);

            // Get entries for each voucher
            for (let voucher of vouchers) {
                const [entries] = await db.query(`
                    SELECT 
                        jve.id,
                        jve.entry_no,
                        jve.debit_account_head_id,
                        jve.debit_account_subhead_id,
                        jve.credit_account_head_id,
                        jve.credit_account_subhead_id,
                        jve.amount,
                        jve.remarks,
                        dah.account_head as debit_account_head,
                        dsah.sub_account_head as debit_sub_account_head,
                        cah.account_head as credit_account_head,
                        csah.sub_account_head as credit_sub_account_head
                    FROM journal_voucher_entries jve
                    INNER JOIN account_heads dah ON jve.debit_account_head_id = dah.id
                    INNER JOIN sub_account_heads dsah ON jve.debit_account_subhead_id = dsah.id
                    INNER JOIN account_heads cah ON jve.credit_account_head_id = cah.id
                    INNER JOIN sub_account_heads csah ON jve.credit_account_subhead_id = csah.id
                    WHERE jve.voucher_id = ? AND jve.is_active = TRUE
                    ORDER BY jve.entry_no
                `, [voucher.id]);
                
                voucher.entries = entries;
            }

            const total = countResult[0].total;
            const totalPages = Math.ceil(total / limit);

            return {
                success: true,
                data: {
                    data: vouchers,
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages
                }
            };
        } catch (error) {
            console.error('Error in getAll:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch journal vouchers'
            };
        }
    }

    // ✅ Create voucher with entries (Transaction)
    static async create(voucherData, entries) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // Pre-check: Verify tables exist
            const tablesExist = await this.checkTablesExist();
            if (!tablesExist) {
                throw new Error('Required database tables are missing');
            }

            // Pre-check: Validate entries
            if (!entries || entries.length === 0) {
                throw new Error('At least one journal entry is required');
            }

            // Pre-check: Validate account references
            const validation = await this.validateAccountReferences(entries);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Pre-check: Validate amounts
            const totalAmount = entries.reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
            if (totalAmount !== parseFloat(voucherData.total_amount)) {
                throw new Error('Total amount mismatch with entries sum');
            }

            // Pre-check: Check for duplicate voucher number
            const [existingVoucher] = await connection.query(
                'SELECT id FROM journal_vouchers WHERE voucher_no = ? AND is_active = TRUE',
                [voucherData.voucher_no]
            );

            if (existingVoucher.length > 0) {
                throw new Error('Voucher number already exists');
            }

            // Create voucher
            const [voucherResult] = await connection.query(`
                INSERT INTO journal_vouchers 
                (voucher_no, date, payment_type, total_amount, status, remarks)
                VALUES (?, ?, ?, ?, 'Posted', ?)
            `, [
                voucherData.voucher_no,
                voucherData.date,
                voucherData.payment_type,
                voucherData.total_amount,
                voucherData.remarks || null
            ]);

            const voucherId = voucherResult.insertId;

            // Create entries
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                await connection.query(`
                    INSERT INTO journal_voucher_entries 
                    (voucher_id, entry_no, debit_account_head_id, debit_account_subhead_id, 
                     credit_account_head_id, credit_account_subhead_id, amount, remarks)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    voucherId,
                    i + 1,
                    entry.debit_account_head_id,
                    entry.debit_account_subhead_id,
                    entry.credit_account_head_id,
                    entry.credit_account_subhead_id,
                    entry.amount,
                    entry.remarks || null
                ]);
            }

            await connection.commit();

            return {
                success: true,
                data: { id: voucherId, voucher_no: voucherData.voucher_no }
            };
        } catch (error) {
            await connection.rollback();
            console.error('Error in create:', error);
            return {
                success: false,
                error: error.message || 'Failed to create journal voucher'
            };
        } finally {
            connection.release();
        }
    }

    // ✅ Get voucher by ID with entries
    static async getById(id) {
        try {
            // Pre-check: Verify tables exist
            const tablesExist = await this.checkTablesExist();
            if (!tablesExist) {
                throw new Error('Required database tables are missing');
            }

            const [vouchers] = await db.query(`
                SELECT 
                    jv.id,
                    jv.voucher_no,
                    jv.date,
                    jv.payment_type,
                    jv.total_amount,
                    jv.status,
                    jv.remarks,
                    jv.created_at,
                    jv.updated_at
                FROM journal_vouchers jv
                WHERE jv.id = ? AND jv.is_active = TRUE
            `, [id]);

            if (vouchers.length === 0) {
                return {
                    success: false,
                    error: 'Journal voucher not found'
                };
            }

            const voucher = vouchers[0];

            // Get entries
            const [entries] = await db.query(`
                SELECT 
                    jve.id,
                    jve.entry_no,
                    jve.debit_account_head_id,
                    jve.debit_account_subhead_id,
                    jve.credit_account_head_id,
                    jve.credit_account_subhead_id,
                    jve.amount,
                    jve.remarks,
                    dah.account_head as debit_account_head,
                    dsah.sub_account_head as debit_sub_account_head,
                    cah.account_head as credit_account_head,
                    csah.sub_account_head as credit_sub_account_head
                FROM journal_voucher_entries jve
                INNER JOIN account_heads dah ON jve.debit_account_head_id = dah.id
                INNER JOIN sub_account_heads dsah ON jve.debit_account_subhead_id = dsah.id
                INNER JOIN account_heads cah ON jve.credit_account_head_id = cah.id
                INNER JOIN sub_account_heads csah ON jve.credit_account_subhead_id = csah.id
                WHERE jve.voucher_id = ? AND jve.is_active = TRUE
                ORDER BY jve.entry_no
            `, [voucher.id]);

            voucher.entries = entries;

            return {
                success: true,
                data: voucher
            };
        } catch (error) {
            console.error('Error in getById:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch journal voucher'
            };
        }
    }

    static async update(id, voucherData, entries) {
      const connection = await db.getConnection();
      
      try {
          await connection.beginTransaction();
  
          // Pre-check: Verify tables exist
          const tablesExist = await this.checkTablesExist();
          if (!tablesExist) {
              throw new Error('Required database tables are missing');
          }
  
          // Pre-check: Verify voucher exists
          const [existing] = await connection.query(
              'SELECT id FROM journal_vouchers WHERE id = ? AND is_active = TRUE',
              [id]
          );
  
          if (existing.length === 0) {
              throw new Error('Journal voucher not found');
          }
  
          // Pre-check: Validate entries
          if (!entries || entries.length === 0) {
              throw new Error('At least one journal entry is required');
          }
  
          // Pre-check: Validate account references
          const validation = await this.validateAccountReferences(entries);
          if (!validation.valid) {
              throw new Error(validation.error);
          }
  
          // Pre-check: Validate amounts
          const totalAmount = entries.reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
          if (Math.abs(totalAmount - parseFloat(voucherData.total_amount)) > 0.01) {
              throw new Error('Total amount mismatch with entries sum');
          }
  
          // Pre-check: Check for duplicate voucher number (excluding current voucher)
          const [duplicateVoucher] = await connection.query(
              'SELECT id FROM journal_vouchers WHERE voucher_no = ? AND id != ? AND is_active = TRUE',
              [voucherData.voucher_no, id]
          );
  
          if (duplicateVoucher.length > 0) {
              throw new Error('Voucher number already exists');
          }
  
          // Update voucher
          await connection.query(`
              UPDATE journal_vouchers 
              SET voucher_no = ?, date = ?, payment_type = ?, total_amount = ?, 
                  remarks = ?, updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
          `, [
              voucherData.voucher_no,
              voucherData.date,
              voucherData.payment_type,
              voucherData.total_amount,
              voucherData.remarks || null,
              id
          ]);
  
          // Delete existing entries (hard delete for entries as they're recreated)
          await connection.query(
              'DELETE FROM journal_voucher_entries WHERE voucher_id = ?',
              [id]
          );
  
          // Create new entries
          for (let i = 0; i < entries.length; i++) {
              const entry = entries[i];
              await connection.query(`
                  INSERT INTO journal_voucher_entries 
                  (voucher_id, entry_no, debit_account_head_id, debit_account_subhead_id, 
                   credit_account_head_id, credit_account_subhead_id, amount, remarks)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `, [
                  id,
                  i + 1,
                  entry.debit_account_head_id,
                  entry.debit_account_subhead_id,
                  entry.credit_account_head_id,
                  entry.credit_account_subhead_id,
                  entry.amount,
                  entry.remarks || null
              ]);
          }
  
          await connection.commit();
  
          return {
              success: true,
              data: { id, voucher_no: voucherData.voucher_no }
          };
      } catch (error) {
          await connection.rollback();
          console.error('Error in update:', error);
          return {
              success: false,
              error: error.message || 'Failed to update journal voucher'
          };
      } finally {
          connection.release();
      }
    }

    // ✅ Delete voucher (soft delete)
    static async delete(id) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // Pre-check: Verify tables exist
            const tablesExist = await this.checkTablesExist();
            if (!tablesExist) {
                throw new Error('Required database tables are missing');
            }

            // Pre-check: Verify voucher exists
            const [existing] = await connection.query(
                'SELECT id FROM journal_vouchers WHERE id = ? AND is_active = TRUE',
                [id]
            );

            if (existing.length === 0) {
                throw new Error('Journal voucher not found');
            }

            // Soft delete voucher and entries
            await connection.query(
                'UPDATE journal_vouchers SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [id]
            );

            await connection.query(
                'UPDATE journal_voucher_entries SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE voucher_id = ?',
                [id]
            );

            await connection.commit();

            return {
                success: true,
                data: { id }
            };
        } catch (error) {
            await connection.rollback();
            console.error('Error in delete:', error);
            return {
                success: false,
                error: error.message || 'Failed to delete journal voucher'
            };
        } finally {
            connection.release();
        }
    }

    // ✅ Get account data for dropdowns
    static async getAccountData() {
        try {
            // Get active account heads
            const [accountHeads] = await db.query(`
                SELECT id, account_head as name, account_type
                FROM account_heads 
                WHERE is_active = TRUE 
                ORDER BY account_head
            `);

            // Payment types
            const paymentTypes = ['Cash', 'Bank', 'Credit', 'Cheque', 'Online Transfer', 'Other'];

            return {
                success: true,
                data: {
                    accountHeads,
                    paymentTypes
                }
            };
        } catch (error) {
            console.error('Error in getAccountData:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch account data'
            };
        }
    }

    // ✅ Get sub accounts for account head
    static async getSubAccounts(accountHeadId) {
        try {
            const [subAccounts] = await db.query(`
                SELECT id, sub_account_head as name
                FROM sub_account_heads 
                WHERE account_head_id = ? AND is_active = TRUE 
                ORDER BY sub_account_head
            `, [accountHeadId]);

            return {
                success: true,
                data: subAccounts
            };
        } catch (error) {
            console.error('Error in getSubAccounts:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch sub accounts'
            };
        }
    }
}

module.exports = JournalVoucher;
