/*
App.controller('AddBookingController', ['$scope','$interval', '$timeout', '$http', 'uiGmapLogger', '$cookies', '$cookieStore', 'MY_CONSTANT', '$state', 'ngDialog', 'uiGmapGoogleMapApi', 'responseCode', 'countryName','MapLatLong'
    , function ($scope,$interval, $timeout, $http, $log, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog, GoogleMapApi, responseCode, countryName,MapLatLong) {

        $log.currentLevel = $log.LEVELS.debug;
        $scope.newReg = {};
        $scope.newReg.successMsg = "";
        $scope.book_ride = false;
        $scope.booking = {};
        $scope.driver_data = {};
        $scope.info = {};
        $scope.ride = {};
        $scope.rideText = "Book";
        $scope.time_msg = false;
        $scope.book_ride_later_data = {};
        $scope.customer_access_token = "";
        $scope.show_driver_flag = false;
        $scope.manual_drivers = false;
        $scope.time_value = false;
        $scope.book_type = false; //manual booking
        $scope.approx={};
        $scope.eta_flag =0;   //flag for showing ETA
        $scope.approx_value_show = 0;//flag for showing hr tag
        $scope.approx_price =0; //flag for estimated price

        $scope.total_rqst_send = 0;

        $scope.interval_for_particular_driver = {};
        $scope.cancel_interval_time_driver = {};

        $scope.poly = '';


        */
/*--------------------------------------------------------------------------
         * --------- funtion to destroy intervals on changing controllers ----------
         ------------------------------- ------------------------------------------*//*

        $scope.$on('$destroy',function() {

            clearInterval($scope.interval_time);
            clearInterval($scope.cancel_interval_time);

            for (var i = 1; i <= $scope.total_rqst_send; i++) {

                $interval.cancel($scope.interval_for_particular_driver[i]);
                $interval.cancel($scope.cancel_interval_time_driver[i]);
            }
        });

//==========================================================================================================================
//========================================================== calculating distance ===========================================
//==========================================================================================================================
        $scope.getDistance=function(){

            // show route between the points
            directionsService = new google.maps.DirectionsService();
            directionsDisplay = new google.maps.DirectionsRenderer(
                {
                    suppressMarkers: true,
                    suppressInfoWindows: true
                });
            // directionsDisplay.setMap(map);
            var request = {
                origin:$scope.location1,
                destination:$scope.location2,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            directionsService.route(request, function(response, status)
            {
                if (status == google.maps.DirectionsStatus.OK)
                {
                    var string;

                    directionsDisplay.setDirections(response);
                    var driving_time = parseFloat(response.routes[0].legs[0].duration.value/60);
                    var distance = parseFloat(response.routes[0].legs[0].distance.value/1000);
                    string = "The distance between the two points on the chosen route is: "+response.routes[0].legs[0].distance.text;
                    string += "<br/>The aproximative driving time is: "+response.routes[0].legs[0].duration.text;

                    $scope.fare_factor = parseFloat($scope.fare_factor);
                    $scope.approx.fare_fixed = parseFloat($scope.approx.fare_fixed);
                    $scope.approx.fare_per_min = parseFloat($scope.approx.fare_per_min);

                    $scope.estimated_price = ($scope.fare_factor*($scope.approx.fare_fixed+(driving_time*$scope.approx.fare_per_min)+(distance*$scope.approx.fare_per_km))).toFixed(2);
                    $scope.approx_price=1;

                }
                $scope.$apply();
            });
        }
//==========================================================================================================================
//===============================================end distance calculation ================================================
//==========================================================================================================================

        //get car type details for expected fare calculation
        $scope.getfare=function(cartype_val){

            $.post(MY_CONSTANT.url + '/list_all_cars', {access_token: $cookieStore.get('obj').accesstoken},
                function (data) {
                    data = JSON.parse(data);
                    var length = data.data.car_list.length;
                    if (data.status== responseCode.SUCCESS) {
                        var carList = data.data.car_list;
                        for (i = 0; i < length; i++) {
                            if (i==cartype_val) {
                                $scope.$apply(function () {
                                    $scope.approx = {
                                        fare_per_min: data.data.car_list[i].fare_per_min,
                                        fare_per_km: data.data.car_list[i].fare_per_km,
                                        fare_fixed: data.data.car_list[i].fare_fixed
                                    };
                                });
                            }
                        }
                        $scope.getDistance();
                    }
                });

        }


        */
/*--------------------------------------------------------------------------
         * --------- funtion to enter only numbers in number field -----------------
         ------------------------------- ------------------------------------------*//*

        $('#main-content').on('keypress', '#search_phone_no', function (e) {
            var curval = $(this).val().length;

            if ((e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57))) {
                return false;
            }
            else if (e.which == 8 || e.which == 0) {
                return true;
            }
            else if (curval == 14) {
                return false;
            }
        });



        var start = new Date();
        start.setHours(start.getHours() + 1);
        start = new Date(start);

        start.setMinutes(start.getMinutes() + 4);
        start = new Date(start);

        //e.setDate(start.getDate() + 3);

        $("#pick_up_time").datetimepicker({
            format: 'yyyy/mm/dd hh:ii',
            autoclose: true,
            startDate: start
            //endDate: e
        });



        $scope.$watch('book_type', function (newValue, oldValue) {
            start.setHours(start.getHours() + 1);
            start = new Date(start);
            if (newValue == false) {
                $scope.time_value = false;

            }
            else{
                $scope.manual_drivers = false;
            }
        });

        $scope.$watch('time_value', function (newValue, oldValue) {
            start.setHours(start.getHours() + 1);
            start = new Date(start);
            $("#pick_up_time").val('');
        });

        */
/*--------------------------------------------------------------------------
         * --------- funtion to disable button itself ------------------------------
         ------------------------------- ------------------------------------------*//*

        $('#driver_table').on('click', '.assignDriver', function(e) {
            $scope.ongoing_ride_id= e.currentTarget.id;
            $(this).attr('disabled', 'disabled');
            $(this).text('Sent');
        });

        */
/*--------------------------------------------------------------------------
         * --------- funtion to send request to a particualr driver ----------------
         ------------------------------- ------------------------------------------*//*


        $scope.sendDriverRequest = function (driver_id) {

            $scope.ride_function = true;
            $scope.rideText = "Processing";

            $scope.sendDriverRequestTimer(driver_id, 0);

            $scope.total_rqst_send += 1;

            //$scope.interval_for_particular_driver[$scope.total_rqst_send] = $interval(function () {
            //    $scope.sendDriverRequestTimer(driver_id, 1);
            //}, 20000);
            //
            //for(var i=1;i<=$scope.total_rqst_send;i++){
            //    $scope.cancel_interval_time_driver[i] = $timeout(function () {
            //        $scope.ride_function = false;
            //        $scope.rideText = "Book";
            //
            //        $interval.cancel( $scope.interval_for_particular_driver[i]);
            //        $scope.manual_drivers = false;
            //    }, 180001);
            //}

            $scope.interval_for_particular_driver = $interval(function () {
                $scope.sendDriverRequestTimer(driver_id, 1);
            }, 20000);


            $scope.cancel_interval_time_driver = $timeout(function () {
                $scope.ride_function = false;
                $scope.rideText = "Book";

                $interval.cancel( $scope.interval_for_particular_driver);
                $scope.manual_drivers = false;
            }, 180001);





        };

        */
/*--------------------------------------------------------------------------
         * --------- funtion to get latitude and longitude of pick up location -----
         ------------------------------- ------------------------------------------*//*

        $scope.pickUpMarker = function (book) {
            var address = book.chosenPlace;

            (new google.maps.Geocoder()).geocode({
                'address': address
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    $scope.booking.latitude = results[0].geometry.location.lat();
                    $scope.booking.longitude = results[0].geometry.location.lng();

                } else {
                }
            });
        };

        */
/*--------------------------------------------------------------------------
         * --------- funtion to get latitude and longitude of pick up location -----
         -------------------- and place on map -----------------------------------*//*


        $scope.map = {
            zoom:  10,
            center: new google.maps.LatLng(MapLatLong.lat, MapLatLong.lng),
            pan : true
        }
        var markerArr = new Array();
        var markerArr1 = new Array();
        $scope.mapContainer = new google.maps.Map(document.getElementById('map-container'), $scope.map);

        //event for adding marker on click oof body of map
        google.maps.event.addListener($scope.mapContainer, 'click', function(event) {
            $scope.booking.latitude = event.latLng.lat();
            $scope.booking.longitude = event.latLng.lng();
            $scope.reverseGeocode(event.latLng,0);
            $scope.placeMarker(event.latLng.lat(),event.latLng.lng(),0);


        });


/*/
/*===========================================================================================================================*
/*/
/*=============================================REVERSE GEOCODING TO GET ADDRESS==============================================
/*/
/*===========================================================================================================================*
        $scope.reverseGeocode = function(latlong,val){
            (new google.maps.Geocoder()).geocode({'latLng': latlong}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        if(val==0)
                        {
                            $('#address').val(results[0].formatted_address);
                            $scope.info.chosenPlace = results[0].formatted_address;
                        }
                        else{
                            $('#drop_off_address').val(results[0].formatted_address);
                            $scope.info.dropOffPlace = results[0].formatted_address;
                        }
                        //$('#latitude').val(marker.getPosition().lat());
                        //$('#longitude').val(marker.getPosition().lng());

                    }
                }
            });

        }
/*/
/*===========================================================================================================================*
/*/
/*=============================================PLACE MARKER ON GIVEN LATLONG==================================================
/*/
/*===========================================================================================================================*
        $scope.placeMarker = function(lat,long,flag){

            if(flag==0)
                var icon = 'app/img/redMarker.png';
            else
                var icon = 'app/img/greenMarker.png';
            var marker = new google.maps.Marker({
                map: $scope.mapContainer,
                icon: icon,
                position: new google.maps.LatLng(lat,long),
                draggable: true
            });
            if(markerArr.length){
                for(var i=0; i< markerArr.length; i++)
                    markerArr[i].setMap(null);
                markerArr.pop();
            }
            markerArr.push(marker);
            if($scope.poly){
                poly = $scope.poly
                poly.setMap(null);   //destrying the already created path;
            }

            $scope.drawPAth(lat, long, $scope.book_ride_later_data.manual_destination_latitude, $scope.book_ride_later_data.manual_destination_longitude);

            google.maps.event.addListener(marker, 'drag', function() {
                $scope.reverseGeocode(marker.getPosition(),0);
                $scope.booking.latitude = marker.getPosition().lat();
                $scope.booking.longitude = marker.getPosition().lng();
                if($scope.poly){
                    poly = $scope.poly
                    poly.setMap(null);   //destrying the already created path;
                }

            });

            google.maps.event.addListener(marker, 'dragend', function() {
                $scope.reverseGeocode(marker.getPosition(),0);
                $scope.booking.latitude = marker.getPosition().lat();
                $scope.booking.longitude = marker.getPosition().lng();
                $scope.drawPAth($scope.booking.latitude, $scope.booking.longitude, $scope.book_ride_later_data.manual_destination_latitude, $scope.book_ride_later_data.manual_destination_longitude);

            });

        }


        $scope.pickUpLocationOnMarker = function (book) {

            var address = book.chosenPlace;

            (new google.maps.Geocoder()).geocode({
                'address': address
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $scope.location1 = results[0].geometry.location;
                    $scope.booking.latitude = results[0].geometry.location.lat();
                    $scope.booking.longitude = results[0].geometry.location.lng();

                    $scope.map = {
                        zoom:  10,
                        center: new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()),
                        pan : true
                    }

                    var panPoint = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                    $scope.mapContainer.panTo(panPoint);

                    var icon = 'app/img/redMarker.png';

                    if(markerArr.length){
                        for(i=0; i< markerArr.length; i++)
                            markerArr[i].setMap(null);
                        markerArr.pop();
                    }

                    var marker = new google.maps.Marker({
                        map: $scope.mapContainer,
                        icon: icon,
                        position: new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()),
                        draggable: true
                    });

                    google.maps.event.addListener(marker, 'drag', function() {
                        $scope.booking.latitude = marker.getPosition().lat();
                        $scope.booking.longitude = marker.getPosition().lng();
                        if ($scope.poly) {
                            poly = $scope.poly;
                            poly.setMap(null);
                        }

                    });

                    google.maps.event.addListener(marker,'dragend',function(event) {
                        $scope.reverseGeocode(marker.getPosition(),0);
                        $scope.booking.latitude = marker.getPosition().lat();
                        $scope.booking.longitude = marker.getPosition().lng();
                        $scope.drawPAth($scope.booking.latitude, $scope.booking.longitude, $scope.book_ride_later_data.manual_destination_latitude, $scope.book_ride_later_data.manual_destination_longitude);
                    });

                    if (($scope.booking.latitude != '' && $scope.booking.latitude != undefined) &&
                        ($scope.book_ride_later_data.manual_destination_latitude != '' && $scope.book_ride_later_data.manual_destination_latitude != undefined)) {

                        $scope.drawPAth($scope.booking.latitude, $scope.booking.longitude, $scope.book_ride_later_data.manual_destination_latitude, $scope.book_ride_later_data.manual_destination_longitude);
                    }


                    markerArr.push(marker);

                } else {
                    $scope.displaymsg = "Pick up location is not valid";

                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        closeByDocument: false,
                        scope: $scope
                    });
                }
            });
        };

        */
/*--------------------------------------------------------------------------
         * -------- funtion to get latitude and longitude of drop-off location -----
         -------------------- and place on map -----------------------------------*//*

        $scope.dropOffLocationOnMarker = function (book,flag) {

            var address = book.dropOffPlace;

            (new google.maps.Geocoder()).geocode({
                'address': address
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $scope.location2 = results[0].geometry.location;

                    $scope.book_ride_later_data.manual_destination_latitude = results[0].geometry.location.lat();
                    $scope.book_ride_later_data.manual_destination_longitude = results[0].geometry.location.lng();

                    $scope.map = {
                        zoom:  10,
                        center: new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()),
                        pan : true
                    }

                    var panPoint = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                    $scope.mapContainer.panTo(panPoint);

                    var icon = 'app/img/greenMarker.png';

                    if(markerArr1.length){
                        for(i=0; i< markerArr1.length; i++)
                            markerArr1[i].setMap(null);
                        markerArr1.pop();
                    }

                    var marker = new google.maps.Marker({
                        map: $scope.mapContainer,
                        icon: icon,
                        position: new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()),
                        draggable: true
                    });

                    google.maps.event.addListener(marker, 'drag', function() {
                        $scope.book_ride_later_data.manual_destination_latitude = marker.getPosition().lat();
                        $scope.book_ride_later_data.manual_destination_longitude = marker.getPosition().lng();
                        if ($scope.poly) {
                            poly = $scope.poly;
                            poly.setMap(null);
                        }

                    });
                    google.maps.event.addListener(marker,'dragend',function(event) {
                        $scope.reverseGeocode(marker.getPosition(),1);
                        $scope.book_ride_later_data.manual_destination_latitude = marker.getPosition().lat();
                        $scope.book_ride_later_data.manual_destination_longitude = marker.getPosition().lng();
                        $scope.drawPAth($scope.booking.latitude, $scope.booking.longitude, $scope.book_ride_later_data.manual_destination_latitude, $scope.book_ride_later_data.manual_destination_longitude);
                    });
                    markerArr1.push(marker);

                    if (($scope.booking.latitude != '' && $scope.booking.latitude != undefined) &&
                        ($scope.book_ride_later_data.manual_destination_latitude != '' && $scope.book_ride_later_data.manual_destination_latitude != undefined)) {

                        $scope.drawPAth($scope.booking.latitude, $scope.booking.longitude, $scope.book_ride_later_data.manual_destination_latitude, $scope.book_ride_later_data.manual_destination_longitude);
                    }
                } else {

                    $scope.displaymsg = "Drop-off location is not valid";

                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        closeByDocument: false,
                        scope: $scope
                    });
                }
            });
        };

        */
/*--------------------------------------------------------------------------
         * --------- funtion to draw path between pick-up location and drop-off ----
         ------------------------------- location ----------------------------------*//*

        $scope.drawPAth = function(lat1,lng1,lat2,lng2) {

            if ($scope.poly) {
                poly = $scope.poly;
                poly.setMap(null);
            }

            var lat_lng = new Array();
            var myLatlng = new google.maps.LatLng(lat1, lng1);
            lat_lng.push(myLatlng);
            var myLatlng1 = new google.maps.LatLng(lat2, lng2);
            lat_lng.push(myLatlng1);

            var path = new google.maps.MVCArray();

            //Initialize the Direction Service
            var service = new google.maps.DirectionsService();

            //Set the Path Stroke Color
            var poly = new google.maps.Polyline({ map: $scope.mapContainer, strokeColor: '#4986E7' });

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

        */
/*--------------------------------------------------------------------------
         * --------- funtion to reset form data ------------------------------------
         ---------------------------------------------------------------------------*//*


        $scope.clearData = function () {

            $interval.cancel( $scope.interval_for_particular_driver);
            $interval.cancel( $scope.cancel_interval_time_driver);

            clearInterval($scope.interval_time);
            clearInterval($scope.cancel_interval_time);

            $state.reload();

        };


        */
/*--------------------------------------------------------------------------
         * --------- funtion to check whether customer completed his previous  -----
         ------------------------------ ride or not --------------------------------*//*


        $scope.checkBookingStatus = function (book) {


            $scope.successMsg = '';
            $scope.errorMsg = '';
            $scope.booking.access_token = book.access_token;
            $scope.booking.car_type = book.car_type;
            $scope.booking.device_type = 3;

            var address = book.chosenPlace;


            if (book == undefined) {
                $scope.errorMsg = "All Fields are required.";
                $scope.TimeOutError($scope.errorMsg);
                return false;
            }
            if (book.user_name == '' || book.user_name == undefined || book.user_email == '' || book.user_email == undefined) {
                $scope.errorMsg = "Username and Email id is required.";
                $scope.TimeOutError($scope.errorMsg);
                return false;
            }

            if (book.car_type == undefined || book.car_type == '') {
                $scope.errorMsg = "Please select car type..";
                $scope.TimeOutError($scope.errorMsg);
                return false;

            }

            if ($scope.asyncSelected == undefined || $scope.asyncSelected == "") {
                $scope.errorMsg = "Enter Phone Number To Search.";
                $scope.TimeOutError($scope.errorMsg);
                return false;
            }
            if (book.user_name == '' || book.user_name == undefined || book.user_email == '' || book.user_email == undefined){
                $scope.errorMsg = "Username and Email id is required.";
                $scope.TimeOutError($scope.errorMsg);
                return false;
            }
            if (book.car_type == undefined || book.car_type == '') {
                $scope.errorMsg = "Please select car type..";
                $scope.TimeOutError($scope.errorMsg);
                return false;

            }
            else {
                $scope.successMsg = '';
                $scope.errorMsg = '';
                $scope.booking.access_token = book.access_token;
                $scope.booking.car_type = book.car_type;
                $scope.booking.device_type = 3;
                var address = book.chosenPlace;

                if ($scope.book_type == undefined) {
                    $scope.errorMsg = "Please select booking type..";
                    $scope.TimeOutError($scope.errorMsg);
                    return false;

                }
                if($scope.info.chosenPlace==''||$scope.info.chosenPlace==undefined){
                    $scope.errorMsg = "Enter Pick Up Location.";
                    $scope.TimeOutError($scope.errorMsg);
                    return false;
                }
                else if ($scope.book_type == false) {//manual booking

                    (new google.maps.Geocoder()).geocode({
                        'address': address
                    }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {

                            $scope.booking.admin_panel_request_flag = 1;

                            $.post(MY_CONSTANT.url_booking + '/find_a_driver', $scope.booking
                            ).then(
                                function (data) {
                                    data = JSON.parse(data);

                                    var dataArray = [];
                                    var driverList = data.data;
                                    var length = data.data.length;

                                    if (length) {
                                        $scope.getfare(book.car_type);

                                        $scope.manual_drivers = true;
                                        $scope.eta_flag =1;   //flag for showing ETA
                                        $scope.approx_value_show = 1;
                                        $scope.approx_price =0;
                                        $scope.eta = data.nearest_time;
                                        $scope.fare_factor = data.fare_factor;

                                        if($scope.info.chosenPlace !="" ||$scope.info.chosenPlace!=undefined){
                                            $scope.pickUpLocationOnMarker($scope.info); //getting values of lat long from function
                                        }

                                        if(!(angular.isUndefined($scope.info.dropOffPlace))){
                                            $scope.dropOffLocationOnMarker($scope.info,1); //getting values of lat long from function
                                        }


                                        driverList.forEach(function (column) {
                                            var d = {
                                                user_id: "",
                                                user_name: "",
                                                distance: "",
                                                phone_no: ""
                                            };

                                            d.user_id = column.user_id;
                                            d.user_name = column.user_name;
                                            d.distance = column.distance;
                                            d.phone_no = column.phone_no;

                                            dataArray.push(d);
                                        });

                                        $scope.$apply(function () {
                                            $scope.list = dataArray;

                                            // Define global instance we'll use to destroy later
                                            var dtInstance;

                                            $timeout(function () {
                                                if (!$.fn.dataTable)
                                                    return;
                                                dtInstance = $('#datatable2').dataTable({
                                                    'paging': true, // Table pagination
                                                    'ordering': true, // Column ordering
                                                    'info': true, // Bottom left status text
                                                    "bDestroy": true,
                                                    oLanguage: {
                                                        sSearch: 'Search all columns:',
                                                        sLengthMenu: '_MENU_ records per page',
                                                        info: 'Showing page _PAGE_ of _PAGES_',
                                                        zeroRecords: 'Nothing found - sorry',
                                                        infoEmpty: 'No records available',
                                                        infoFiltered: '(filtered from _MAX_ total records)'
                                                    }
                                                });
                                                var inputSearchClass = 'datatable_input_col_search';
                                                var columnInputs = $('tfoot .' + inputSearchClass);

                                                // On input keyup trigger filtering
                                                columnInputs
                                                    .keyup(function () {
                                                        dtInstance.fnFilter(this.value, columnInputs.index(this));
                                                        ...*/
