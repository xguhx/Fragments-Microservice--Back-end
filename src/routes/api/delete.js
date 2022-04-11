// DELETE /fragments/:id
// src/routes/api/delete.js

/**
 * Delete a fragment for the current user
 */
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    await Fragment.delete(req.user, req.params.id);
  } catch (err) {
    return res.status(400).json(createErrorResponse(400, 'Error deleting fragment: ' + err));
  }

  return res.status(200).json(createSuccessResponse());
};
