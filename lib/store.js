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

const Store = {
  files: files,
  createDocument(type, data) {
    try {
      return Object.assign(this.files['base'], this.files[type](data));
    } 
    catch (e) {
      console.warn('Whoops, you need to create that model.', e);
    }
  },
  findDocument(type, data) {
    return db.getDb().collection(type).findOne(data)
      .then((result) => {
        if (result === null) {
          return {};
        } else {
          return result;
        }
      })
  },
  saveDocument(type, document) {
    const coll = db.getDb().collection(type);
    const data = document.data;
    // Consider using an index to force uniqueness
    return coll.update({ title: data.title }, data, { upsert: true });
  },
  destroyDocument(type, data) {
    const coll = db.getDb().collection(type);
    return coll.deleteOne(data);
  },
}

module.exports = Store;