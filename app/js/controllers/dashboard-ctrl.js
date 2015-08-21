
/**
 * Created by Vikas on 03/08/15.
 */

App.controller('dashboardController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT,$rootScope,ngDialog,$log) {
    'use strict';
    $rootScope.test = $cookieStore.get('obj1').adminType;
    $http.get(MY_CONSTANT.url + 'api/admin/statsInfo/' + $cookieStore.get('obj').accesstoken)
        .success(function (response, status) {
            if (status == 200) {
                $scope.totalCompletedOrder = response.data.totalCompletedOrder;
                $scope.totalNewCustomer = response.data.totalNewCustomer;
                $scope.totalOnlineDriver = response.data.totalOnlineDriver;
                $scope.totalOrder = response.data.totalOrder;
                $scope.totalRevenue = response.data.totalRevenue;
                $scope.totalUnAssignedOrder = response.data.totalUnAssignedOrder;
            } else {
                alert("Something went wrong, please try again later.");
                return false;
            }
        })
        .error(function (error) {
            console.log(error);
        });

    $scope.placeOrder = function(){
        console.log("Order");
        ngDialog.openConfirm({
            template: 'placeOrder',
            className: 'ngdialog-theme-default placeOrder',
            scope: $scope
        }).then(function (value) {
        }, function (reason) {
        });
    }

/*    App.controller('MapCircleController1', ['$scope', '$timeout', '$http', 'uiGmapLogger', 'uiGmapGoogleMapApi', '$cookies', '$cookieStore', 'MY_CONSTANT'
        , function ($scope, $timeout, $http, $log, GoogleMapApi, $cookies, $cookieStore, MY_CONSTANT) {
console.log("In dashboard circle");

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

           *//* markerArr = new Array();
            markerCount = 0;
            var bound_val =0*//*

            $scope.map = {
                zoom:3,
                center: new google.maps.LatLng(30.8857, 76.2599),
                pan : true
            }
            $scope.mapContainer = new google.maps.Map(document.getElementById('map-container'), $scope.map);
            var infoWindow = new google.maps.InfoWindow();

        }]);*/

});