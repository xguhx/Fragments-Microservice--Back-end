// Use https://www.npmjs.com/package/nanoid to create unique IDs
const { nanoid } = require('nanoid');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
var md = require('markdown-it')();
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
   * Check for the url and convert the result
   * @returns object
   */
  async convertData(data, ext2) {
    if (ext2 == '.html') {
      logger.debug({ data }, 'Before ToString');

      data = md.render(data.toString('utf-8'));

      logger.debug({ data }, 'After ToString');

      data = Buffer.from(data, 'utf-8');

      logger.debug({ data }, 'After Converting to Buffer again');
    }

    return data;
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
