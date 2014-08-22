'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
 
var LimeGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    if (!this.options['skip-welcome-message']) {
      this.log(require('yosay')());
      this.log(chalk.magenta(
        'Out of the box I include jQuery, Modernizr, prefixfree, lime-utils, and a ' +
        'Gruntfile.js to build your app.'
      ));
    }

    var prompts = [{
      name: 'projectName',
      message: 'Project name?'
    },
    {
      name: 'authorName',
      message: 'Your name?' 
    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Generate styleguide?',
        value: 'includeStyleguide',
        checked: true
      },{
        name: 'Replace prefixfree with autoprefixer?',
        value: 'includeAutoprefixer',
        checked: false
      },{
        name: 'Would you like to use libsass?',
        value: 'includeLibSass',
        checked: true
      }]
    }];

    this.prompt(prompts, function (props) {
      var features = props.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.projectName = props.projectName;
      this.authorName = props.authorName;

      this.includeStyleguide = hasFeature('includeStyleguide');
      this.includeAutoprefixer = hasFeature('includeAutoprefixer');
      this.includeLibSass = hasFeature('includeLibSass');

      done();
    }.bind(this));
  },

  gruntfile: function () {
    this.template('Gruntfile.js');
  },

  projectfiles: function () {
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.copy('jshintrc', '.jshintrc');
    this.copy('editorconfig', '.editorconfig');
  },

  templates: function () {
    this.copy('screen.scss', 'dev/sass/screen.scss');
    this.copy('_variables.scss', 'dev/sass/_variables.scss');
    this.template('_index.html', 'dev/index.html');
  },

  dev: function () {
    this.directory('dev');
    this.mkdir('dev/images');
    this.mkdir('dev/sass/base');
    this.mkdir('dev/sass/modules');
    this.mkdir('dev/sass/partials');
    this.mkdir('dev/sass/theme');
    this.mkdir('dev/sass/vendors');
    this.mkdir('dev/scripts');

    if (this.includeStyleguide) {
      this.copy('styleguide.md', 'dev/sass/styleguide.md');
    }
  },

  install: function () {
    this.on('end', function () {

      if (!this.options['skip-install']) {
        this.installDependencies({
          skipMessage: this.options['skip-install-message'],
          skipInstall: this.options['skip-install']
        });
      }
    });
  },

  config: function() {
    this.config.set('project', this.projectName);
    this.config.set('author', this.authorName);
    this.config.set('styleguide', this.includeStyleguide);
    this.config.set('autoprefixer', this.includeAutoprefixer);
    this.config.set('libsass', this.includeLibSass);
  }
});
 
module.exports = LimeGenerator;

