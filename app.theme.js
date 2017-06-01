angular.module('myApp')
.config(function($mdThemingProvider) {

  $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey', {
      'default': '600', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '300', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '800', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    // If you specify less than all of the keys, it will inherit from the
    // default shades
    .accentPalette('cyan', {
      'default': '200' // use shade 200 for default, and keep all other shades the same
    })
    .warnPalette('pink', {
      'default': '600' // use shade 200 for default, and keep all other shades the same
    })
    ;

});