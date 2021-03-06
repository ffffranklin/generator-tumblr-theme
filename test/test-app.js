/*global describe, beforeEach, it*/
'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('tumblr-theme:app', function () {
    before(function (done) {
        helpers.run(path.join(__dirname, '../app'))
            .inDir(path.join(os.tmpdir(), './temp-test'))
            .withPrompts({
                customContent: 'Yes',
                customUrl: 'http://www.test.com'
            })
            .on('end', done);
    });

    it('creates files', function () {
        assert.file([
            'bower.json',
            'package.json',
            '.editorconfig',
            '.jshintrc'
        ]);
    });
});
