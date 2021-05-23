const fs = require('fs');

module.exports = {
  readStdinJS() {
    return fs.readFileSync(0, 'utf-8');
  },

  writeStdoutJS(content) {
    fs.writeFileSync(1, content, { encoding: 'utf-8' });
  },

  readFileJS(path) {
    return fs.readFileSync(path, 'utf-8');
  },

  writeFileJS(path, content) {
    fs.writeFileSync(path, content, { encoding: 'utf-8' });
  },
}
