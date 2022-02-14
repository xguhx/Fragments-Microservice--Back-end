// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */

//Post will get create a new fragment and save it
const { createSuccessResponse, createErrorResponse } = require('../../response');
const API_URL = process.env.API_URL;
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  if (!Buffer.isBuffer(req.body)) {
    res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
  } else {
    try {
      const myFragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });

      logger.info('before save');

      //error here
      await myFragment.save();
      logger.info('after save');

      await myFragment.setData(req.body);
      logger.info('after saveData');

      logger.debug({ myFragment }, 'Created Fragment');
      res.set('Location', API_URL + '/fragments/' + myFragment.id);
      res.set('Content-Type', myFragment.type);

      res.status(201).json(
        createSuccessResponse({
          fragment: myFragment,
        })
      );
    } catch (err) {
      res.status(400).json(createErrorResponse(400, 'Something when Wrong: ', err));
    }
  }
};
