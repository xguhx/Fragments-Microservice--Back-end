//Post will get create a new fragment and save it
//POST /fragments can create any supported text, image or JSON fragments, with tests. See 4.3.

const { createSuccessResponse, createErrorResponse } = require('../../response');
const API_URL = process.env.API_URL;
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  if (!Buffer.isBuffer(req.body)) {
    res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
    return;
  }
  try {
    logger.info('before creating fragment');
    const myFragment = new Fragment({
      ownerId: req.user,
      type: req.get('Content-Type'),
      size: req.body.byteLength,
    });

    logger.info('before save');
    await myFragment.save();
    logger.info('after save');

    await myFragment.setData(req.body);
    logger.info('after setData');

    let requestedFragment = await Fragment.byId(req.user, myFragment.id);
    logger.debug({ requestedFragment }, 'REQUESTED FRAGMENT FROM DB');

    logger.debug({ myFragment }, 'Created Fragment');
    res.setHeader('Location', API_URL + '/v1/fragments/' + myFragment.id);
    res.setHeader('content-type', myFragment.type);

    return res.status(201).json(
      createSuccessResponse({
        fragment: myFragment,
      })
    );
  } catch (err) {
    res.status(400).json(createErrorResponse(400, 'Something when Wrong in Post: ', err));
  }
};
