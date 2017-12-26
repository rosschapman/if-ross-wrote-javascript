// eslint-disable-line global-require
const fs = require('fs');
const path = require('path');
const db = require('./db');

let files = {};
fs.readdirSync(path.join(__dirname, '../', 'models')).forEach((file) => {
  if (/\.js$/.test(file)) {
    files[path.basename(file, '.js')] = require(`../models/${file}`);
  }
});

module.exports = {
  files: files,
  createDocument(type, data) {
    try {
      return this._composeDocumentModel(type, data);
    } 
    catch (e) {
      console.warn('Whoops, you need to create that model.', e);
    }
  },
  findDocument(type, data) {
    const collectionName = type + 's';
    return db.getDb().collection(collectionName).findOne(data)
      .then((result) => {
        if (result === null) {
          return {};
        } else {
          return this._composeDocumentModel(type, data);
        }
      });
  },

  // TODO: consider moving private methods to utility classes
  _composeDocumentModel(type, data) {
    return Object.assign(this.files['base'], this.files[type](this._serializeData(data)));
  },
  _serializeData(object) {
    object.startedAt = new Date();
    return object;
  }
}