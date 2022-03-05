// src/routes/api/getid.js
const { Fragment } = require('../../model/fragment');
/**
 * Get a list of fragments for the current user
 */

module.exports = async (req, res) => {
  //Parse Data
  let fragment;
  let data;
  //let buffer;
  try {
    fragment = await Fragment.byId(req.user, req.params.id);

    data = await fragment.getData();

    // buffer = Buffer.from(data, 'utf-8');
  } catch (err) {
    res.status(400).json('Error requesting fragment');
  }
  res.status(200).json(data.toString('utf-8'));
};
