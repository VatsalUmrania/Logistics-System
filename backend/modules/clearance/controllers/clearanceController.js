const model = require('../models/clearanceModel');

exports.getAll = (req, res) => {
  model.getAll(res);
};

exports.create = (req, res) => {
  model.create(req.body, res);
};

exports.update = (req, res) => {
  model.update(req.params.id, req.body, res);
};

exports.remove = (req, res) => {
  model.remove(req.params.id, res);
};
