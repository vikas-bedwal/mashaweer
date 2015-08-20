/**
 * Created by vikas on 20/08/15.
 */

App.controller('MapCircleController1', ['$scope', '$timeout', '$http', 'uiGmapLogger', 'uiGmapGoogleMapApi', '$cookies', '$cookieStore', 'MY_CONSTANT'
    , function ($scope, $timeout, $http, $log, GoogleMapApi, $cookies, $cookieStore, MY_CONSTANT) {


        $log.currentLevel = $log.LEVELS.debug;

        var center = {
            latitude: "30.7333148",
            longitude: "76.7794179"
        };

        $scope.map = {
            center: center,
            pan: true,
            zoom: 3,
            refresh: false,
            events: {},
            bounds: {}
        };

        $scope.total_no_of_drivers = "";
        $scope.MapTitle = "Driver Name";

        markerArr = new Array();
        markerCount = 0;
        var bound_val =0

        $scope.map = {
            zoom:3,
            center: new google.maps.LatLng(30.8857, 76.2599),
            pan : true
        }
        $scope.mapContainer = new google.maps.Map(document.getElementById('map-container'), $scope.map);
        var infoWindow = new google.maps.InfoWindow();

    }]);