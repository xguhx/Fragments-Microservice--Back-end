// src/routes/api/getid.js
const { Fragment } = require('../../model/fragment');
const path = require('path');

/**
 * Get a fragments for the current user
 */
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  let url = req.originalUrl;

  //https://www.kindacode.com/article/node-js-get-file-name-and-extension-from-path-url/
  const name2 = path.basename(url);
  const ext2 = path.extname(url);
  const nameWithoutExt2 = path.basename(name2, ext2);
  req.params.id = nameWithoutExt2;

  //Parse Data
  let fragment;
  let data;
  try {
    fragment = new Fragment(await Fragment.byId(req.user, req.params.id));

    data = await fragment.getData();
    data = fragment.convertData(data, ext2);
  } catch (err) {
    logger.debug({ err }, 'Error on requesting Fragment');
    return res.status(404).json(createErrorResponse(404, ': Error requesting fragment: ' + err));
  }
  //a2
  res.setHeader('Content-Type', fragment.type);
  res.setHeader('Content-Length', fragment.size);

  //We send it using .send because the buffer will be automatically converted.
  //We dont use json or toString.

  return res.status(200).send(data);
};
