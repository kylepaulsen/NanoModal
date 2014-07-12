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
        http: {
            closure: {
                options: {
                    url: "http://closure-compiler.appspot.com/compile",
                    method: "POST",
                    form: {
                        output_info: "compiled_code",
                        output_format: "text",
                        compilation_level: "SIMPLE_OPTIMIZATIONS",
                        warning_level: "default"
                    },
                    sourceField: "form.js_code"
                },
                files: {
                    "<%= pkg.name %>.min.js": "<%= pkg.name %>.js"
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-http");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-qunit");

    // grunt.registerTask("test", ["jshint", "qunit"]);

    // grunt.registerTask("default", ["http:closure"]);
    grunt.registerTask("default", ["cssmin", "browserify", "http:closure"]);
};
