const db = require('../../../config/db');

const SubAccountHead = {
  getAll: () => db.query('SELECT * FROM sub_account_heads'),
  
  getById: (id) => db.query('SELECT * FROM sub_account_heads WHERE id = ?', [id]),
  
  create: ({ account_head, sub_account_head }) =>
    db.query(
      'INSERT INTO sub_account_heads (account_head, sub_account_head) VALUES (?, ?)',
      [account_head, sub_account_head]
    ),

  update: (id, { account_head, sub_account_head }) =>
    db.query(
      'UPDATE sub_account_heads SET account_head = ?, sub_account_head = ? WHERE id = ?',
      [account_head, sub_account_head, id]
    ),

  delete: (id) => db.query('DELETE FROM sub_account_heads WHERE id = ?', [id])
};

module.exports = SubAccountHead;
