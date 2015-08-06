App.controller('dhd', ['$scope', '$timeout', '$http', 'uiGmapLogger', '$cookies', '$cookieStore', 'MY_CONSTANT', '$state','responseCode', 'uiGmapGoogleMapApi','MapLatLong'
    , function ($scope, $timeout, $http, $log, $cookies, $cookieStore, MY_CONSTANT, $state, responseCode,GoogleMapApi,MapLatLong) {


        $log.currentLevel = $log.LEVELS.debug;

        $scope.total_no_of_drivers = "";
        $scope.MapTitle = "Driver Name";

        markerArr = new Array();
        markerCount = 0;
        var bound_val =0

        $scope.map = {
            zoom: $cookieStore.get('zoom') || 10,
            center: new google.maps.LatLng(MapLatLong.lat, MapLatLong.lng),
            pan : true

        }

        $scope.mapContainer = new google.maps.Map(document.getElementById('map-container'), $scope.map);
        var infoWindow = new google.maps.InfoWindow();

        var createMarker = function (info) {

            if(info.is_available == 0){
                var icon = 'app/img/offmodeDriver.png';
            }
            else{
                if(info.status==1){
                    var icon = 'app/img/busyDriver.png';
                }
                else{
                    var icon = 'app/img/freeDriver.png';
                }
            }

            var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(info.current_location_latitude, info.current_location_longitude),
                map: $scope.mapContainer,
                labelContent: "" + (info.car_type + 1),
                icon: icon,
                labelAnchor: new google.maps.Point(9, 37),
                labelClass: "labels", // the CSS class for the label
                labelStyle: {opacity: 0.9}
            });

            marker.content = '<div class="infoWindowContent">' +
            '<center>Driver Info</center>' +
            '<span> Name - ' + info.user_name + '</span><br>' +
            '<span> Phone - ' + info.phone_no + '</span><br>' +
            '<span> Email - ' + info.user_email + '</span>' +
            '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent(marker.content);
                infoWindow.open($scope.mapContainer, marker);
            });

            markerArr.push(marker);
            markerCount = markerCount + 1;

        }

        $scope.drawMap = function () {

            $.post(MY_CONSTANT.url + '/driver_heat_map', {
                    access_token: $cookieStore.get('obj').accesstoken
                },
                function (response) {
                    response = JSON.parse(response);
                    if (response.status = responseCode.SUCCESS) {


                        var data = response.data;

                        var markerAddresses = [];
                        var driverData = data.driver_data;

                        var length = data.driver_data.length;

                        $scope.total_no_of_drivers = length;
                        //$scope.$apply();

                        if (length) {

                            driverData.forEach(function (column) {
                                createMarker(column);
                                $scope.openInfoWindow = function (e, selectedMarker) {
                                    e.preventDefault();
                                    google.maps.event.trigger(selectedMarker, 'click');
                                }

                            });
                            $scope.mcOptions = {gridSize: 50, maxZoom: 20};

                            //if ($scope.markerClusterer) {
                            //    $scope.markerClusterer.clearMarkers();   //clearing the markercluster to add new
                            //}

                            $scope.markerClusterer = new MarkerClusterer( $scope.mapContainer, markerArr,$scope.mcOptions);

                            //function to get lat long bounds according to marker position
                            bound_val =  $scope.setBounds();

                        }
                        else{

                        }

                        google.maps.event.addListener($scope.mapContainer, 'zoom_changed', function() {
                            $cookieStore.put('zoom', $scope.mapContainer.getZoom());
                        });

                    }
                })
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

        $scope.drawMap();

        $scope.setinterval= setInterval(function(){

            markerArr = [];    //empty the markerArray to refresh the map
            markerCount = 0;

            $scope.drawMap();
        }, 10000);

        $scope.$on('$destroy',function(){
            if( $scope.setinterval)
                clearInterval($scope.setinterval);
        });




    }]);