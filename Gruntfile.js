module.exports = function(grunt){
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-postcss");
    grunt.loadNpmTasks("grunt-wiredep");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-concat-sourcemap");
    grunt.loadNpmTasks("grunt-concurrent");
    grunt.loadNpmTasks("grunt-replace");
    
    var BASE_PATH = "static/";
    var JAVASCRIPT_DIRECTORIES = [ // we have to use a list so that it happens in the right order
        BASE_PATH + "scripts/main.js", // ensure that this main.js concatenated first
        BASE_PATH + "pages/**/*.js", // then the pages
        BASE_PATH + "components/**/*.js", // the components
        BASE_PATH + "scripts/filters/**/*.js", // filters
        BASE_PATH + "scripts/services/**/*.js", // services
        BASE_PATH + "scripts/constants/**/*.js", // constants
        BASE_PATH + "scripts/other/**/*.js" // other
    ];
    var SASS_DIRECTORIES = [ // we could avoid this but it is faster to specify exact directories
        BASE_PATH + "**/*.sass"
    ];
    
    grunt.initConfig({
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: BASE_PATH + "styles/",
                    src: "main.sass",
                    dest: "static/styles/build/",
                    ext: ".css",
                }]
            }
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require("autoprefixer")({
                        browsers: ["last 2 versions"]
                    })
                ]
            },
            dist: {
                src: "static/styles/build/*.css"
            }
        },
        jshint: {
            all: JAVASCRIPT_DIRECTORIES,
        },
        concat_sourcemap: {
            options: {
                process: function(src, path){
                    return "(function(){" + src + "}());";
                },
                sourceRoot: "/"
            },
            all: {
                files: {
                    "static/scripts/build/main.js": JAVASCRIPT_DIRECTORIES
                }
            }
        },
        replace: {
            production: {
                options: {
                    patterns: [{
                        match: /{{ server.type }}/,
                        replacement: "production"
                    }]
                },
                files: [{
                    src: ["static/pages/index.html"],
                    dest: "static/pages/build/index.html"
                }]
            },
            development: {
                options: {
                    patterns: [{
                        match: /{{ server.type }}/,
                        replacement: "development"
                    }]
                },
                files: [{
                    src: ["static/pages/index.html"],
                    dest: "static/pages/build/index.html"
                }]
            }
        },
        wiredep: {
            target: {
                src: "static/pages/index.html",
                ignorePath: "../../"
            }
        },
        watch: {
            sass: {
                files: SASS_DIRECTORIES,
                tasks: ["sass", "postcss:dist"],
                options: {spawn: false}
            },
            js: {
                files: JAVASCRIPT_DIRECTORIES,
                tasks: ["concurrent:js1"],
                options: {spawn: false}
            },
            html: {
                files: "static/pages/index.html",
                tasks: ["replace:development"],
                options: {spawn: false}
            }
        },
        concurrent: {
            default1: ["sass", "jshint:all"],
            default2: ["postcss:dist", "concat_sourcemap"],
            
            js1: ["jshint:all", "concat_sourcemap"],
        }
    });
    
    grunt.registerTask("forAll", ["concurrent:default1", "concurrent:default2"]); // dev and production
    grunt.registerTask("development", ["forAll", "replace:development"]);
    grunt.registerTask("production", ["forAll", "replace:production"]);
    
    grunt.registerTask("default", ["development"]);
};