//Put will REPLACE a fragment and save it
//PUT /fragments can create any supported text, image or JSON fragments, with tests. See 4.3.

const { createSuccessResponse, createErrorResponse } = require('../../response');
const API_URL = process.env.API_URL;
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  //Check if Fragment Exists:
  let fragment;
  try {
    fragment = new Fragment(await Fragment.byId(req.user, req.params.id));
  } catch (err) {
    return res.status(404).json(createErrorResponse(404, 'No Fragment was found with this id'));
  }

  if (!Buffer.isBuffer(req.body)) {
    return res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
  }

  try {
    //set new content type
    fragment.type = req.get('Content-Type');

    await fragment.setData(req.body);
    await fragment.save();
    logger.info('after saveData');

    const requestedFragment = await Fragment.byId(req.user, fragment.id);
    logger.debug({ requestedFragment }, 'REQUESTED FRAGMENT FROM DB');

    logger.debug({ fragment }, 'Created Fragment');
    res.setHeader('Location', API_URL + '/v1/fragments/' + fragment.id);
    res.setHeader('content-type', fragment.type);

    return res.status(201).json(
      createSuccessResponse({
        fragment: fragment,
        formats: fragment.formats,
      })
    );
  } catch (err) {
    logger.fatal({ err }, 'Put Error');
    res.status(400).json(createErrorResponse(400, `Something went wrong in Put: ${err.message} `));
  }
};
