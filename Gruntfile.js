module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        cssmin: {
            combine: {
                files: {
                    "src/style.min.css": ["src/style.css"]
                }
            }
        },
        browserify: {
            dist: {
                files: {
                    "<%= pkg.name %>.js": ["src/**/*.js"]
                },
                options: {
                    transform: ["brfs"]
                }
            }
        },
        uglify: {
            options: {
                mangle: true
            },
            my_target: {
                files: {
                    "<%= pkg.name %>.min.js": ["<%= pkg.name %>.js"]
                }
            }
        },
        qunit: {
            all: ["test/**/*.html"]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-qunit");

    grunt.registerTask("test", ["qunit"]);
    grunt.registerTask("dev", ["cssmin", "browserify"]);
    grunt.registerTask("default", ["dev", "uglify", "test"]);
};
