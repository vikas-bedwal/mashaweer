/**
 * Created by Vikas on 05/08/15.
 */

App.controller('MapCircleController', ['$scope', '$timeout', '$http', 'uiGmapLogger', 'uiGmapGoogleMapApi', '$cookies', '$cookieStore', 'MY_CONSTANT'
    , function ($scope, $timeout, $http, $log, GoogleMapApi, $cookies, $cookieStore, MY_CONSTANT) {

        $log.currentLevel = $log.LEVELS.debug;

        var center = {
            latitude: "30.7333148",
            longitude: "76.7794179"
        };

        $scope.map = {
            center: center,
            pan: true,
            zoom: 7,
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


        /*================Setting marker for Live driver===================*/
        var createMarker = function (info) {
            var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(info.latitude, info.longitude),
                map: $scope.mapContainer
            });

            marker.content = '<div class="infoWindowContent">' +
            '<center>Driver Info</center>' +
            '<span> Name - ' + info.fullName + '</span><br>' +
            '<span> Phone - ' + info.phoneNumber + '</span><br>' +
            '<span> Email - ' + info.email + '</span>' +
            '</div>';


            google.maps.event.addListener(marker, 'click', function () {
                console.log(marker.content);
                infoWindow.setContent(marker.content);
                infoWindow.open($scope.mapContainer, marker);
            });

            markerArr.push(marker);
            markerCount = markerCount + 1;

        }

        /*================Setting marker for Live order pick up location===================*/
        var createMarker1 = function (info) {
            var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(info.pickupLat, info.pickupLong),
                map: $scope.mapContainer
            });

            marker.content = '<div class="infoWindowContent">' +
            '<center>Driver Info</center>' +
            '<span> Address - ' + info.driverFullName + '</span><br>' +
            '<span> Drop Off Address - ' + info.dropUpAddress + '</span><br>' +
            '<span> Phone - ' + info.pickupPhoneNo + '</span><br>' +
            '<span> Status - ' + info.status + '</span>' +
            '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                console.log(marker.content);
                infoWindow.setContent(marker.content);
                infoWindow.open($scope.mapContainer, marker);
            });
            markerArr.push(marker);
            markerCount = markerCount + 1;
        }

        /*================Setting marker for Live order drop off location===================*/
        var createMarker2 = function (info) {
            var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(info.dropUpLat, info.dropUpLong),
                map: $scope.mapContainer
            });

            marker.content = '<div class="infoWindowContent">' +
            '<center>Driver Info</center>' +
            '<span> Address - ' + info.driverFullName + '</span><br>' +
            '<span> Pick Up Address - ' + info.pickupAddress + '</span><br>' +
            '<span> Phone - ' + info.dropUpPhoneNo + '</span><br>' +
            '<span> Status - ' + info.status + '</span>' +
            '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                console.log(marker.content);
                infoWindow.setContent(marker.content);
                infoWindow.open($scope.mapContainer, marker);
            });
            markerArr.push(marker);
            markerCount = markerCount + 1;
        }

        $scope.setBounds = function(){
            if(bound_val==0){
                var bounds = new google.maps.LatLngBounds();
                for(var i=0;i<markerCount;i++) {
                    bounds.extend(markerArr[i].getPosition());
                }
                $scope.mapContainer.fitBounds(bounds);

            }
            return 1;
        }



        $scope.drawMap = function () {
            $http.get(MY_CONSTANT.url + 'api/admin/getLiveView/' + $cookieStore.get('obj').accesstoken)
                .success(function (response, status) {
                    if (status == 200) {
                        console.log(response);
                        var dataArray = [];
                        var liveDriverList = response.data.driverDetailArray;
                        var liveOrderList = response.data.orderDetail;

                        var orderLength = response.data.orderDetail.length;
                        var driverLength = response.data.driverDetailArray.length;
                        $scope.total_no_of_drivers = driverLength;

                        /*================Calling Live driver marker set function===================*/
                        if (driverLength) {
                            liveDriverList.forEach(function (column) {
                                createMarker(column);
                                $scope.openInfoWindow = function (e, selectedMarker) {
                                    e.preventDefault();
                                    google.maps.event.trigger(selectedMarker, 'click');
                                }

                            });
                            $scope.mcOptions = {gridSize: 50, maxZoom: 20};

                            if ($scope.markerClusterer) {
                                $scope.markerClusterer.clearMarkers();   //clearing the markercluster to add new
                            }

                            $scope.markerClusterer = new MarkerClusterer($scope.mapContainer, markerArr, $scope.mcOptions);

                            //function to get lat long bounds according to marker position
                            bound_val = $scope.setBounds();
                        }
                        else {

                        }

                    /*================Calling marker set function for Live order pickup location===================*/
                        if (orderLength) {
                            liveOrderList.forEach(function (column) {
                                createMarker1(column);
                                $scope.openInfoWindow = function (e, selectedMarker) {
                                    e.preventDefault();
                                    google.maps.event.trigger(selectedMarker, 'click');
                                }

                            });
                            $scope.mcOptions = {gridSize: 50, maxZoom: 20};

                            if ($scope.markerClusterer) {
                                $scope.markerClusterer.clearMarkers();   //clearing the markercluster to add new
                            }

                            $scope.markerClusterer = new MarkerClusterer($scope.mapContainer, markerArr, $scope.mcOptions);

                            //function to get lat long bounds according to marker position
                            bound_val = $scope.setBounds();
                        }
                        else {

                        }


                        /*================Calling marker set function for Live order drop off location===================*/
                        if (orderLength) {
                            liveOrderList.forEach(function (column) {
                                createMarker2(column);
                                $scope.openInfoWindow = function (e, selectedMarker) {
                                    e.preventDefault();
                                    google.maps.event.trigger(selectedMarker, 'click');
                                }

                            });
                            $scope.mcOptions = {gridSize: 50, maxZoom: 20};

                            if ($scope.markerClusterer) {
                                $scope.markerClusterer.clearMarkers();   //clearing the markercluster to add new
                            }

                            $scope.markerClusterer = new MarkerClusterer($scope.mapContainer, markerArr, $scope.mcOptions);

                            //function to get lat long bounds according to marker position
                            bound_val = $scope.setBounds();
                        }
                        else {

                        }
                    } else {
                        alert("Something went wrong, please try again later.");
                        return false;
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        };

        $scope.drawMap();

        $scope.setinterval= setInterval(function(){

            markerArr = [];    //empty the markerArray to refresh the map
            markerCount = 0;

            $scope.drawMap();
        }, 400000);


    }]);