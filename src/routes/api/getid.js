// src/routes/api/getid.js
const { Fragment } = require('../../model/fragment');
var md = require('markdown-it')();
const path = require('path');

/**
 * Get a list of fragments for the current user
 */
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
    fragment = await Fragment.byId(req.user, req.params.id);

    data = await fragment.getData();
    // logger.debug({ data }, 'Data direct from fragment');

    //FIX THIS FOR JSON
    if (fragment.type == 'application/json') {
      try {
        var temp = JSON.parse(data.toString());

        data = new Buffer.from(temp.data.toString('utf-8'));
        data = JSON.stringify(data);
      } catch (e) {
        res.status(400).json('Invalid Json');
      }
    } else {
      logger.info('IM NOT JSON');
      data = data.toString('utf-8');
    }

    if (ext2 == '.md') {
      data = md.render(data);
    }
    // buffer = Buffer.from(data, 'utf-8');
  } catch (err) {
    res.status(400).json('Error requesting fragment');
  }
  //a2
  res.set('Content-Type', fragment.type);

  res.status(200).json(data);
};
