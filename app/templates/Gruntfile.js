module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            scripts: {
                files: [
                    'app/theme/scripts/*.js',
                    'app/theme.tumblr',
                ],
                options:{
                    livereload: true
                }
            },
            styles: {
                files: ['app/theme/styles/*.scss'],
                tasks: ['sass'],
                options:{
                    livereload: true
                }
            }
        },
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app/theme/styles',
                    src: ['*.scss'],
                    dest: 'app/theme/styles',
                    ext: '.css'
                }]
            }
        },
        connect: {
            main: {
                options: {
                    port: 9000,
                    base: 'app'
                }
            }
        },
        open: {
            dev: {
                path: 'http://localhost:9000',
                app: 'Google Chrome'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-open');
    grunt.registerTask('default', ['serve']);
    grunt.registerTask('server', ['sass', 'connect', 'open', 'watch']);
};
