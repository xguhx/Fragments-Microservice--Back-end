// src/routes/api/getid.js
const { Fragment } = require('../../model/fragment');
/**
 * Get a fragment metadata for the current user
 */

const { createSuccessResponse, createErrorResponse } = require('../../response');
module.exports = async (req, res) => {
  let fragment;

  try {
    fragment = await Fragment.byId(req.user, req.params.id);
  } catch (err) {
    return res.status(400).json(createErrorResponse('Error requesting fragment'));
  }
  //a2
  res.set('Content-Type', fragment.type);

  return res.status(200).json(createSuccessResponse({ fragment }));
};
