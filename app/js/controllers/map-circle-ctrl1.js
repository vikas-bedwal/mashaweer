/**
 * Created by vikas on 20/08/15.
 */

App.controller('MapCircleController1', ['$scope', '$timeout', '$http', 'uiGmapLogger', 'uiGmapGoogleMapApi', '$cookies', '$cookieStore', 'MY_CONSTANT'
    , function ($scope, $timeout, $http, $log, GoogleMapApi, $cookies, $cookieStore, MY_CONSTANT) {

console.log("Outer circle");

        $log.currentLevel = $log.LEVELS.debug;

        var center = {
            latitude: "30.7333148",
            longitude: "76.7794179"
        };

        $scope.map = {
            center: center,
            pan: true,
            zoom: 14,
            refresh: false,
            events: {},
            bounds: {}
        };

        $scope.total_no_of_drivers = "";
        $scope.MapTitle = "Driver Name";

        markerArr = [];
        markerArr2  =[]
        markerCount = 0;
        var bound_val =0;

        $scope.map = {
            zoom:14,
            center: new google.maps.LatLng(30.7333148, 76.7794179),
            pan : true
        };

        $scope.mapContainer = new google.maps.Map(document.getElementById('map-container'), $scope.map);
        var infoWindow = new google.maps.InfoWindow();


        $scope.placeMarker = function(lat,long) {
            console.log("placeMarker");
            var icon = 'app/img/mapMarker.png';
            $scope.map = {
                zoom:  10,
                center: new google.maps.LatLng(lat, long),
                pan : true
            }

            var panPoint = new google.maps.LatLng(lat, long);
            $scope.mapContainer.panTo(panPoint);

            if(markerArr.length){
                for(var i=0; i< markerArr.length; i++)
                    markerArr[i].setMap(null);
                markerArr.pop();
            }
            var marker = new google.maps.Marker({
                map: $scope.mapContainer,
                icon: icon,
                position: new google.maps.LatLng(lat, long),
                draggable: true
            });
            markerArr.push(marker);

        }
        $scope.dropoffmarker = function(lat,long) {
            console.log("placeMarker");
            var icon = 'app/img/mapMarker.png';
            $scope.map = {
                zoom:  10,
                center: new google.maps.LatLng(lat, long),
                pan : true
            }

            var panPoint = new google.maps.LatLng(lat, long);
            $scope.mapContainer.panTo(panPoint);

            if(markerArr2.length){
                for(var i=0; i< markerArr2.length; i++)
                    markerArr2[i].setMap(null);
                markerArr2.pop();
            }
            var marker = new google.maps.Marker({
                map: $scope.mapContainer,
                icon: icon,
                position: new google.maps.LatLng(lat, long),
                draggable: true
            });
            markerArr2.push(marker);
            google.maps.event.addListener(marker, 'drag', function () {
                console.log("  drag");
                if ($scope.poly) {
                    poly = $scope.poly;
                    poly.setMap(null);   //destrying the already created path;
                }
                $scope.reverseGeocode(marker.getPosition(), 1);


            });
            google.maps.event.addListener(marker, 'dragend', function () {
                //$scope.reverseGeocode(marker.getPosition(), 1);
                $scope.lat2 = marker.getPosition().lat();
                $scope.lng2 = marker.getPosition().lng();
                $scope.reverseGeocode(marker.getPosition(), 1);
                drawPath($scope.lat1,$scope.lng1,$scope.lat2,$scope.lng2);
            });

        }
//*===========================================================================================================================*
//*=============================================REVERSE GEOCODING TO GET ADDRESS==============================================
//*===========================================================================================================================*
        $scope.reverseGeocode = function (latlong, val) {
            (new google.maps.Geocoder()).geocode({'latLng': latlong}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        if (val == 0) {
                            $('#address').val(results[0].formatted_address);
                        }
                        else {
                            $('#drop_off_address').val(results[0].formatted_address);
                        }
                        //$('#latitude').val(marker.getPosition().lat());
                        //$('#longitude').val(marker.getPosition().lng());

                    }
                }
            });

        }
$scope.job = {};
        $scope.checkStatus = function(){
            console.log("In checkStatus");
            console.log($scope.job.vehival_id);
            console.log($scope.job.pickup_email);
            if($scope.job.vehival_id==undefined || $scope.job.pickup_email==undefined || $scope.job.parcel_detail==undefined || $scope.job.note==undefined
               || $scope.job.vehival_id=="" || $scope.job.pickup_email=="" || $scope.job.parcel_detail=="" || $scope.job.note==""){
                console.log("if");
                $scope.boxStatus = 0;
            }
        }

$scope.boxStatus = 0;
        $scope.addOrder = function(data,status){
            console.log("Place It");
            console.log(data);
            if(!$scope.panelDemo4){
                console.log("if");
                console.log($scope.panelDemo4);
                $scope.errorMsg = "Please Select All Checkboxes";
                $scope.boxStatus = 1;
                setTimeout(function () {
                    $scope.errorMsg = "";
                    $scope.$apply();
                }, 3000);
            }
            else{
                console.log("else");
            }
        }


        $scope.clickIt = function(add,flag){
            console.log("clickIt");
            console.log(add);
            console.log(flag);
            (new google.maps.Geocoder()).geocode({
                'address': add
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if(flag==1){
                        console.log("if")
                        $scope.lat1 = results[0].geometry.location.lat();
                        $scope.lng1 = results[0].geometry.location.lng();
                         $scope.placeMarker($scope.lat1,$scope.lng1);
                        //drawPath( $scope.lat1,$scope.lng1,30.7333148,76.7794179);
                    }
                    else{
                        console.log("else");
                        $scope.lat2 = results[0].geometry.location.lat();
                        $scope.lng2 = results[0].geometry.location.lng();
                        $scope.dropoffmarker($scope.lat2,$scope.lng2);
                       // drawPath( $scope.lat2,$scope.lng2,30.7333148,76.7794179);
                    }

                    drawPath( $scope.lat1,$scope.lng1,$scope.lat2,$scope.lng2);
                }
            });
        }



        /*--------------------------------------------------------------------------
         * --------- funtion to draw path between pick-up location and drop-off ----
         ------------------------------- location ----------------------------------*/
        var drawPath = function (lat1, lng1, lat2, lng2) {

            console.log("DRawpath");

            if ($scope.poly) {
                poly = $scope.poly;
                poly.setMap(null);   //destrying the already created path;
            }


            var lat_lng = [];
            var myLatlng = new google.maps.LatLng(lat1, lng1);
            lat_lng.push(myLatlng);
            var myLatlng1 = new google.maps.LatLng(lat2, lng2);
            lat_lng.push(myLatlng1);

            var path = new google.maps.MVCArray();

            //Initialize the Direction Service
            var service = new google.maps.DirectionsService();

            //Set the Path Stroke Color
            var poly = new google.maps.Polyline({map: $scope.mapContainer, strokeColor: '#4986E7 '});


            //Loop and Draw Path Route between the Points on MAP
            for (var i = 0; i < lat_lng.length; i++) {
                if ((i + 1) < lat_lng.length) {
                    var src = lat_lng[i];
                    var des = lat_lng[i + 1];
                    path.push(src);
                    poly.setPath(path);
                    service.route({
                        origin: src,
                        destination: des,
                        travelMode: google.maps.DirectionsTravelMode.DRIVING
                    }, function (result, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                                path.push(result.routes[0].overview_path[i]);
                            }


                        }
                    });
                }
            }

            $scope.poly = poly;


        };



    }]);