# grunt-docu

> Super simple flat documentation generator

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-docu --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-docu');
```

## The "docu" task

### Overview
In your project's Gruntfile, add a section named `docu` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  docu: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.head
Type: `String`
Default value: `'src/head.html'`

Path to custom head file

#### options.foot
Type: `String`
Default value: `'src/foot.html'`

Path to custom foot file

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever.

```js
grunt.initConfig({
  docu: {
    options: {},
    files: {
      'dest/default_options': ['src/**/*.html'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else.

```js
grunt.initConfig({
  docu: {
  	myDocu: {
	  options: {
	    head: 'src/mydocu/head.html',
	    foot: 'src/mydocu/foot.html',
	  },
	  files: {
	    'dest/default_options': ['src/mydocu/**/*.html'],
	  },
  	}
  },
});
```

### Other
The table of contents element dispatches an event ('highlightchange'), everytime a new heading is highlighted. And passes the highlighted element under event.details. You can listen updates like this
```js
document.querySelector('.docu-toc').addEventListener('highlightchange', function(event) {
	console.log('Changed highlighted heading to:', event.details);
}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).