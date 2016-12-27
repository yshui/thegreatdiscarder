module.exports = function(grunt) {

    require('time-grunt')(grunt);

    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      manifest: grunt.file.readJSON('src/manifest.json'),
      crx: {
        myPublicExtension: {
          src: [
              "src/**/*",
              "!**/Thumbs.db"
          ],
          dest: "build/zip/<%= pkg.name %>-<%= manifest.version %>-dev.zip",
        },

        mySignedExtension: {
          src: [
              "src/**/*",
              "!**/Thumbs.db"
          ],
          dest: "build/crx/<%= pkg.name %>-<%= manifest.version %>-dev.crx",
          options: {
            privateKey: "key.pem"
          }
        }
      }
    });

    grunt.loadNpmTasks('grunt-crx');
    grunt.registerTask('default', ['crx']);
};

