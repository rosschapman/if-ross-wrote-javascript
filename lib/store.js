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
    return Object.assign(this.files['base'], this.files[type](data));
  }
}

module.exports = Store;