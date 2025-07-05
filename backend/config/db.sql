-- Create database
CREATE DATABASE IF NOT EXISTS logistics_db;
USE logistics_db;

-- ============================
-- Table: users
-- ============================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_name VARCHAR(255) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nationality VARCHAR(100),
  passport_no VARCHAR(50),
  address TEXT,
  phone_no VARCHAR(20),
  license_no VARCHAR(50),
  is_admin BOOL DEFAULT FALSE,  -- Changed from TINYINT(1) to BOOL
  is_protected BOOL DEFAULT FALSE,  -- Changed from TINYINT(1) to BOOL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================
-- Initial Admin User
-- ============================
INSERT INTO users (
  employee_name, username, email, password,
  nationality, passport_no, address, phone_no,
  license_no, is_admin, is_protected
) VALUES (
  'System Administrator',
  'admin',
  'admin@example.com',
  '$2b$10$as3I1GONeAmrao6lKRV32urHnBE0tCDB74yf0sZHjjDfp35XUEo.e', -- hashed 'admin123'
  'N/A',
  'N/A',
  'Head Office',
  '0000000000',
  'N/A',
  1,
  1
);


-- ============================
-- Table: categories
-- ============================
CREATE TABLE IF NOT EXISTS categories (
  sino INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
drop table categories;
-- ============================
-- Table: commodities
-- ============================
CREATE TABLE IF NOT EXISTS commodities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_sino INT,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_sino) REFERENCES categories(sino)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- ============================
-- Table: vessels
-- ============================
CREATE TABLE IF NOT EXISTS vessels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- Table: containers
-- ============================
CREATE TABLE IF NOT EXISTS containers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- Table: ports
-- ============================
CREATE TABLE IF NOT EXISTS ports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- Table: banks
-- ============================
CREATE TABLE IF NOT EXISTS banks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  branch_no VARCHAR(50),
  account_name VARCHAR(255) NOT NULL,
  account_no VARCHAR(255) NOT NULL,
  iban VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- Table: clients
-- ============================
CREATE TABLE IF NOT EXISTS clients (
  client_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry_type VARCHAR(100),
  phone1 VARCHAR(20),
  phone2 VARCHAR(20),
  phone3 VARCHAR(20),
  credit_limit DECIMAL(15,2),
  val_no VARCHAR(50),
  commercial_reg_no VARCHAR(100),
  cpi VARCHAR(100),
  notes TEXT,
  shipper VARCHAR(100),
  ar_name VARCHAR(255),
  cpi_position VARCHAR(100),
  agent_name VARCHAR(255),
  address TEXT,
  country VARCHAR(100),
  cp1_email VARCHAR(255),       -- renamed from cpi_email
  agent_en_name VARCHAR(255),
  city VARCHAR(100),
  agent_ar_name VARCHAR(255),
  cp1 VARCHAR(100),             -- added contact person 1
  cp1_position VARCHAR(100),    -- added contact person 1 position
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * from clients;
-- ============================
-- Trigger: Prevent Deletion of Protected Users
-- ============================
DELIMITER //

CREATE TRIGGER prevent_protected_delete
BEFORE DELETE ON users
FOR EACH ROW
BEGIN
  IF OLD.is_protected = TRUE THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Cannot delete a protected employee record.';
  END IF;
END;
//

DELIMITER ;

CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    vat_number VARCHAR(50),
    registration_number VARCHAR(50),
    registration_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS supplier_assignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  supplier_id INT NOT NULL,
  supplier_invoice_no VARCHAR(50) NOT NULL,
  job_number VARCHAR(50) NOT NULL,
  invoice_date DATE NOT NULL,
  vat_rate DECIMAL(5,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  vat_amount DECIMAL(10,2) NOT NULL,
  bill_total_with_vat DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS supplier_assignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  supplier_id INT NOT NULL,
  supplier_invoice_no VARCHAR(50) NOT NULL,
  job_number VARCHAR(50) NOT NULL,
  invoice_date DATE NOT NULL,
  vat_rate DECIMAL(5,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  vat_amount DECIMAL(10,2) NOT NULL,
  bill_total_with_vat DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Foreign Keys
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
  FOREIGN KEY (job_number, supplier_invoice_no)
    REFERENCES invoices(job_number, invoice_no)
    ON DELETE CASCADE
);

drop table supplier_assignment;
CREATE TABLE IF NOT EXISTS supplier_assignment_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  assignment_id INT NOT NULL,
  purpose VARCHAR(255),
  item VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2),
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES supplier_assignments(id) ON DELETE CASCADE
);

-- CREATE TABLE IF NOT EXISTS supplier_invoices (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     supplier_id INT NOT NULL,
--     job_number VARCHAR(50),
--     invoice_no VARCHAR(50) NOT NULL,
--     invoice_date DATE NOT NULL,
--     bill_amount_without_vat DECIMAL(15,2) NOT NULL,
--     vat_amount DECIMAL(15,2) NOT NULL,
--     bill_amount DECIMAL(15,2) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
-- );

CREATE TABLE IF NOT EXISTS supplier_credit_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    credit_note_no VARCHAR(50) NOT NULL,
    credit_note_date DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    vat_amount DECIMAL(15,2) NOT NULL,
    grand_total DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Credit Note Line Items table
CREATE TABLE IF NOT EXISTS credit_note_line_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    credit_note_id INT NOT NULL,
    description TEXT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (credit_note_id) REFERENCES supplier_credit_notes(id)
);


CREATE TABLE invoice_supplier (
    invoice_id INT NOT NULL,
    supplier_id INT NOT NULL,
    PRIMARY KEY(invoice_id, supplier_id),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS supplier_credit_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    credit_note_no VARCHAR(50) NOT NULL,
    credit_note_date DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    vat_amount DECIMAL(15,2) NOT NULL,
    grand_total DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);
TRUNCATE TABLE supplier_payments;

CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_number VARCHAR(50) UNIQUE,
    invoice_no VARCHAR(50) NOT NULL UNIQUE,
    invoice_date DATE NOT NULL,
    bill_amount_without_vat DECIMAL(15,2) NOT NULL,
    vat_amount DECIMAL(15,2) NOT NULL,
    bill_amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE invoices
ADD CONSTRAINT UNIQUE (job_number, invoice_no);


select * from invoices;
CREATE TABLE IF NOT EXISTS payment_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE, -- e.g. 'cash'
    label VARCHAR(100) NOT NULL       -- e.g. 'Cash'
);

INSERT INTO payment_types (code, label) 
VALUES 
  ('cash', 'Cash'), 
  ('bank_transfer', 'Bank Transfer'), 
  ('check', 'Check'), 
  ('card', 'Card');
  
CREATE TABLE IF NOT EXISTS supplier_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voucher_no VARCHAR(50) NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_type_id INT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_type_id) REFERENCES payment_types(id)
);
select * from payment_details;
CREATE TABLE IF NOT EXISTS payment_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id INT NOT NULL,
    supplier_id INT NOT NULL,
    operation_no VARCHAR(50),
    receipt_no VARCHAR(50),
    bill_amount DECIMAL(15,2) NOT NULL,
    paid_amount DECIMAL(15,2) NOT NULL,
    balance_amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES supplier_payments(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);
show tables;

select * from  clearance_operations;
CREATE TABLE clearance_operations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    operation_type ENUM('Export', 'Import') NOT NULL,
    transport_mode ENUM('Land', 'Air', 'Sea') NOT NULL,
    client VARCHAR(255) NOT NULL,
    client_ref_name VARCHAR(255),
    bayan_no VARCHAR(100),
    date DATE,
    yard_date DATE,
    line VARCHAR(255),
    line_agent VARCHAR(255),
    bayan_date DATE,
    hijri_date VARCHAR(50),
    status VARCHAR(100),
    job_no VARCHAR(100) NOT NULL UNIQUE, -- Add UNIQUE constraint here
    vessel VARCHAR(255),
    representative VARCHAR(255),
    payment_date DATE,
    end_date DATE,
    notes TEXT,
    commodity VARCHAR(255),
    net_weight DECIMAL(10, 2),
    receiving_rep VARCHAR(255),
    group_name VARCHAR(100),
    release_date DATE,
    bl VARCHAR(100),
    no_of_packages INT,
    gross_weight DECIMAL(10, 2),
    pod VARCHAR(100),
    shipper VARCHAR(255),
    pol VARCHAR(100),
    eta VARCHAR(100),
    po_no VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  operation_id INT NOT NULL,
  clientRef VARCHAR(255),
  doDate DATE,
  doNo VARCHAR(100),
  endorseNo VARCHAR(100),
  billNo VARCHAR(100),
  FOREIGN KEY (operation_id) REFERENCES clearance_operations(id) ON DELETE CASCADE
);

CREATE TABLE expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    operation_no VARCHAR(50) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    expense_item VARCHAR(255) NOT NULL,
    actual_amount DECIMAL(10, 2) NOT NULL,
    vat_percent DECIMAL(5, 2) DEFAULT 0,
    vat_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (actual_amount + vat_amount) STORED,
    date_of_payment DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (operation_no) REFERENCES invoices (job_number) ON DELETE RESTRICT
);
select * from expenses;
drop table expenses;
CREATE TABLE expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    operation_no VARCHAR(50) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    expense_item_id INT NOT NULL,
    actual_amount DECIMAL(10, 2) NOT NULL,
    vat_percent DECIMAL(5, 2) DEFAULT 0,
    vat_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (actual_amount + vat_amount) STORED,
    date_of_payment DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (operation_no) REFERENCES invoices (job_number) ON DELETE RESTRICT,
    FOREIGN KEY (expense_item_id) REFERENCES expense_items(id) ON DELETE RESTRICT
);

drop table expenses;
CREATE TABLE expense_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

drop table expenses;
CREATE TABLE IF NOT EXISTS credit_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    credit_note_no VARCHAR(50) NOT NULL UNIQUE,
    operation_no VARCHAR(50),
    client_name VARCHAR(255),
    client_name_ar VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_credit_note_no (credit_note_no),
    INDEX idx_operation_no (operation_no),
    INDEX idx_client_name (client_name),
    INDEX idx_date (date),

    CONSTRAINT fk_credit_notes_operation_no
        FOREIGN KEY (operation_no) REFERENCES expenses(operation_no) ON DELETE CASCADE
);

CREATE TABLE profit_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_date DATE NOT NULL,
    job_number VARCHAR(50) NOT NULL,
    supplier_id INT NOT NULL,
    revenue DECIMAL(15,2) NOT NULL,
    cost DECIMAL(15,2) NOT NULL,
    profit DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    INDEX idx_profit_reports_supplier_id (supplier_id),
    INDEX idx_profit_reports_job_number (job_number)
);

-- Account heads table
CREATE TABLE account_heads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    account_type ENUM('Asset', 'Liability', 'Equity', 'Revenue', 'Expense') NOT NULL,
    account_head VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_account_type (account_type),
    INDEX idx_account_head (account_head),
    INDEX idx_is_active (is_active)
);

CREATE TABLE sub_account_heads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    account_head_id INT NOT NULL,
    sub_account_head VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (account_head_id) REFERENCES account_heads(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_sub_account (account_head_id, sub_account_head),
    INDEX idx_account_head_id (account_head_id),
    INDEX idx_sub_account_head (sub_account_head),
    INDEX idx_is_active (is_active)
);


CREATE TABLE opening_balances (
    id INT PRIMARY KEY AUTO_INCREMENT,
    account_head_id INT NOT NULL,
    sub_account_head_id INT NOT NULL,
    balance_date DATE NOT NULL,
    balance_type ENUM('Debit', 'Credit') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    
    -- Foreign key constraints
    FOREIGN KEY (account_head_id) REFERENCES account_heads(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (sub_account_head_id) REFERENCES sub_account_heads(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Indexes for performance
    INDEX idx_account_head_id (account_head_id),
    INDEX idx_sub_account_head_id (sub_account_head_id),
    INDEX idx_balance_date (balance_date),
    INDEX idx_balance_type (balance_type),
    INDEX idx_is_active (is_active),
    
    -- Unique constraint to prevent duplicate entries
    UNIQUE KEY unique_opening_balance (account_head_id, sub_account_head_id, balance_date)
);

CREATE TABLE journal_vouchers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    voucher_no VARCHAR(50) NOT NULL UNIQUE,
    date DATE NOT NULL,
    payment_type ENUM('Cash', 'Bank', 'Credit', 'Cheque', 'Online Transfer', 'Other') NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    status ENUM('Draft', 'Posted', 'Cancelled') DEFAULT 'Posted',
    remarks TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    
    -- Indexes for performance
    INDEX idx_voucher_no (voucher_no),
    INDEX idx_date (date),
    INDEX idx_payment_type (payment_type),
    INDEX idx_status (status),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
);

CREATE TABLE journal_voucher_entries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    voucher_id INT NOT NULL,
    entry_no INT NOT NULL,
    debit_account_head_id INT NOT NULL,
    debit_account_subhead_id INT NOT NULL,
    credit_account_head_id INT NOT NULL,
    credit_account_subhead_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    remarks TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (voucher_id) REFERENCES journal_vouchers(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (debit_account_head_id) REFERENCES account_heads(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (debit_account_subhead_id) REFERENCES sub_account_heads(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (credit_account_head_id) REFERENCES account_heads(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (credit_account_subhead_id) REFERENCES sub_account_heads(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Indexes for performance
    INDEX idx_voucher_id (voucher_id),
    INDEX idx_entry_no (entry_no),
    INDEX idx_debit_account_head (debit_account_head_id),
    INDEX idx_debit_subhead (debit_account_subhead_id),
    INDEX idx_credit_account_head (credit_account_head_id),
    INDEX idx_credit_subhead (credit_account_subhead_id),
    INDEX idx_amount (amount),
    INDEX idx_is_active (is_active),
    
    -- Unique constraint for entry numbering within voucher
    UNIQUE KEY unique_voucher_entry (voucher_id, entry_no)   
);

    -- Check constraint to ensure debit and credit accounts are different
DELIMITER $$

CREATE TRIGGER trg_check_different_accounts
BEFORE INSERT ON journal_voucher_entries
FOR EACH ROW
BEGIN
    IF NEW.debit_account_head_id = NEW.credit_account_head_id AND
       NEW.debit_account_subhead_id = NEW.credit_account_subhead_id THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Debit and credit accounts cannot be the same';
    END IF;
END$$

DELIMITER ;

CREATE TABLE voucher_sequences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    voucher_type ENUM('Journal', 'Payment', 'Receipt', 'Contra') NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    last_number INT NOT NULL DEFAULT 0,
    prefix VARCHAR(10) DEFAULT 'JV',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Unique constraint for voucher type, year, and month
    UNIQUE KEY unique_voucher_sequence (voucher_type, year, month),
    
    -- Indexes
    INDEX idx_voucher_type (voucher_type),
    INDEX idx_year_month (year, month)
);

-- Account Ledger entries table for tracking all transactions
CREATE TABLE account_ledger (
    id INT PRIMARY KEY AUTO_INCREMENT,
    account_head_id INT NOT NULL,
    sub_account_head_id INT NOT NULL,
    transaction_date DATE NOT NULL,
    description TEXT NOT NULL,
    voucher_type ENUM('Journal', 'Payment', 'Receipt', 'Contra', 'Opening') NOT NULL,
    voucher_no VARCHAR(50),
    voucher_id INT,
    reference_no VARCHAR(100),
    debit_amount DECIMAL(15, 2) DEFAULT 0.00,
    credit_amount DECIMAL(15, 2) DEFAULT 0.00,
    running_balance DECIMAL(15, 2) DEFAULT 0.00,
    balance_type ENUM('Dr', 'Cr') DEFAULT 'Dr',
    fiscal_year VARCHAR(10) NOT NULL,
    is_opening_balance BOOLEAN DEFAULT FALSE,
    is_closing_balance BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    
    -- Foreign key constraints
    FOREIGN KEY (account_head_id) REFERENCES account_heads(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (sub_account_head_id) REFERENCES sub_account_heads(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Indexes for performance
    INDEX idx_account_head_date (account_head_id, transaction_date),
    INDEX idx_sub_account_date (sub_account_head_id, transaction_date),
    INDEX idx_voucher_type (voucher_type),
    INDEX idx_voucher_no (voucher_no),
    INDEX idx_fiscal_year (fiscal_year),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_is_active (is_active),
    
    -- Composite indexes for common queries
    INDEX idx_account_date_active (account_head_id, sub_account_head_id, transaction_date, is_active),
    INDEX idx_date_range (transaction_date, is_active)
);

-- Opening balances for each fiscal year
CREATE TABLE opening_balances_yearly (
    id INT PRIMARY KEY AUTO_INCREMENT,
    account_head_id INT NOT NULL,
    sub_account_head_id INT NOT NULL,
    fiscal_year VARCHAR(10) NOT NULL,
    opening_balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    balance_type ENUM('Dr', 'Cr') NOT NULL DEFAULT 'Dr',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (account_head_id) REFERENCES account_heads(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (sub_account_head_id) REFERENCES sub_account_heads(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Unique constraint
    UNIQUE KEY unique_opening_balance (account_head_id, sub_account_head_id, fiscal_year),
    
    -- Indexes
    INDEX idx_fiscal_year (fiscal_year),
    INDEX idx_account_fiscal (account_head_id, sub_account_head_id, fiscal_year)
);

-- Fiscal year configuration
CREATE TABLE fiscal_years (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fiscal_year VARCHAR(10) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_fiscal_year (fiscal_year),
    INDEX idx_current (is_current),
    INDEX idx_date_range (start_date, end_date)
);

INSERT INTO fiscal_years (fiscal_year, start_date, end_date, is_current, is_active) 
VALUES ('2024-25', '2024-04-01', '2025-03-31', TRUE, TRUE);


-- Balance Sheet specific tables
CREATE TABLE account_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('Asset', 'Liability', 'Equity') NOT NULL,
    parent_id INT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES account_categories(id) ON DELETE SET NULL,
    INDEX idx_type (type),
    INDEX idx_sort_order (sort_order),
    INDEX idx_active (is_active)
);

-- Enhanced accounts table for balance sheet
CREATE TABLE balance_sheet_accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    account_head_id INT NOT NULL,
    sub_account_head_id INT NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    opening_balance DECIMAL(18,2) DEFAULT 0.00,
    balance_type ENUM('Dr', 'Cr') DEFAULT 'Dr',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES account_categories(id),
    FOREIGN KEY (account_head_id) REFERENCES account_heads(id),
    FOREIGN KEY (sub_account_head_id) REFERENCES sub_account_heads(id),
    INDEX idx_category (category_id),
    INDEX idx_account_head (account_head_id),
    INDEX idx_sub_account (sub_account_head_id),
    INDEX idx_active (is_active)
);

CREATE TABLE cash_book_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cash_account_head_id INT NOT NULL,
    cash_sub_account_id INT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cash_account_head_id) REFERENCES account_heads(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (cash_sub_account_id) REFERENCES sub_account_heads(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    INDEX idx_cash_account (cash_account_head_id, cash_sub_account_id),
    INDEX idx_is_default (is_default)
);



