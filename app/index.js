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
        'Out of the box I include jQuery, Modernizr, lime-utils, and a ' +
        'Gruntfile.js to build your app.'
      ));
    }

    var prompts = [{
      name: 'projectName',
      message: 'Project name?'
    },{
      name: 'authorName',
      message: 'Your name?' 
    },{
      type: 'confirm',
      name: 'addLibSass',
      message: 'Would you like to use libsass?',
      default: true
    },{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Styleguide',
        value: 'includeStyleguide',
        checked: false
      },{
        name: 'Javascript',
        value: 'includeJavascript',
        checked: false
      },{
        name: 'Images',
        value: 'includeImages',
        checked: false
      }]
    },{
      type: 'confirm',
      name: 'addContainer',
      message: 'Generate containing directory?',
      default: false
    },{when: function (response) {
        return response.addContainer;
      },
      type: 'confirm',
      name: 'includeAutoprefixer',
      message: 'Replace prefixfree with autoprefixer?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      var features = props.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.projectName = props.projectName;
      this.authorName = props.authorName;
      this.addLibsass = props.addLibsass;

      this.addContainer = props.addContainer;
      this.includeAutoprefixer = props.includeAutoprefixer;

      this.includeStyleguide = hasFeature('includeStyleguide');
      this.includeJavascript = hasFeature('includeJavascript');
      this.includeImages = hasFeature('includeImages');

      done();
    }.bind(this));
  },

  gruntfile: function () {
    this.template('Gruntfile.js');
  },

  dev: function () {
    if (this.addContainer) {
      this.dest.mkdir('dev');
      this.dest.mkdir('dev/sass');
      this.dest.mkdir('dev/sass/base');
      this.dest.mkdir('dev/sass/modules');
      this.dest.mkdir('dev/sass/partials');
      this.dest.mkdir('dev/sass/theme');
      this.dest.mkdir('dev/sass/vendors');

      if (this.includeJavascript) {
        this.dest.mkdir('dev/js');
      }

      if (this.includeJavascript) {
        this.dest.mkdir('dev/images');
      }

      if (this.includeStyleguide) {
        this.src.copy('styleguide.md', 'dev/sass/styleguide.md');
      }
    } else {
      this.dest.mkdir('sass');
      this.dest.mkdir('sass/base');
      this.dest.mkdir('sass/modules');
      this.dest.mkdir('sass/partials');
      this.dest.mkdir('sass/theme');
      this.dest.mkdir('sass/vendors');

      if (this.includeJavascript) {
        this.mkdir('js');
      }

      if (this.includeJavascript) {
        this.dest.mkdir('images');
      }

      if (this.includeStyleguide) {
        this.src.copy('styleguide.md', 'sass/styleguide.md');
      }
    }
  },

  projectfiles: function () {
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');

    if (this.addContainer) {
      this.src.copy('jshintrc', '.jshintrc');
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('favicon.ico', 'dev/favicon.ico');
    }
  },

  templates: function () {
    if (this.addContainer) {
      this.src.copy('screen.scss', 'dev/sass/screen.scss');
      this.src.copy('_variables.scss', 'dev/sass/_variables.scss');
      this.template('_index.html', 'dev/index.html');
    } else {
      this.src.copy('screen.scss', 'sass/screen.scss');
      this.src.copy('_variables.scss', 'sass/_variables.scss');
    }
  },

  // install: function () {
  //   this.on('end', function () {

  //     if (!this.options['skip-install']) {
  //       this.installDependencies({
  //         skipMessage: this.options['skip-install-message'],
  //         skipInstall: this.options['skip-install']
  //       });
  //     }
  //   });
  // },

  config: function() {
    this.config.set('project', this.projectName);
    this.config.set('author', this.authorName);
    this.config.set('styleguide', this.includeStyleguide);
    this.config.set('autoprefixer', this.includeAutoprefixer);
    this.config.set('libsass', this.addLibsass);
  }
});
 
module.exports = LimeGenerator;

