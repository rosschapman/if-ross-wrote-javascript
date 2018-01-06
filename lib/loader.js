// Unused model loader, but always keep your unused code
let files = {};
fs.readdirSync(path.join(__dirname, '../', 'models')).forEach((file) => {
	if (/\.js$/.test(file)) {
		files[path.basename(file, '.js')] = require(`../models/${file}`);
  }
});