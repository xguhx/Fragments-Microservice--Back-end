// src/routes/api/getid.js
const { Fragment } = require('../../model/fragment');
/**
 * Get a list of fragments for the current user
 */

const { createSuccessResponse } = require('../../response');
module.exports = async (req, res) => {
  //Parse Data
  let fragment;

  //let buffer;
  try {
    fragment = await Fragment.byId(req.user, req.params.id);

    // buffer = Buffer.from(data, 'utf-8');
  } catch (err) {
    return res.status(400).json('Error requesting fragment');
  }
  //a2
  res.set('Content-Type', fragment.type);

  return res.status(200).json(createSuccessResponse({ fragment }));
};
