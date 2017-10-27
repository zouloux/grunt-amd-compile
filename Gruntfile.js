

module.exports = function (grunt)
{
	/**
	 * Read --optimized CLI option.
	 * If this option is added, bundles will be compressed.
	 */
	var optimizedTarget = grunt.option('optimized') || false;

	// Load amd compile and uglify tasks
	grunt.loadNpmTasks('grunt-amd-compile');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.initConfig({

		/**
		 * Configuration example for amdCompile grunt plugin.
		 */
		amdCompile : {

			options: {
				/**
				 * AMD modules root. When optimizing AMD modules, we need to know where is the base.
				 *
				 * Example, if we have a module in this file architecture :
				 * temp/amd/my/Module.js
				 *
				 * Default optimization path will be :
				 * temp/amd/my/Module
				 *
				 * But if the module path wanted is in fact "my/Module"
				 * set root to "temp/amd/"
				 */
				root: 'amd/',

				/**
				 * Add grunt uglify targets from this config.
				 * Use "grunt uglify" to uglify all amdCompile targets.
				 * Use "grunt uglify:common" to uglify only "common" amdCompile target.
				 */
				addUglifyTargets : true,

				/**
				 * BONUS
				 * Module name injection as var inside module callback.
				 * Default is null, no injection.
				 * You can use something like "__FILE".
				 * Then every optimized module will have a `var __FILE="module/path";` statement at the first line.
				 */
				//varName: '__FILE'
			},

			/**
			 * Our project static libraries
			 * No AMD optimization, we just concat every files into one big bundle.
			 * IMPORTANT : Not found files here will not throw error or warning, be careful when adding a file path
			 */
			staticLibs: {

				options: {
					// No need for AMD optimization, we use them from the global scope
					justConcat: true
				},

				files: [
					// Jquery lib
					'node_modules/jquery/dist/jquery.min.js',

					// Three lib
					'node_modules/three/build/three.min.js',

					// GSAP lib
					'node_modules/gsap/src/minified/TweenLite.min.js',
					'node_modules/gsap/src/minified/TimelineLite.min.js',
					'node_modules/gsap/src/minified/jquery.gsap.min.js',
					'node_modules/gsap/src/minified/easing/*.js',
					'node_modules/gsap/src/minified/plugins/*.js',

					// PIXI lib
					'node_modules/pixi.js/dist/pixi.min.js',

					// Include AMD Lite module system and its configuration
					'node_modules/amd-lite/amdLite.min.js',
					'amdLite.config.js'
				],
				dest: 'www/js/static-libs.js'
			},

			/**
			 * Common project modules.
			 * Here are all common components or pages to all apps
			 * Uses static libs.
			 */
			common: {
				src: 'amd/common/**/*.js',
				dest: 'www/js/common.js'
			},

			/**
			 * First app target
			 * Uses static libs and common modules.
			 */
			firstApp: {
				src: 'amd/firstApp/**/*.js',
				dest: 'www/js/first-app.js'
			},

			/**
			 * Second app target
			 * Uses static libs and common modules.
			 */
			secondApp: {
				src: 'amd/secondApp/**/*.js',
				dest: 'www/js/second-app.js'
			}

			/**
			 * Add as much apps you need :)
			 */
		},

		/**
		 * Uglify config.
		 * We need this node so addUglifyTargets option can work
		 */
		uglify: {
			options: {
				mangle: true,
				report: 'gzip',
				comments: false,
				banner: '// <%= grunt.template.today("yyyy-mm-dd hh:mm:ss TT") %>\n'
			}
		}
	});

	/**
	 * scripts task
	 * 1. Compile AMD modules to code-splitted bundles.
	 * 2. Uglify bunles if we have --optimized option.
	 */
	var scriptsTasks = ['amdCompile'];
	optimizedTarget && scriptTasks.push('uglify');
	grunt.registerTask('scripts', scriptsTasks);

	/**
	 * Script tasks, but without static libs bundling.
	 * Static libs do not need to be bundled when an AMD file is changed.
	 */
	var scriptsWithoutStaticLibsTasks = [];
	var amdCompileTargets = grunt.config('amdCompile');
	for (var i in amdCompileTargets)
	{
		if (i !== 'staticLibs' && i !== 'options')
			scriptsWithoutStaticLibsTasks.push('amdCompile:' + i);
	}
	grunt.registerTask('scriptsWithoutStaticLibs', scriptsWithoutStaticLibsTasks);
}