// src/routes/api/getid.js
const { Fragment } = require('../../model/fragment');
/**
 * Get a list of fragments for the current user
 */

module.exports = async (req, res) => {
  //Parse Data
  let fragment;
  let data;
  try {
    fragment = await Fragment.byId(req.user, req.params.id);
    data = fragment.getData();
  } catch (err) {
    res.status(400).json('Error requesting fragment');
  }
  res.status(200).json(data);
};
