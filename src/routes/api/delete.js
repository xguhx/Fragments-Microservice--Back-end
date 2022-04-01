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
    return res.status(404).json(createErrorResponse(404, 'Error deleting fragment'));
  }

  return res.status(200).json(createSuccessResponse());
};
