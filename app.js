'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.map',
    'myApp.news',
    'ngMaterial',
    'myApp.about'



])
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({redirectTo: '/map'});
    }])
    .controller('appCtr', function ($rootScope, $scope, $mdToast, $mdSidenav, $http) {




        $scope.loading = true;
        $scope.magNdate = false;
        // toast or notification
        $scope.toastSuccess = function () {
            $mdToast.show(
                $mdToast.simple()
                    .content('Success Fetching an API!!!')
                    .position('top')
                    .hideDelay(3000)
            );
        };
        $scope.toastFail = function () {
            $mdToast.show(
                $mdToast.simple()
                    .content('Failed Fetching an API!!!')
                    .position('top')
                    .hideDelay(3000)
            );
        };
        $scope.closetoast = function () {
            $mdToast.hide();
        }
        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');
        $scope.closeToggle = function () {
            $mdSidenav('right').close();
        };
        function buildToggler(componentId) {
            return function () {
                $mdSidenav(componentId).toggle();
            }
        }

        $scope.orderEQ = [{
            show: 'Newest Earthquake',
            value: '-properties.time'
        }, {
            show: 'Oldest Earthquake',
            value: '+properties.time'
        }, {
            show: 'Largest Magnitude',
            value: '-properties.mag'
        }, {
            show: 'Smallest Magnitude',
            value: '+properties.mag'
        }];
        // Chose a timezone
        $scope.timezones = [{
            show: 'UTC Timezone',
            value: 'UTC'
        }, {
            show: 'Local Timezone',
            value: ''
        }];
        // Chose earthquake api
        $scope.feedApi = [{
            title: 'M4.5+ Earthquakes Day',
            time: 'day',
            url: 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson'
        }, {
            title: 'M2.5+ Earthquakes Day',
            time: 'day',
            url: 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson'
        }, {
            title: 'All Earthquakes Day',
            time: 'day',
            url: 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
        }, {
            title: 'M4.5+ Earthquakes Week',
            time: 'week',
            url: 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson'
        }, {
            title: 'M2.5+ Earthquakes Week',
            time: 'week',
            url: 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson'
        }, {
            title: 'All Earthquakes Week',
            time: 'week',
            url: 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
        }, {
            title: 'M4.5+ Earthquakes Month',
            time: 'month',
            url: 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson'
        }, {
            title: 'M2.5+ Earthquakes Month',
            time: 'month',
            url: 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson'
        }, {
            title: 'All Earthquakes Month',
            time: 'month',
            url: 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
        }, {
            title: 'Significant Earthquakes Month',
            time: 'month',
            url: 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'
        }

        ];


        // Fetching api when a radio button is triggered
        $scope.fetchApi = function (api) {
            $scope.loading = true;

            // $scope.closeSetting();

            $http.get(api)
                .then(function (response) {
                    $scope.content = response.data;
                    // $scope.map.setView([0, 0], 2);
                    $scope.toastSuccess();
                    $scope.magNdate = false;

                }, function (response) {
                    $scope.content = response.data;
                    $scope.toastFail();
                }).finally(function () {
                //When the api already fetched, stop the loading
                $scope.loading = false;
                $scope.quakes = $scope.content.features;

            });
        };
        // Submit a query form to search spesific earthquake
        $scope.searchEarthq = function (dateStart, dateEnd, minMagnitude, maxMagnitude) {
            // $scope.map.setView([0, 0], 2);
            // $scope.closeSetting();
            $scope.loading = 'true';
            $http.get("http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson" + "&starttime=" + dateStart + "&endtime=" + dateEnd + "&minmagnitude=" + minMagnitude + "&maxmagnitude=" + maxMagnitude)
                .then(function (response) {
                    //First function handles success
                    $scope.content = response.data;
                    $scope.loaded = 'true';
                    $scope.toastSuccess();
                    $scope.magNdate = true;
                    // $scope.getNearest();
                }, function (response) {
                    $scope.content = response.data || "Request failed";
                    $scope.status = response.status;
                    $scope.toastFail();
                    console.log('Failed retrieving API')
                }).finally(function () {
                //When the api already fetched, stop the loading
                $scope.loading = false;
                $scope.quakes = $scope.content.features;
            });
        };

        //  Maximal date User can input a date.
        $scope.nowDate = new Date();
        $scope.maxDate = new Date(
            $scope.nowDate.getFullYear(),
            $scope.nowDate.getMonth(),
            $scope.nowDate.getDate() - 1
        );


        // $scope.getNearest = function(point){
        //
        // };

        //Fetching realtime earthquake at index.html
        $http.get('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson')
            .then(function (response) {
                $scope.magNdate = false;
                $scope.content = response.data;
                $scope.toastSuccess();
                // $scope.getNearest();
            }, function (response) {
                $scope.content = response.data;
                $scope.toastFail();
            }).finally(function () {
            //When the api already fetched, stop the loading
            $scope.loading = false;
            $scope.quakes = $scope.content.features;

        });
        //fetch an rss feed from usgs news
        $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent("https://www.usgs.gov/news/all/feed"))
            .then(function (response) {

                $scope.feeds = response.data.responseData.feed.entries;

                // $scope.getNearest();
            }, function (response) {
                $scope.content = response.data;

            }).finally(function () {
            //When the api already fetched, stop the loading
            console.log($scope.feeds);

        });
        //    Selecting an earthquake
        //    When an eathquake is selected, the setView of map is change


        // $scope.map.remove();
        this.topDirections = ['left', 'up'];
        this.bottomDirections = ['down', 'right'];

        this.isOpen = false;

        this.availableModes = ['md-fling', 'md-scale'];
        this.selectedMode = 'md-fling';

        this.availableDirections = ['up', 'down', 'left', 'right'];
        this.selectedDirection = 'up';


    });
