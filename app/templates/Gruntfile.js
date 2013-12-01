module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            scripts: {
                files: ['**/*'],
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
    grunt.registerTask('default', ['dev'])
    grunt.registerTask('dev', ['connect', 'open', 'watch'])
};