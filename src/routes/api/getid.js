// src/routes/api/get.js
const { Fragment } = require('../../model/fragment');
/**
 * Get a list of fragments for the current user
 */

module.exports = async (req, res) => {
  let fragment = await Fragment.byId(req.user, req.params.id);

  res.status(200).json(fragment);
};
