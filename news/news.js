'use strict';

angular.module('myApp.news', ['ngRoute','myApp'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/news', {
    templateUrl: 'news/news.html',
    controller: 'newsCtrl'
  });
}])

.controller('newsCtrl', function($scope) {
  $scope.hello = "Hello this is shoul be a news";
});