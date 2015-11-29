module.exports = function(grunt){
    
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-postcss");
    grunt.loadNpmTasks("grunt-wiredep");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    
    grunt.initConfig({
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: "static/styles",
                    src: ["*.sass"],
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
            all: ["Gruntfile.js", "static/**/.js"]  
        },
        watch: {
            sass: {
                files: ["static/**/*.sass"],
                tasks: ["sass", "postcss:dist"],
                options: {
                    spawn: false
                }
            },
            js: {
                files: ["static/**/*.js"],
                tasks: ["jshint"]
            }
        }
    });
    
    grunt.registerTask("default", ["sass", "postcss:dist", "jshint"]);
};