const SubAccountHead = require('../models/SubAccountHead');
const db = require('../../../config/db');

exports.getAll = async (req, res) => {
    try {
        const { includeInactive = 'false' } = req.query;
        const includeInactiveFlag = includeInactive === 'true';
        
        const [rows] = await SubAccountHead.getAll(includeInactiveFlag);
        
        // Format response to match frontend expectations
        const formattedRows = rows.map(row => ({
            id: row.id,
            account_head_id: row.account_head_id,
            account_head: row.account_head,
            account_type: row.account_type,
            sub_account_head: row.sub_account_head,
            description: row.description,
            is_active: row.is_active,
            created_at: row.created_at,
            updated_at: row.updated_at
        }));
        
        res.json({
            success: true,
            message: 'Sub account heads retrieved successfully',
            data: formattedRows,
            meta: {
                includeInactive: includeInactiveFlag,
                total: formattedRows.length
            }
        });
    } catch (err) {
        console.error('Get all sub account heads error:', err);
        res.status(500).json({ 
            success: false,
            error: 'Server Error', 
            details: err.message 
        });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const { includeInactive = 'false' } = req.query;
        const includeInactiveFlag = includeInactive === 'true';
        
        const [rows] = await SubAccountHead.getById(id, includeInactiveFlag);
        
        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Sub Account Head not found' 
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (err) {
        console.error('Get sub account head by ID error:', err);
        res.status(500).json({ 
            success: false,
            error: 'Server Error', 
            details: err.message 
        });
    }
};

exports.create = async (req, res) => {
    try {
        const { account_head, sub_account_head, description } = req.body;
        
        // Validation
        if (!account_head || !sub_account_head) {
            return res.status(400).json({ 
                success: false,
                error: 'Account head and sub account head are required' 
            });
        }

        // Get account_head_id from account_head name (only active ones)
        const [accountHeadRows] = await SubAccountHead.getAccountHeadIdByName(account_head);
        
        if (accountHeadRows.length === 0) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid or inactive account head' 
            });
        }
        
        const account_head_id = accountHeadRows[0].id;

        // Check if sub account head already exists
        const [existingRows] = await SubAccountHead.checkExists(account_head_id, sub_account_head);
        if (existingRows.length > 0) {
            return res.status(400).json({ 
                success: false,
                error: 'Sub Account Head already exists for this Account Head' 
            });
        }

        await SubAccountHead.create({ 
            account_head_id, 
            sub_account_head: sub_account_head.trim(),
            description: description?.trim() || null
        });
        
        res.status(201).json({ 
            success: true,
            message: 'Sub Account Head created successfully' 
        });
    } catch (err) {
        console.error('Create sub account head error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ 
                success: false,
                error: 'Sub Account Head already exists' 
            });
        } else {
            res.status(500).json({ 
                success: false,
                error: 'Creation failed', 
                details: err.message 
            });
        }
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { account_head, sub_account_head, description } = req.body;
        
        // Validation
        if (!account_head || !sub_account_head) {
            return res.status(400).json({ 
                success: false,
                error: 'Account head and sub account head are required' 
            });
        }

        // Check if record exists (including inactive)
        const [existingRows] = await SubAccountHead.getById(id, true);
        if (existingRows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Sub Account Head not found' 
            });
        }

        // Get account_head_id from account_head name (only active ones)
        const [accountHeadRows] = await SubAccountHead.getAccountHeadIdByName(account_head);
        
        if (accountHeadRows.length === 0) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid or inactive account head' 
            });
        }
        
        const account_head_id = accountHeadRows[0].id;

        // Check if sub account head already exists (excluding current record)
        const [duplicateRows] = await SubAccountHead.checkExists(account_head_id, sub_account_head, id);
        if (duplicateRows.length > 0) {
            return res.status(400).json({ 
                success: false,
                error: 'Sub Account Head already exists for this Account Head' 
            });
        }

        await SubAccountHead.update(id, { 
            account_head_id, 
            sub_account_head: sub_account_head.trim(),
            description: description?.trim() || null
        });
        
        res.json({ 
            success: true,
            message: 'Sub Account Head updated successfully' 
        });
    } catch (err) {
        console.error('Update sub account head error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ 
                success: false,
                error: 'Sub Account Head already exists' 
            });
        } else {
            res.status(500).json({ 
                success: false,
                error: 'Update failed', 
                details: err.message 
            });
        }
    }
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if record exists (including inactive)
        const [existingRows] = await SubAccountHead.getById(id, true);
        if (existingRows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Sub Account Head not found' 
            });
        }

        await SubAccountHead.delete(id);
        res.json({ 
            success: true,
            message: 'Sub Account Head deleted successfully' 
        });
    } catch (err) {
        console.error('Delete sub account head error:', err);
        res.status(500).json({ 
            success: false,
            error: 'Delete failed', 
            details: err.message 
        });
    }
};

// Toggle sub account head status
exports.toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if record exists (including inactive)
        const [existingRows] = await SubAccountHead.getById(id, true);
        if (existingRows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Sub Account Head not found' 
            });
        }

        await SubAccountHead.toggleStatus(id);
        
        // Get updated record
        const [updatedRows] = await SubAccountHead.getById(id, true);
        
        const statusText = updatedRows[0].is_active ? 'activated' : 'deactivated';
        
        res.json({ 
            success: true,
            message: `Sub Account Head ${statusText} successfully`,
            data: updatedRows[0]
        });
    } catch (err) {
        console.error('Toggle sub account head status error:', err);
        res.status(500).json({ 
            success: false,
            error: 'Status toggle failed', 
            details: err.message 
        });
    }
};

// Get account heads for dropdown (only active ones)
exports.getAccountHeads = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, account_head, account_type, description FROM account_heads WHERE is_active = TRUE ORDER BY account_head'
        );
        
        res.json({
            success: true,
            message: 'Active account heads retrieved successfully',
            data: {
                data: rows,
                total: rows.length,
                page: 1,
                limit: 100,
                totalPages: 1
            }
        });
    } catch (err) {
        console.error('Get account heads error:', err);
        res.status(500).json({ 
            success: false,
            error: 'Server Error', 
            details: err.message 
        });
    }
};

// Get status counts
exports.getStatusCounts = async (req, res) => {
    try {
        const [rows] = await SubAccountHead.getStatusCounts();
        
        res.json({
            success: true,
            message: 'Status counts retrieved successfully',
            data: rows[0]
        });
    } catch (err) {
        console.error('Get status counts error:', err);
        res.status(500).json({ 
            success: false,
            error: 'Server Error', 
            details: err.message 
        });
    }
};

// Restore soft-deleted sub account head
exports.restore = async (req, res) => {
    try {
        const { id } = req.params;
        
        await SubAccountHead.restore(id);
        res.json({ 
            success: true,
            message: 'Sub Account Head restored successfully' 
        });
    } catch (err) {
        console.error('Restore sub account head error:', err);
        res.status(500).json({ 
            success: false,
            error: 'Restore failed', 
            details: err.message 
        });
    }
};
