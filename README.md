### Angular 2 production workflow with SystemJs builder and gulp

Angular.io have quick start tutorial on https://angular.io/docs/ts/latest/quickstart.html. I copied this tutorial and extended with some gulp tasks for bundling everything to dist folder which can be copied to server and work just like that.

#### Steps to success
1. Clean typescripts compiled js files and dist folder
2. Compile typescript files
3. Bundle everything to dist folder with generated hash for browser cache resync
4. Copy everything inside assets folder to dist folder

##NEED TO UPLOAD HTML COMPONENT FILES/TEMPLATES

First let look at angular 2 quickstart index.html

```html
 <!-- 1. Load libraries -->
     <!-- Polyfill(s) for older browsers -->
    <script src="node_modules/core-js/client/shim.min.js"></script>
    <script src="node_modules/zone.js/dist/zone.js"></script>
    <script src="node_modules/reflect-metadata/Reflect.js"></script>
    <script src="node_modules/systemjs/dist/system.src.js"></script>
    <!-- 2. Configure SystemJS -->
    <script src="systemjs.config.js"></script>
    <script>
      System.import('app').catch(function(err){ console.error(err); });
    </script>
```
You can notice needed polyfills is loaded from node_modules path lets fix it so it can be bundled. In app folder I created vendor.ts for such libraries which is not part of angular but still need to be loaded for one or another reason.

*app/vendor.ts*
```ts
import 'core-js-shim';
import 'zone';
import 'reflect';
```

Now we can configure vendor libraries in system config so it can be loaded using SystemJs

*systemjs.config.js*
```js
'core-js-shim':'npm:core-js/client/shim.min.js',
'zone':'npm:zone.js/dist/zone.js',
'reflect':'npm:reflect-metadata/Reflect.js'
```

Next step is to move scripts loading to body bottom

*index.html*

```html
  <body>
    <my-app>Loading...</my-app>
    <!-- build:vendor -->
    <script src="node_modules/systemjs/dist/system.src.js"></script>
    <script src="systemjs.config.js"></script>
    <!-- endbuild -->

    <!-- build:app -->
    <script>
      System.import('app/vendor').then(function() {
          System.import('app').catch(function(err){ console.error(err); });
      });
    </script>
    <!-- endbuild -->
  </body>
  ```

  Ok so, by now we still don't have any bundle step and system.js is still loaded from node_modules path. Don't worry because it's time to create self executing SystemJs bundles so it can be run without any external dependencies. Our mission is to run gulp task which can replace index.html file with bundled files for production use and copy all this to dist folder. We should have something like this:

  *dist/index.html*
  ```html
  <!DOCTYPE html>
<html>
  <head>
    <title>Angular 2 QuickStart</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="assets/styles.css">
  </head>
  <body>
    <my-app>Loading...</my-app>
    <script src="1474222768447.vendor.bundle.js"></script>
    <script src="1474222768447.main.bundle.js"></script>
  </body>
</html>
  ```

We can do bundling step using SystemJs builder which take care of all bundling step and gulp-html-replace for replacing script tags with bundled version. Now run ```gulp dist``` and everythink needed to run app should be compiled to dist folder.

### Questions you may ask
1. Why you use gulp shell to compile typescript files instead of using gulp-typescript? Because by running tsc command I'm always sure typescript compiler use tsconfig.json settings. gulp-typescript ignore some of them. Example is sourcemaps, even if you set sourceMaps: true in tsconfig.json file, gulp-typescript will ingore this setting.

2. Does angular html templates is also bundled? Yes. We can use power of SystemJs plugin like to load html into javascript so it can be bundled.
