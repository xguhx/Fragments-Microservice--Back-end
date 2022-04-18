// src/routes/api/getid.js
const { Fragment } = require('../../model/fragment');
const path = require('path');

/**
 * Get a fragment for the current user
 */
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  let url = req.originalUrl;

  //https://www.kindacode.com/article/node-js-get-file-name-and-extension-from-path-url/
  const name2 = path.basename(url);
  let ext2 = path.extname(url);
  const nameWithoutExt2 = path.basename(name2, ext2);
  req.params.id = nameWithoutExt2;

  //Parse Data
  let fragment;
  let data;
  try {
    //This [new Fragment()] is needed because the SDK was not allowing me use getData() in a fragment without making a new fragment.
    fragment = new Fragment(await Fragment.byId(req.user, req.params.id));
    data = await fragment.getData();
    ext2 ? (ext2 = ext2.substring(1)) : '';
  } catch (err) {
    logger.debug({ err }, 'Error on requesting Fragment');
    return res.status(404).json(createErrorResponse(404, ': Error requesting fragment: ' + err));
  }

  if (ext2) {
    try {
      data = await fragment.convertData(data, ext2, fragment);
    } catch (err) {
      return res
        .status(415)
        .json(createErrorResponse(415, 'Unsupported Media Type for conversion: ' + err));
    }

    res.setHeader(
      'Content-Type',
      fragment.type.substring(0, fragment.type.indexOf('/')) + '/' + ext2
    );
  } else {
    res.setHeader('Content-Type', fragment.type);
  }

  res.setHeader('Content-Length', fragment.size);

  //We send it using .send because the buffer will be automatically converted.
  //We dont use json or toString.

  return res.status(200).send(data);
};
