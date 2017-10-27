# grunt-amd-compile
> Compile and optimize AMD modules files into bundles.

# Installation

`npm i grunt-amd-compile --save-dev`


# AMD optimization

First what is optimizing AMD module ?

This is a not optimized module :
```javascript
define(['require', 'exports'], function (require, exports)
{
    // ... 
});
```

And this is the same but optimized :
```javascript
define('my/module/path/is/here/OptimizedModule', ['require', 'exports'], function (require, exports)
{
    // ... 
});
```

See ? An optimized module have its path as a first argument of its define statement.
Without this path, RequireJS can't know what is the virtual path of this module.
Others modules can require this one from its path, like so :

```javascript
define('my/module/path/is/here/OtherOne', ['require', 'exports', './OptimizedModule'], function (require, exports, OptimizedModule)
{
    // Here we can use OptimizedModule
});
```

Dependency paths are relative to each others, but RequireJS implementation takes care of this.


# Optimizing, bundling and code-splitting

First, this AMD files tree as example :

- amd/
  - **common/**
    - components/
      - CommonComponent.js
        ```javascript
          define(['require', 'exports', 'react', 'react-dom'], function (require, exports, React, ReactDOM)
          {
            // Module code of a component using React and ReactDOM
          });
        ```
  - **firstApp/**
    - components/
      - FirstAppComponent.js
        ```javascript
          define(['require', 'exports', 'react', 'react-dom', '../../common/components/CommonComponent'], function (require, exports, CommonComponent)
          {
            // Module code of a component using React, ReactDOM and another AMD module : CommonComponent
          });
        ```
    - Main.js
      ```javascript
        define(['require', 'exports', 'react', 'react-dom', './components/FirstAppComponent'], function (require, exports, FirstAppComponent)
        {
          // Module code of a component using React, ReactDOM and another AMD module : FirstAppComponent
        });
      ```
  - **secondApp/**
    - Main.js
      ```javascript
        define(['require', 'exports', 'react', 'react-dom', '../common/components/CommonComponent', './OtherModule'], function (require, exports, CommonComponent, OtherModule)
        {
          // Module code of a component using React, ReactDOM and another AMD module : FirstAppComponent
        });
      ```
    - OtherModule.js
      ```javascript
        define(['require', 'exports'], function (require, exports, CommonComponent, OtherModule)
        {
          // Module code
        });
      ```

> Note : This kind of file tree is easily generated with [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) and is used in [solid-js framework](https://github.com/solid-js/web-base).

#### Quickly we see 2 things :
- Modules are not optimized.
- Modules files are in a file tree representing the module paths.

We can optimize every modules easily and concat them into a big bundle with this grunt task...
But that's not all !

#### Apps :
Some modules are using other modules but in other "apps".
Apps here are these folder :
- `common/`
- `firstApp/`
- `secondApp/`

Each apps can be bundled into one file :
- `common/**/*.js` -> `www/js/common.js`
- `firstApp/**/*.js` ->  `www/js/first-app.js`
- `secondApp/**/*.js` -> `www/js/second-app.js`

App to bundle is important to get because this is an powerful feature : Code-Splitting.

Each app have resources and dependencies.
**One app = one js file** This is handy to optimize our application by loading bundled files for only the code we need.

- Page `a.html` can load `common.js` and `first-app.js` because it does not use `secondApp` modules.
- Page `b.html` can load `common.js` and `second-app.js` because it does not use `firstApp` modules.


#### Static libs

**grunt-amd-compile** can also concat static libraries.
This is useful to bundle huge JS files, like react or jquery together, but without the AMD optimization.
Concatenation is faster and libraries like react / jquery / gsap / pixi, etc, works well as global module.
[amdLite](https://github.com/zouloux/amd-lite) has an option to map global modules to dependencies.
So when a module requires ['react', 'react-dom', 'gsap'], it will in fact returns `React`, `ReactDOM` and `GreenSockGlobals`
See [amdLite config file](https://github.com/zouloux/amd-lite/blob/master/amdLite.config.js) to see how it works.


#### Uglify

The option `addUglifyTargets: true` adds every amdCompile target to the uglify config node.


# Usage
 
See this [configuration file](Gruntfile.js) example.


# In the browser

Know you have clean optimized bundle containing your AMD modules, you need a library to define and require these virtual path.
The original RequireJS script is pretty big, can do a lot of stuff, and is complex to configure.

So I made a little RequireJS implementation for the browser, named [amdLite](https://github.com/zouloux/amd-lite).
The configuration is easy, take a look !

Also, all of this is used transparently with [solid-js framework](https://github.com/solid-js/web-base).


# Links

- Read this really good article about modular JS : https://addyosmani.com/writing-modular-js/
- [Solid JS framework](https://github.com/solid-js/web-base) is a Typescript framework using AmdLite
- RequireJS optimization : http://requirejs.org/docs/optimization.html