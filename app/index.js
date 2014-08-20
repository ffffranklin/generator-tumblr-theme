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

    var prompts = [  {
        name: 'themeName',
        message: 'What is your tumblr name?'
    } /*,{
        type: 'confirm',
        name: 'agree',
        message: 'Would you like to proceed?'
    }*/];

    this.prompt(prompts, function (props) {
        this.themeID = this.normalizeName(props.themeName);
        this.themeName = props.themeName;
        cb();
    }.bind(this));

};

/**
 * TODO: add find and replace
 */
TumblrGenerator.prototype.normalizeName = function normalizeName(name) {
    return name;
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
    this.copy('tumblr-themr-1.0.config.js', 'app/themr/javascripts/tumblr-themr-1.0.config.js');
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
