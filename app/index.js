
'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var TumblrGenerator = module.exports = function TumblrGenerator(args, options, config) {

    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(TumblrGenerator, yeoman.generators.Base);

TumblrGenerator.prototype.askFor = function askFor() {

    var cb = this.async();

    // have Yeoman greet the user.
    console.log(this.yeoman);

    var prompts = [{
        type: 'confirm',
        name: 'customContent',
        message: 'Would you like to use custom content? [No]',
        default: false
    },{
        // todo: should test url to make sure it's properly configured
        when: function (answers) {
            return answers && answers.customContent;
        },
        name: 'contentURL',
        message: 'What is the URL of the content source for this theme? http://'
    }];

    this.prompt(prompts, function (props) {
        this.contentURL= props.contentURL;
        cb();
    }.bind(this));

};

/**
 * TODO: add find and replace to sanitize
 */
TumblrGenerator.prototype.sanitizeName = function sanitizeName(name) {
    return this._.slugify(name);
};

TumblrGenerator.prototype.app = function app() {
    this.mkdir('app');
    this.mkdir('app/themr');
    this.mkdir('app/themr/javascripts');
    this.mkdir('app/theme');
    this.mkdir('app/theme/styles');
    this.mkdir('app/theme/scripts');
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
};

TumblrGenerator.prototype.createConfig= function createConfig() {

    var url = 'tumblrthemr.tumblr.com';
    var userURL = this.contentURL;

    if (typeof userURL === 'string') {
        url = userURL;
    }

    this.write(
        'app/themr/javascripts/tumblr-themr-1.0.config.js',
        'var themrConf = { url: \'' + url  + '\', theme: \'theme\' };'
    );
};
TumblrGenerator.prototype.gruntfile = function gruntfile() {
    this.template('Gruntfile.js');
};
TumblrGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
};

TumblrGenerator.prototype.createThemr = function createthemr() {
    this.copy('index.html', 'app/index.html');
    this.copy('spinner.gif', 'app/themr/images/spinner.gif');
    this.copy('tumblr-themr-1.0.js', 'app/themr/javascripts/tumblr-themr-1.0.js');
    this.copy('jquery-1.6.4.min.js', 'app/themr/javascripts/jquery-1.6.4.min.js');
    this.copy('sammy.js', 'app/themr/javascripts/sammy.js');
    this.copy('sammy.handlebars.js', 'app/themr/javascripts/sammy.handlebars.js');
};
TumblrGenerator.prototype.demoTheme = function demotheme() {
    this.copy('theme.tumblr', 'app/theme.tumblr');
    this.copy('jquery-1.6.4.min.js', 'app/theme/scripts/jquery-1.6.4.min.js');
    this.copy('theme.scss', 'app/theme/styles/main.scss');
    this.copy('theme.js', 'app/theme/scripts/main.js');
};
