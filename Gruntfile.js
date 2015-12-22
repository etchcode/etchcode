module.exports = function(grunt){
    require("load-grunt-tasks")(grunt);

    var BASE_PATH = "static/";
    var BUILD_PATH = "build/";
    var ETCHCODEUSERCONTENT_PATH = "../etchcodeusercontent/";
    var JAVASCRIPT_DIRECTORIES = [ // we have to use a list so that it happens in the right order
        BASE_PATH + "scripts/debug.js",
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
                    if(path !== BASE_PATH + "scripts/debug.js"){
                        return "(function(){" + src + "}());";
                    }
                    else{
                        return src;
                    }
                },
                sourcesContent: true
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
        markdown: {
            all: {
                files: [{
                    expand: true,
                    src: ["static/*.md"],
                    ext: ".html"
                }],
                options: {
                    markdownOptions: {
                        gfm: true
                    }
                }
            }
        },
        scratchblock: { // compiles stuff inside of <scratch></scratch> tags into html
            all: {
                files: [
                    {src: ["static/pages/help/*.html"], dest: "", ext: ".built.html"}
                ]
            }
        },
        gae: {
            deploy: {
                action: "update",
                options: {
                    path: "build/"
                }
            },
            primary: {
                action: "run",
                options: {
                    args: {port: 9090, admin_port: 9091}
                }
            },
            usercontent: {
                action: "run",
                options: {
                    args: {port: 9000, admin_port: 9001},
                    path: ETCHCODEUSERCONTENT_PATH
                }
            }
        },
        shell: {
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
                tasks: ["sass:dev", "postcss:dev"],
                options: {spawn: false}
            },
            js: {
                files: JAVASCRIPT_DIRECTORIES,
                tasks: ["concurrent:js_only_1"],
                options: {spawn: false}
            },
            html: {
                files: "static/pages/index.html",
                tasks: ["replace:development"],
                options: {spawn: false}
            },
            markdown: {
                files: "static/*.md",
                tasks: ["markdown:all", "scratchblock:all"]
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },

            dev_1: ["sass:dev", "jshint:dev"],//, "markdown:all"],
            dev_2: ["postcss:dev", "concat_sourcemap:dev"],//, "scratchblock:all"],

            production_1: ["sass:production", "jshint:production"],//, "markdown:all"],
            production_2: ["postcss:production", "concat_sourcemap:production"],//, "scratchblock:all"],

            js_only_1: ["jshint:dev", "concat_sourcemap:dev"],

            all_servers: ["gae:usercontent", "gae:primary"]
        }
    });

    grunt.registerTask("development", ["concurrent:dev_1", "concurrent:dev_2", "replace:development"]);
    grunt.registerTask("production", ["copyto:dev_to_build", "concurrent:production_1", "concurrent:production_2", "replace:production", "gae:deploy"]);
    grunt.registerTask("local_server", ["concurrent:all_servers"]);

    grunt.registerTask("default", ["development"]);
};
