/* eslint-env node */
'use strict';
const path = require('path');

module.exports = {
  name: 'index-redirects-middleware',

  isDevelopingAddon() {
    return true;
  },

  serverMiddleware({app}) {
    app.get('/p/:projectId', (req, res) => {
      const p = path.join(__dirname, '..', '..', 'dist', 'index.html');
      res.sendFile(p);
    });
  }

};
