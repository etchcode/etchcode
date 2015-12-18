module.exports = function(grunt){
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-postcss");
    grunt.loadNpmTasks("grunt-wiredep");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-concat-sourcemap");
    grunt.loadNpmTasks("grunt-concurrent");
    grunt.loadNpmTasks("grunt-replace");
    grunt.loadNpmTasks("grunt-copy-to");
    grunt.loadNpmTasks("grunt-gae");
    
    var BASE_PATH = "static/";
    var BUILD_PATH = "build/";
    var JAVASCRIPT_DIRECTORIES = [ // we have to use a list so that it happens in the right order
        BASE_PATH + "scripts/main.js", // ensure that this main.js concatenated first
        BASE_PATH + "pages/**/*.js", // then the pages
        BASE_PATH + "components/**/*.js", // the components
        BASE_PATH + "scripts/filters/**/*.js", // filters
        BASE_PATH + "scripts/services/**/*.js", // services
        BASE_PATH + "scripts/constants/**/*.js", // constants
        BASE_PATH + "scripts/other/**/*.js" // other
    ];
    var PRODUCTION_JAVASCRIPT_DIRECTORIES = JAVASCRIPT_DIRECTORIES.map(function(dir){
        return BUILD_PATH + dir;
    });
    var SASS_DIRECTORIES = [ // we could avoid this but it is faster to specify exact directories
        BASE_PATH + "**/*.sass"
    ];
    
    grunt.initConfig({
        sass: {
            dev: {
                files: [{
                    expand: true,
                    cwd: BASE_PATH + "styles/",
                    src: "main.sass",
                    dest: "static/styles/build/",
                    ext: ".css",
                }]
            },
            production: {
                files: [{
                    expand: true,
                    cwd: BUILD_PATH + BASE_PATH + "styles/",
                    src: "main.sass",
                    dest: BUILD_PATH + BASE_PATH + "styles/build/",
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
            dev: {
                src: "static/styles/build/*.css"
            },
            production: {
                src: BUILD_PATH + "static/styles/build/*.css"
            }
        },
        jshint: {
            dev: JAVASCRIPT_DIRECTORIES,
            production: PRODUCTION_JAVASCRIPT_DIRECTORIES
        },
        concat_sourcemap: {
            options: {
                process: function(src, path){
                    return "(function(){" + src + "}());";
                },
                sourceRoot: "/"
            },
            dev: {
                files: {
                    "static/scripts/build/main.js": JAVASCRIPT_DIRECTORIES
                }
            },
            production: {
                files: {
                    "build/static/scripts/build/main.js": PRODUCTION_JAVASCRIPT_DIRECTORIES
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
                    src: ["build/static/pages/index.html"],
                    dest: "build/static/pages/build/index.html"
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
        copyto: {
            dev_to_build: {
                files: [{
                    src: "**/*",
                    dest: "build/",
                    expand: true
                }],
                
                options: {
                    ignore: [
                        "build{,/**/*}", // let's not copy ourselves
                        "Gruntfile.js",
                        ".gitignore",
                        "README.md",
                        "CONTRIBUTING.md",
                        "CREDITS.md",
                        ".gitattributes",
                        ".brackets.json",
                        "bower.json",
                        "package.json"
                    ]
                }
            },
        },
        gae: {
            deploy: {
                action: "update",
                options: {
                    path: "build/"
                }
            },
            run: {
                action: "run",
                options: {
                    args: {
                        port: 9090
                    }
                }
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
            dev_1: ["sass:dev", "jshint:dev"],
            dev_2: ["postcss:dev", "concat_sourcemap:dev"],
            
            production_1: ["sass:production", "jshint:production"],
            production_2: ["postcss:production", "concat_sourcemap:production"],
            
            js_only_1: ["jshint:all", "concat_sourcemap"],
        }
    });
    
    grunt.registerTask("development", ["concurrent:dev_1", "concurrent:dev_2", "replace:development"]);
    grunt.registerTask("production", ["copyto:dev_to_build", "concurrent:production_1", "concurrent:production_2", "replace:production", "gae:deploy"]);
    
    grunt.registerTask("dev:run", ["gae:run"]);
    
    grunt.registerTask("default", ["development"]);
};