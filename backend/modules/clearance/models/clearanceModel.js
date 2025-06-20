const db = require('../../../config/db');

exports.getAll = (res) => {
  const sql = `SELECT * FROM clearance_operations;`;

  db.query(sql, (err, ops) => {
    if (err) return res.status(500).send(err);

    const opIds = ops.map(op => op.id);
    if (opIds.length === 0) return res.json([]);

    const getContainers = `SELECT * FROM containers WHERE operation_id IN (${opIds.join(',')})`;
    const getBills = `SELECT * FROM bills WHERE operation_id IN (${opIds.join(',')})`;

    db.query(getContainers, (err, containers) => {
      if (err) return res.status(500).send(err);
      db.query(getBills, (err, bills) => {
        if (err) return res.status(500).send(err);
        const result = ops.map(op => ({
          ...op,
          containers: containers.filter(c => c.operation_id === op.id),
          bills: bills.filter(b => b.operation_id === op.id),
        }));
        res.json(result);
      });
    });
  });
};

exports.create = (data, res) => {
  const {
    id,
    containers,
    bills,
    ...fields
  } = data;

  db.query('INSERT INTO clearance_operations SET ?', { id, ...fields }, (err) => {
    if (err) return res.status(500).send(err);

    const containerValues = containers.map(c => [c.id, id, c.qty, c.type]);
    const billValues = bills.map(b => [b.id, id, b.clientRef, b.doDate, b.doNo, b.endorseNo, b.billNo]);

    db.query('INSERT INTO containers (id, operation_id, qty, type) VALUES ?', [containerValues], (err) => {
      if (err) return res.status(500).send(err);
      db.query('INSERT INTO bills (id, operation_id, clientRef, doDate, doNo, endorseNo, billNo) VALUES ?', [billValues], (err) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: 'Operation created successfully' });
      });
    });
  });
};

exports.update = (id, data, res) => {
  const {
    containers,
    bills,
    ...fields
  } = data;

  db.query('UPDATE clearance_operations SET ? WHERE id = ?', [fields, id], (err) => {
    if (err) return res.status(500).send(err);

    db.query('DELETE FROM containers WHERE operation_id = ?', [id], (err) => {
      if (err) return res.status(500).send(err);

      db.query('DELETE FROM bills WHERE operation_id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);

        const containerValues = containers.map(c => [c.id, id, c.qty, c.type]);
        const billValues = bills.map(b => [b.id, id, b.clientRef, b.doDate, b.doNo, b.endorseNo, b.billNo]);

        db.query('INSERT INTO containers (id, operation_id, qty, type) VALUES ?', [containerValues], (err) => {
          if (err) return res.status(500).send(err);
          db.query('INSERT INTO bills (id, operation_id, clientRef, doDate, doNo, endorseNo, billNo) VALUES ?', [billValues], (err) => {
            if (err) return res.status(500).send(err);
            res.send({ message: 'Operation updated successfully' });
          });
        });
      });
    });
  });
};

exports.remove = (id, res) => {
  db.query('DELETE FROM clearance_operations WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Operation deleted successfully' });
  });
};
