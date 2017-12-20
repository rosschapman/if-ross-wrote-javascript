// eslint-disable-line global-require
const fs = require('fs');
const path = require('path');

let files = {};
fs.readdirSync(path.join(__dirname, '../', 'models')).forEach((file) => {
  if (path.extname(file) === '.js') {
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
  }
}

module.exports = Store;