// src/routes/api/getid.js
const { Fragment } = require('../../model/fragment');
var md = require('markdown-it')();
const path = require('path');

/**
 * Get a list of fragments for the current user
 */
//const logger = require('../../logger');

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
    fragment = await Fragment.byId(req.user, req.params.id);

    data = await fragment.getData();

    //Should i make it a string? or leave as a buffer?
    data = data.toString('utf-8');

    //.md or /html?
    if (ext2 == '.md') {
      data = md.render(data);
    }
  } catch (err) {
    res.status(400).json('Error requesting fragment');
  }
  //a2
  res.set('Content-Type', fragment.type);

  res.status(200).json(data);
};
