// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */

//Post will get create a new fragment and save it
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  if (!Buffer.isBuffer(req.body)) {
    res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
  } else {
    try {
      logger.info('before save');

      //error here
      await Fragment.save();
      logger.info('after save');
      await Fragment.setData(req.body);
      logger.info('after saveData');

      res.set('Content-Type', Fragment.type);

      res.status(201).json(
        createSuccessResponse({
          fragment: Fragment,
        })
      );
    } catch (err) {
      res.status(400).json(createErrorResponse(400, 'Something when Wrong: ', err));
    }
  }
};
