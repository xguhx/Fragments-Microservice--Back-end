// Use https://www.npmjs.com/package/nanoid to create unique IDs
const { nanoid } = require('nanoid');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
var md = require('markdown-it')();
const sharp = require('sharp');
const logger = require('../logger');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id = nanoid(), ownerId, created, updated, type, size = 0 }) {
    if (!ownerId || !type) throw 'Missing Arguments on Fragment constructor';

    if (isNaN(size) || size < 0 || typeof size != 'number') throw 'Size is not a Number';

    if (!Fragment.isSupportedType(type)) {
      throw 'Wrong Type';
    }

    this.id = id;
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    //Professor Example on https://github.com/humphd/ccp555-winter-2022/discussions/51
    try {
      logger.debug({ ownerId, expand }, 'Fragment.byUser()');
      const fragments = await listFragments(ownerId, expand);
      return expand ? fragments.map((fragment) => new Fragment(fragment)) : fragments;
    } catch (err) {
      // A user might not have any fragments (yet), so return an empty
      // list instead of an error when there aren't any.
      return [];
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    try {
      logger.debug({ ownerId, id }, 'Fragment.byId() OwnderId and Id');

      let fragments = await readFragment(ownerId, id);
      if (!fragments) throw 'No User Found!';

      return fragments;
    } catch (err) {
      throw new Error(err);
      //return Promise.reject(new Error('No User Found:', err));
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    // this.byId(ownerId, id).then((a) => {
    //   if (a == undefined) {
    //     throw 'Error';
    //   }
    // });
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Check for the extension to see if it can be converted to a text type
   * @returns bool
   */
  checkTextExtension(ext2) {
    const textTypes = ['plain', 'markdown', 'json', 'html'];

    if (textTypes.find((element) => element == ext2)) return true;

    return false;
  }

  /**
   * Check for the extension to see if it can be converted to a image type
   * @returns bool
   */
  checkImageExtension(ext2) {
    const imageTypes = ['png', 'jpeg', 'webp', 'gif'];

    if (imageTypes.find((element) => element == ext2)) return true;

    return false;
  }

  /**
   * Check for the url and convert the result
   * @returns object
   */
  async convertData(buffer, ext2, fragment) {
    //Parse Text and Images here
    //Sharp
    //https://www.npmjs.com/package/sharp
    //https://sharp.pixelplumbing.com/api-output#toformat
    let data;

    try {
      if (this.checkImageExtension(ext2)) {
        data = await sharp(buffer).toFormat(ext2).toBuffer();
        return data;
      }
    } catch (err) {
      throw 'Error parsing image';
    }

    //MD
    if (this.checkTextExtension(ext2)) {
      if (ext2 == 'html' && fragment.mimeType.startsWith('text/')) {
        data = buffer;
        logger.debug({ data }, 'Before ToString');

        data = md.render(data.toString('utf-8'));

        logger.debug({ data }, 'After ToString');

        data = Buffer.from(data, 'utf-8');

        logger.debug({ data }, 'After Converting to Buffer again');
        return data;
      }

      //JSON
      if (
        ext2 == 'json' &&
        (fragment.mimeType.startsWith('text/') || fragment.mimeType.startsWith('application'))
      ) {
        data = buffer;
        data = JSON.parse(data.toString('utf-8'));

        data = Buffer.from(JSON.stringify(data), 'utf-8');

        logger.debug({ data }, 'After Converting to Buffer again');
        return data;
      }

      if (ext2 == 'plain' && fragment.mimeType.startsWith('text/')) {
        //Quote from David:
        //"Converting" something like text/html or text/markdown to text/plain means serving it with the text/plain mime type.
        //You don't need to do anything to the content.
        return data;
      }
    } else {
      throw new Error();
    }
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    try {
      if (!data || data == undefined) {
        throw 'no Buffer in setData!';
      }
      this.size = data.byteLength;
      this.updated = new Date().toISOString();
      return writeFragmentData(this.ownerId, this.id, data);
    } catch (err) {
      return Promise.reject(new Error('Error in setData:', err));
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.mimeType.startsWith('text/') ? true : false;
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    return [
      'text/plain',
      'application/json',
      'text/markdown',
      'text/html',
      'image/png',
      'image/jpeg',
      'image/webp',
    ];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    return value.startsWith('text/') ||
      value.startsWith('application/json') ||
      value.startsWith('image/')
      ? true
      : false;
  }
}

module.exports.Fragment = Fragment;
