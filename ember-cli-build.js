'use strict';

const GlimmerApp = require('@glimmer/application-pipeline').GlimmerApp;
const Concat = require('broccoli-concat');
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

class CustomGlimmerApp extends GlimmerApp {
  publicTree() {
    const originalTree = super.publicTree();

    const vendorScripts = new Concat('node_modules', {
      inputFiles: [
        'jquery/dist/jquery.slim.min.js',
        'semantic-ui-css/semantic.min.js',
      ],
      outputFile: 'vendor.js',
    });

    const vendorCss = new Concat('node_modules', {
      inputFiles: [
        'semantic-ui-css/semantic.min.css',
      ],
      outputFile: 'vendor.css',
    });

    const semanticAssets = new Funnel('node_modules/semantic-ui-css', {
      include: ['themes/**/*']
    });

    return new MergeTrees([
      originalTree,
      vendorScripts,
      vendorCss,
      semanticAssets,
    ], { overwrite: true });
  }
}

module.exports = function(defaults) {
  let app = new CustomGlimmerApp(defaults, {
   fingerprint: {
      //exclude: ['apple-touch-icon', 'favicon', 'mstile', 'android-chrome']
    }
  });

  return app.toTree();
};
