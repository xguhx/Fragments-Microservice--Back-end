// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */

//Post will get create a new fragment and save it
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  if (!Buffer.isBuffer(req.body)) {
    res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
  } else {
    try {
      const fragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });
      await fragment.save();
      await fragment.setData(req.body);

      res.set('Content-Type', fragment.type);

      res.status(201).json(
        createSuccessResponse({
          fragment: fragment,
        })
      );
    } catch (err) {
      res.status(400).json(createErrorResponse(400, 'Something when Wrong: ', err));
    }
  }
};
