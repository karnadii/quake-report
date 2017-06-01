'use strict';

angular.module('myApp.about', ['ngRoute', 'myApp'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/about', {
            templateUrl: 'about/about.html',
            controller: 'aboutCtrl'
        });
    }])

    .controller('aboutCtrl', function ($scope) {
        $scope.hello = "Hello this is shoul be a news";
    });