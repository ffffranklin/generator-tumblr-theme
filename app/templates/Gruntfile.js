module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            scripts: {
                files: [
                    '**/*.js',
                    '**/*.tumblr',
                    '**/*.css'
                ],
                options:{
                    livereload: true
                }
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
    grunt.loadNpmTasks('grunt-open');
    grunt.registerTask('default', ['server'])
    grunt.registerTask('server', ['connect', 'open', 'watch'])
};
