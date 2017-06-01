'use strict';

angular.module('myApp.map', ['ngRoute','myApp'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/map', {
    templateUrl: 'map/map.html',
    controller: 'mapCtrl'
  });
}])

.controller('mapCtrl', function($scope,$http) {

    //Initialize Map


    $scope.light = L.tileLayer('https://api.mapbox.com/styles/v1/ujangkarnadi/cir3nu0ca002qjcnntg0bt6uy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidWphbmdrYXJuYWRpIiwiYSI6ImNpcjNtcW1kbjAwMHkyM25tbWpzZHJxb3YifQ.qVHEVMvLwg-Hw5ErqRKDSA', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'ujangkarnadi.0p2pod2d',
        accessToken: 'pk.eyJ1IjoidWphbmdrYXJuYWRpIiwiYSI6ImNpcjNtcW1kbjAwMHkyM25tbWpzZHJxb3YifQ.qVHEVMvLwg-Hw5ErqRKDSA'
    });
    $scope.dark = L.tileLayer('https://api.mapbox.com/styles/v1/ujangkarnadi/cir7jdxi0000lgzm5dzphm2i8/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidWphbmdrYXJuYWRpIiwiYSI6ImNpcjNtcW1kbjAwMHkyM25tbWpzZHJxb3YifQ.qVHEVMvLwg-Hw5ErqRKDSA', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'ujangkarnadi.0p2pod2d',
        accessToken: 'pk.eyJ1IjoidWphbmdrYXJuYWRpIiwiYSI6ImNpcjNtcW1kbjAwMHkyM25tbWpzZHJxb3YifQ.qVHEVMvLwg-Hw5ErqRKDSA'
    });
    $scope.street = L.tileLayer('https://api.mapbox.com/styles/v1/ujangkarnadi/cir7ixjl1000gh7nt93ii9f2d/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidWphbmdrYXJuYWRpIiwiYSI6ImNpcjNtcW1kbjAwMHkyM25tbWpzZHJxb3YifQ.qVHEVMvLwg-Hw5ErqRKDSA', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'ujangkarnadi.0p2pod2d',
        accessToken: 'pk.eyJ1IjoidWphbmdrYXJuYWRpIiwiYSI6ImNpcjNtcW1kbjAwMHkyM25tbWpzZHJxb3YifQ.qVHEVMvLwg-Hw5ErqRKDSA'
    });
    var baseMaps = {
        "Light": $scope.light,
        "Dark": $scope.dark,
        "Blue": $scope.street
    };
    $scope.map = L.map('map',{
        layer: $scope.light}
    ).setView([0, 0], 2);
    L.control.layers(baseMaps).addTo($scope.map);
    $scope.light.addTo($scope.map);
    L.control.mousePosition().addTo($scope.map);
    // function to add a popupcontent to a marker
    //so if a marker is clicked
    //some content will show
    function onEachFeature(feature, layer) {
        $scope.popupContent = "<b>Magnitude " + feature.properties.mag + " Earthquake</b><hr>" +
            feature.properties.place + "<br>" + convertTime(feature.properties.time);
        layer.bindPopup($scope.popupContent);
    }
    //Adding marker to map
    $scope.addMarker = function(marker) {
        $scope.marker = L.geoJson(marker, {
            onEachFeature: onEachFeature,
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng,

                    {
                        radius: Math.pow(2, feature.properties.mag) / 2,
                        fillColor: function getColor() {
                            if (feature.properties.mag < 2.5) {
                                return 'yellow';
                            } else if (feature.properties.mag < 4.5) {
                                return 'orange';
                            } else {
                                return 'red';
                            }
                        }(),
                        color: "#4d0f00",
                        weight: 1,
                        opacity: 0.4,
                        fillOpacity: 0.5
                    });
            }
        }).addTo($scope.map);
        return $scope.marker;
    };
    //Remove marker from map
    $scope.removeMarker = function() {
        $scope.map.removeLayer($scope.marker);
    };
    $scope.updateUserLocation = function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            $scope.userLocation = position.coords;
        });
    };
    // When the user's location changes, remove any existing user
    // markers and create a new one at the user's coordinates
    $scope.$watch("userLocation", function(newVal, oldVal) {
        if (!newVal) return;
        if ($scope.userMarker)
            $scope.map.removeLayer($scope.userMarker);

        var point = L.latLng(newVal.latitude, newVal.longitude);
        $scope.point = point;
        $scope.userMarker = L.marker(point, {
            bounceOnAdd: true,
            bounceOnAddOptions: {
                duration: 500,
                height: 100
            },
            bounceOnAddCallback: function() {
                console.log("done");
            }
        });
        $scope.map.addLayer($scope.userMarker);


    });
    $scope.$watchCollection("filteredQuakes", function(addItems, removeItems) {
        $scope.map.setView([0, 0], 2);
        if (removeItems && removeItems.length)
            $scope.removeMarker();

        if (addItems && addItems.length)
            $scope.addMarker(addItems);
    });
    // convert api time to human time
    function convertTime(unixTime) {
        return $scope.time = new Date(unixTime);

    }

    $scope.selectQuake = function(quake) {
        $scope.selectedQuake = quake;
        $http.get($scope.selectedQuake.properties.detail)
            .then(function(response){
                $scope.detail = response.data;
            }, function(response){
                console.log(response.data);
            })
            .finally(function(){
                    console.log('done');
                }

            )
        $scope.map.setView([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], 5, {
            animate: true
        });
    };

});