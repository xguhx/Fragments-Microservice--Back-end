// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  let fragments;
  try {
    fragments = await Fragment.byUser(req.user, req.query.expand === '1');

    res.status(200).json(createSuccessResponse({ fragments }));
  } catch (err) {
    res.status(400).json(createErrorResponse(400, 'Not able to fetch fragments'));
  }
};
