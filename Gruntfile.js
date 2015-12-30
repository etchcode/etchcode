module.exports = function(grunt){
    require("load-grunt-tasks")(grunt);

    var BASE_PATH = "static/";
    var BUILD_PATH = "build/";
    var ETCHCODEUSERCONTENT_PATH = "../etchcodeusercontent/";

    function Prepender(base){
        return function prepender(file){
            return base + file;
        };
    }
    function Appender(base){
        return function appender(file){
            return file + base;
        };
    }
    var prepend_base = Prepender(BASE_PATH);
    var prepend_build = Prepender(BUILD_PATH);

    var JAVASCRIPT_DIRECTORIES = [ // we have to use a list so that it happens in the right order
        "scripts/debug.js",
        "scripts/source_map_exception_handler.js", // this must come first as it is loaded as a module
        "scripts/main.js", // ensure that this main.js concatenated first
        "scripts/*.js", // then anything else in the root script directory
        "pages/**/*.js", // then the pages
        "components/**/*.js", // the components
        "scripts/filters/**/*.js", // filters
        "scripts/services/**/*.js", // services
        "scripts/constants/**/*.js", // constants
        "scripts/other/**/*.js" // other
    ].map(prepend_base);

    var SASS_DIRECTORIES = [ // we could avoid this but it is faster to specify exact directories
        BASE_PATH + "**/*.sass"
    ];

    function concurrent_common_with_enviroment(enviroment, concurrent_number){
        var concurrent_common = [
            ["sass", "jshint"], //concurrent 1
            ["postcss", "concat_sourcemap", "htmllint:all"] // concurrent 2
        ]; // used in both dev and propduction concurrents

        return concurrent_common[concurrent_number - 1].map(function(task_name){
            if(task_name.indexOf(":") == -1){
                return task_name + ":" + enviroment;
            }
            else{
                return task_name;
            }
        });
    }

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
            production: JAVASCRIPT_DIRECTORIES.map(prepend_build)
        },
        htmllint: {
            main_html: ["static/pages/index.html"],
            all: ["static/**/*.html", "static/*.html"],
            options: {
                ignore: [
                    "Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.",
                    "Element “head” is missing a required instance of child element “title”.",
                    // custom attrs/elems
                    /(Attribute|Element) “[a-zA-Z0-9-]+?” not allowed (on|as (|a )child of) element “[a-zA-Z0-9-]+?” (at this point|in this context)\./
                ]
            }
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
                    "build/static/scripts/build/main.js": JAVASCRIPT_DIRECTORIES.map(prepend_build)
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
            dev: {
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
            check_manifest: {
                command: "python3 backend/tests/check_manifest_file.py"
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
                tasks: ["sass:dev", "postcss:dev"],
                options: {spawn: false}
            },
            js: {
                files: JAVASCRIPT_DIRECTORIES,
                tasks: ["jshint:dev", "concat_sourcemap:dev"],
                options: {spawn: false}
            },
            main_html: {
                files: "static/pages/index.html",
                tasks: ["htmllint:main_html", "replace:development"],
                options: {spawn: false}
            },
            all_html: {
                files: "static/**/*.html",
                tasks: ["htmllint:all"]
            },
            markdown: {
                files: "static/*.md",
                tasks: ["markdown:all"]//, "scratchblock:all"]
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },

            dev_1: concurrent_common_with_enviroment("dev", 1),
            dev_2: concurrent_common_with_enviroment("dev", 2),

            production_1: concurrent_common_with_enviroment("prod", 1),
            production_2: concurrent_common_with_enviroment("prod", 2),

            all_servers: ["gae:usercontent", "gae:primary"]
        }
    });


    grunt.registerTask("development", ["shell:check_manifest",
                       "concurrent:dev_1", "concurrent:dev_2", "replace:dev"]);
    grunt.registerTask("production", ["shell:check_manifest",
                       "copyto:dev_to_build", "concurrent:production_1",
                       "concurrent:production_2", "replace:production",
                       "gae:deploy"]);
    grunt.registerTask("local_server", ["concurrent:all_servers"]);
    grunt.registerTask("wiredep", ["wiredep"]);

    grunt.registerTask("default", ["development"]);
};
