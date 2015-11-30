/**
 * Created by vikas on 20/08/15.
 */

App.controller('addOrderController', ['$scope', '$timeout', '$http', 'uiGmapLogger', 'uiGmapGoogleMapApi', '$cookies', '$cookieStore', 'MY_CONSTANT', 'ngDialog'
    , function ($scope, $timeout, $http, $log, GoogleMapApi, $cookies, $cookieStore, MY_CONSTANT,ngDialog) {
        $http.get(MY_CONSTANT.url + 'api/admin/customerList/' + $cookieStore.get('obj').accesstoken)
            .success(function (response, status) {
                if (status == 200) {
                    var dataArray = [];
                    var custList = response.data;
                    custList.forEach(function (column) {
                        var d = {};
                        d._id = column._id;
                        d.name = column.fullName;
                        d.email = column.email;
                        d.phoneNumber = column.phoneNumber;
                        d.credits = column.credits;
                        if(column.isDeleted == false)
                            d.isDeleted = 'Active';
                        else
                            d.isDeleted = 'Inactive';
                        if(column.isBlocked == false)
                            d.isBlocked = 0;
                        else
                            d.isBlocked = 1;
                        dataArray.push(d);
                    });
                    $scope.list = dataArray;

                } else {
                    alert("Something went wrong, please try again later.");
                    return false;
                }
            })
            .error(function (error) {
                console.log(error);
            });

        $scope.cust = function(data){
            $scope.job.personal_phone_no = data.phoneNumber;
            $scope.job.email = data.email;
                $('.parsleyError').removeClass("parsley-error");
                var a = $('.parsleyError').addClass("parsley-success");
                a.siblings("ul").removeClass("filled");

        }


        $scope.cash = 1;
        $scope.subscription = 0;
        $scope.card = 0;
        $scope.minYear = parseInt(new Date().getYear()) + 1900;
        $scope.maxYear = parseInt(new Date().getYear()) + 1920;
        $scope.paymentMode = function(mode){
            if(mode=="COD"){
                $scope.cash = 1;
                $scope.subscription = 0;
                $scope.card = 0;
            }
            else if(mode=="CREDITS"){
                $scope.cash = 0;
                $scope.subscription = 0;
                $scope.card = 0;
                $scope.credits = 1;
            }
            else if(mode=="card"){
                $scope.cash = 0;
                $scope.subscription = 0;
                $scope.card = 1;
            }
            else{
                $scope.cash = 0;
                $scope.subscription = 1;
                $scope.card = 0;
            }
        }


        // Below line is for datetime picker
        //jQuery('#datetimepicker').datetimepicker();
        jQuery('#datetimepicker').datetimepicker({

            timepicker: true,
            format: 'Y-m-d H:i:s'
        });

        jQuery('#datetimepicker1').datetimepicker();
        $("#p_mobile-number").intlTelInput({
            utilsScript: "vendor/utils.js"
        });
        $("#p_mobile-number").intlTelInput("selectCountry", "ae");

        $("#d_mobile-number").intlTelInput({
            utilsScript: "vendor/utils.js"
        });
        $("#d_mobile-number").intlTelInput("selectCountry", "ae");

       /* ============= Prevent Users from submitting form by hitting enter on text box suggestions============ */
        $(document).ready(function() {
            $(window).keydown(function(event){
                if(event.keyCode == 13) {
                    event.preventDefault();
                    return false;
                }
            });
        });

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
        markerArr2 = []
        markerCount = 0;
        var bound_val = 0;

        $scope.map = {
            zoom: 14,
            center: new google.maps.LatLng(30.7333148, 76.7794179),
            pan: true
        };

        $scope.mapContainer = new google.maps.Map(document.getElementById('map-container'), $scope.map);
        var infoWindow = new google.maps.InfoWindow();


        $scope.placeMarker = function (lat, long) {
           // var icon = 'app/img/mapMarker.png';
            $scope.map = {
                zoom: 10,
                center: new google.maps.LatLng(lat, long),
                pan: true
            }

            var panPoint = new google.maps.LatLng(lat, long);
            $scope.mapContainer.panTo(panPoint);

            if (markerArr.length) {
                for (var i = 0; i < markerArr.length; i++)
                    markerArr[i].setMap(null);
                markerArr.pop();
            }
            var marker = new google.maps.Marker({
                map: $scope.mapContainer,
                //icon: icon,
                position: new google.maps.LatLng(lat, long),
                draggable: true
            });
            markerArr.push(marker);

            google.maps.event.addListener(marker, 'drag', function () {
                if ($scope.poly) {
                    poly = $scope.poly;
                    poly.setMap(null);   //destroying the already created path;
                }
                $scope.reverseGeocode(marker.getPosition(), 0);


            });
            google.maps.event.addListener(marker, 'dragend', function () {
                //$scope.reverseGeocode(marker.getPosition(), 1);
                $scope.origin  = marker.getPosition();
                $scope.lat1 = marker.getPosition().lat();
                $scope.lng1 = marker.getPosition().lng();
                $scope.reverseGeocode(marker.getPosition(), 0);
                if($scope.origin != undefined && $scope.destination != undefined)
                $scope.getDistance();
                drawPath($scope.lat1, $scope.lng1, $scope.lat2, $scope.lng2);
            });

        }
        $scope.dropoffmarker = function (lat, long) {
          //  var icon = 'app/img/mapMarker.png';
            $scope.map = {
                zoom: 10,
                center: new google.maps.LatLng(lat, long),
                pan: true
            }

            var panPoint = new google.maps.LatLng(lat, long);
            $scope.mapContainer.panTo(panPoint);

            if (markerArr2.length) {
                for (var i = 0; i < markerArr2.length; i++)
                    markerArr2[i].setMap(null);
                markerArr2.pop();
            }
            var marker = new google.maps.Marker({
                map: $scope.mapContainer,
              //  icon: icon,
                position: new google.maps.LatLng(lat, long),
                draggable: true
            });
            markerArr2.push(marker);
            google.maps.event.addListener(marker, 'drag', function () {
                if ($scope.poly) {
                    poly = $scope.poly;
                    poly.setMap(null);   //destroying the already created path;
                }
                $scope.reverseGeocode(marker.getPosition(), 1);


            });
            google.maps.event.addListener(marker, 'dragend', function () {
                //$scope.reverseGeocode(marker.getPosition(), 1);
                $scope.destination = marker.getPosition();
                $scope.lat2 = marker.getPosition().lat();
                $scope.lng2 = marker.getPosition().lng();
                $scope.reverseGeocode(marker.getPosition(), 1);
                if($scope.origin != undefined && $scope.destination != undefined)
                $scope.getDistance();
                drawPath($scope.lat1, $scope.lng1, $scope.lat2, $scope.lng2);
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
                            $('#pick_up_address').val(results[0].formatted_address);
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

        //*===========================================================================================================================*
//*=============================================Validations implementation==============================================
//*===========================================================================================================================*

        $scope.job = {};
        $scope.checkStatus = function (caseNo) {
            switch (caseNo) {
                case 1:
                    if ($scope.panelDemo4 == 0 && ($scope.job.vehicle_id == undefined || $scope.job.email == undefined || $scope.job.parcel_detail == undefined || $scope.job.personal_phone_no == undefined
                        || $scope.job.vehicle_id == "" || $scope.job.email == "" || $scope.job.parcel_detail == "" || $scope.job.personal_phone_no == "")) {
                        console.log("case1 col 0")
                        $scope.boxStatus1 = 0;
                    }
                    else if ($scope.panelDemo4 == 1 && ($scope.job.vehicle_id == undefined || $scope.job.email == undefined || $scope.job.parcel_detail == undefined || $scope.job.personal_phone_no == undefined
                        || $scope.job.vehicle_id == "" || $scope.job.email == "" || $scope.job.parcel_detail == "" || $scope.job.personal_phone_no == "")) {
                        $scope.boxStatus1 = 1;
                        console.log("case1 col 1")
                    }
                    else {
                        $scope.successHit1 = 1;
                        console.log("case1")
                    }
                    break;

                case 2:
                    if ($scope.panelDemo3 == 0 && ($("#p_mobile-number").val() == undefined || $scope.job.sender_name == undefined || $("#datetimepicker").val() == undefined || $scope.job.pick_up_address == undefined || $scope.job.info == undefined
                        ||$("#p_mobile-number").val() == "" || $scope.job.sender_name == "" || $("#datetimepicker").val() == "" || $scope.job.pick_up_address == "" || $scope.job.info == "")) {
                        $scope.boxStatus2 = 0;
                        console.log("case2 col 0")
                    }
                    else if ($scope.panelDemo3 == 1 && ($("#p_mobile-number").val() == undefined || $scope.job.sender_name == undefined || $("#datetimepicker").val() == undefined || $scope.job.pick_up_address == undefined || $scope.job.info == undefined
                        || $("#p_mobile-number").val() == "" || $scope.job.sender_name == "" || $("#datetimepicker").val() == "" || $scope.job.pick_up_address == "" || $scope.job.info == "")) {
                        $scope.boxStatus2 = 1;
                        console.log("case2 col 1")
                    }
                    else {
                        $scope.successHit2 = 1;
                        console.log("case2")
                    }
                    break;

                case 3:
                    if ($scope.panelDemo2 == 0 && ($("#d_mobile-number").val() == undefined || $scope.job.d_receiver_name == undefined|| $scope.job.d_drop_off_address == undefined || $scope.job.d_info == undefined
                        || $("#d_mobile-number").val() == "" || $scope.job.d_receiver_name == "" || $scope.job.d_drop_off_address == "" || $scope.job.d_info == "")) {
                        $scope.boxStatus3 = 0;
                        console.log("case3 col 0")
                    }
                    else if ($scope.panelDemo2 == 1 && ($("#p_mobile-number").val() == undefined || $scope.job.d_receiver_name == undefined || $scope.job.d_drop_off_address == undefined || $scope.job.d_info == undefined
                        || $("#d_mobile-number").val() == "" || $scope.job.d_receiver_name == "" || $scope.job.d_drop_off_address == "" || $scope.job.d_info == "")) {
                        $scope.boxStatus3 = 1;
                        console.log("case3 col 1")
                    }
                    else {
                        $scope.successHit3 = 1;
                        console.log("case3")
                    }
                    break;
                case 4:
                    if (!$scope.cash) {
                        if (!$scope.card) {
                            if ($scope.panelDemo1 == 0 && ($scope.job.subscription_id == undefined || $scope.job.subscription_id == "")) {
                                $scope.boxStatus4 = 0;
                                console.log("case4 col 0")
                            }
                            else if ($scope.panelDemo1 == 1 && ($scope.job.subscription_id == undefined  || $scope.job.subscription_id == "" )) {
                                $scope.boxStatus4 = 1;
                                console.log("case4 col 1")
                            }
                            else {
                                $scope.successHit4 = 1;
                                console.log("case4")
                            }
                        }

                        else {
                            console.log("card selected")
                            if ($scope.panelDemo1 == 0 && ($scope.job.card_no == undefined || $scope.job.card_type == undefined || $scope.job.cvv == undefined
                                || $scope.job.expiryMonth == undefined || $scope.job.expiryYear == undefined
                                || $scope.job.card_no == "" || $scope.job.card_type == "" || $scope.job.cvv == "" || $scope.job.expiryMonth == "" || $scope.job.expiryYear == ""))  {
                                $scope.boxStatus4 = 0;
                                console.log("case4 col 0")
                            }
                            else if ($scope.panelDemo1 == 1 && ($scope.job.card_no == undefined || $scope.job.card_type == undefined || $scope.job.cvv == undefined
                                || $scope.job.expiryMonth == undefined || $scope.job.expiryYear == undefined
                                || $scope.job.card_no == "" || $scope.job.card_type == "" || $scope.job.cvv == "" || $scope.job.expiryMonth == "" || $scope.job.expiryYear == "")) {
                                $scope.boxStatus4 = 1;
                                console.log("case4 col 1")
                            }
                            else {
                                $scope.successHit4 = 1;
                                console.log("case4")
                            }
                        }
                    }
                    else {
                        $scope.successHit4 = 1;
                        console.log("case4")
                    }
                    break;
                default :  console.log("Default");
            }
        }

        $scope.boxStatus1 = 1;
        $scope.boxStatus2 = 1;
        $scope.boxStatus3 = 1;
        $scope.boxStatus4 = 1;
        $scope.successHit1 = 0;
        $scope.successHit2 = 0;
        $scope.successHit3 = 0;
        $scope.successHit4 = 0;
        $scope.pick_up = {};
        $scope.drop_off = {};

        $scope.addOrder = function (data, status) {
            var country_code = $("#p_mobile-number").intlTelInput("getSelectedCountryData").dialCode;
            var p_phone_no = $("#p_mobile-number").val();
            var d_phone_no = $("#d_mobile-number").val();

     /*       console.log("Place It");
            console.log(data);
            console.log($scope.successHit4);
            console.log($scope.successHit3);
            console.log($scope.successHit2);
            console.log($scope.successHit1);
            console.log($scope.panelDemo4);
            console.log($scope.panelDemo3);
            console.log($scope.panelDemo2);
            console.log($scope.panelDemo1);
            console.log(!$scope.panelDemo1);*/
            console.log(data.pick_up_before+" +0000");
            if ($scope.panelDemo4==1 && $scope.panelDemo3==1 && $scope.panelDemo2==1 && $scope.panelDemo1==1) {
                $scope.pick_up.latitude = $scope.lat1;
                $scope.pick_up.longitude = $scope.lng1;
                //$scope.pick_up.pickupTime = data.pick_up_before+" +0000";
                var DATE = new Date($("#datetimepicker").val());
                console.log(DATE)
                console.log($("#datetimepicker").val())
                $scope.pick_up.pickupTime = moment.utc(DATE).format("YYYY-MM-DD HH:mm")+" +0000";
                console.log($scope.pick_up.pickupTime)
                $scope.pick_up.companyName = "Mashaweer";
                $scope.pick_up.senderName = data.sender_name;
                $scope.pick_up.phoneNumber = p_phone_no;
                $scope.pick_up.city = "Dubai";
                $scope.pick_up.fullAddress = data.pick_up_address;
                $scope.pick_up.information = "";
                $scope.pick_up.otherDetails = "";
                $scope.drop_off.latitude = $scope.lat2;
                $scope.drop_off.longitude = $scope.lng2;
                //$scope.drop_off.pickupTime = data.d_drop_off_before;
                $scope.drop_off.companyName = "Mashaweer";
                $scope.drop_off.receiverName = data.d_receiver_name;
                $scope.drop_off.phoneNumber = d_phone_no;
                $scope.drop_off.city = "Dubai";
                $scope.drop_off.fullAddress = data.d_drop_off_address;
                $scope.drop_off.information = "";
                $scope.drop_off.otherDetails = "";
                var subscriptionId = "";
                var subscriptionType = "";
                var promoCode = "";
                var cardAlias = "";
                console.log(distance);
                $.post(MY_CONSTANT.url + 'api/admin/createOrder',
                    {
                        accessToken: $cookieStore.get('obj').accesstoken,
                        email: data.email,
                        vehicleId: data.vehicle_id,
                        amount: actualAmount,
                        estimateFare: estimatedValue,
                        parcelDetails: data.parcel_detail,
                        distance: distance,
                        pickupLocation: $scope.pick_up,
                        deliveryLocation: $scope.drop_off,
                        note: "",
                        paymentMode: data.payment_mode,
                        subscriptionId: subscriptionId,
                        subscriptionType: subscriptionType,
                        collectPaymentAt: data.payment_at,
                        promoCode: promoCode,
                        cardAlias: cardAlias
                    })
                    .success(function (data,status)  {
                        if (status != 'success' || status != 201) {
                            $scope.hitResponse = data.message;
                            ngDialog.open({
                                template: 'display_msg',
                                className: 'ngdialog-theme-default',
                                scope: $scope,
                                showClose: true
                            });
                            /*$scope.authMsg = data.message;
                            setTimeout(function () {
                                $scope.authMsg = "";
                                $scope.$apply();
                            }, 3000);
                            $scope.$apply();*/
                        } else {
                            console.log("else");
                            $scope.displaymsg = "Order Placed Successfully";
                            ngDialog.open({
                                template: 'display_msg',
                                className: 'ngdialog-theme-default',
                                scope: $scope,
                                showClose: true
                            });
                        }
                    })
                    .error(function(data, status){
                        $scope.hitResponse = JSON.parse(data.responseText).message;
                        ngDialog.open({
                            template: 'display_msg',
                            className: 'ngdialog-theme-default',
                            scope: $scope,
                            showClose: true
                        });
                    })
            }
            else {
                $scope.errorMsg = "Please fill all fields";
                setTimeout(function () {
                    $scope.errorMsg = "";
                    $scope.$apply();
                }, 3000);
            }
        }


        $scope.setMarker = function (add, flag) {
            (new google.maps.Geocoder()).geocode({
                'address': add
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (flag == 1) {
                        $scope.origin = results[0].geometry.location;
                        $scope.lat1 = results[0].geometry.location.lat();
                        $scope.lng1 = results[0].geometry.location.lng();
                        $scope.placeMarker($scope.lat1, $scope.lng1);
                        if($scope.origin != undefined && $scope.destination != undefined)
                        $scope.getDistance();
                        //drawPath( $scope.lat1,$scope.lng1,30.7333148,76.7794179);
                    }
                    else {
                        $scope.destination = results[0].geometry.location;
                        $scope.lat2 = results[0].geometry.location.lat();
                        $scope.lng2 = results[0].geometry.location.lng();
                        $scope.dropoffmarker($scope.lat2, $scope.lng2);
                        if($scope.origin != undefined && $scope.destination != undefined)
                        $scope.getDistance();
                        // drawPath( $scope.lat2,$scope.lng2,30.7333148,76.7794179);
                    }
                    drawPath($scope.lat1, $scope.lng1, $scope.lat2, $scope.lng2);
                }
            });
        }

//*===========================================================================================================================*
//*=============================================GET DISTANCE==============================================
//*===========================================================================================================================*

        var distance = 0;
        $scope.getDistance = function () {
                // show route between the points
                directionsService = new google.maps.DirectionsService();
                directionsDisplay = new google.maps.DirectionsRenderer(
                    {
                        suppressMarkers: true,
                        suppressInfoWindows: true
                    });
                // directionsDisplay.setMap(map);
                var request = {
                    origin: $scope.origin,
                    destination: $scope.destination,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                };
                directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        var string;

                        directionsDisplay.setDirections(response);

                        var driving_time = parseFloat(response.routes[0].legs[0].duration.value / 60);
                        distance = parseFloat(response.routes[0].legs[0].distance.value / 1000);
                        console.log(distance)
                        getEstimatedFare();
                    }
                    $scope.$apply();
                });
        }


        //*===========================================================================================================================*
//*=============================================GET ESTIMATED FARE==============================================
//*===========================================================================================================================*

        var actualAmount = 0;
        var estimatedValue = 0;
        var getEstimatedFare = function () {
            console.log("In fare")
            console.log($scope.job.email)
            console.log($scope.job.vehicle_id)
            if($scope.job.vehicle_id == "55b083a6da0588448a6ee410")
                $scope.vehicle = "BIKE";
            if($scope.job.vehicle_id == "55b083acda0588448a6ee411")
                $scope.vehicle = "CAR";
            if($scope.job.vehicle_id == "55a39fe921b83d9dde82b08a")
                $scope.vehicle = "TRUCK";
            $http({
                url: MY_CONSTANT.url + 'api/admin/calculateFare',
                method: "POST",
                data: { accessToken : $cookieStore.get('obj').accesstoken,
                        customerEmail: $scope.job.email,
                        distanceInKM: distance.toString(),
                        vehicleType: $scope.vehicle
                }
            })
                .then(function(data) {
                    actualAmount = data.data.data.actualAmount;
                    console.log(actualAmount);
                    estimatedValue = data.data.data.estimatedValue;
                },
                function(data) { // optional
                    // failed
                    $scope.hitResponse = data.message;
                    ngDialog.open({
                        template: 'display_msg',
                        scope: '$scope',
                        className: 'ngdialog-theme-default'
                    })
                });
        }
        /*--------------------------------------------------------------------------
         * --------- funtion to draw path between pick-up location and drop-off ----
         ------------------------------- location ----------------------------------*/

        var drawPath = function (lat1, lng1, lat2, lng2) {
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


        /*--------------------------------------------------------------------------
         * --------- funtion to filter whatever you input customer name ----
         ------------------------------- location ----------------------------------*/
        App.filter('propsFilter', function() {
            return function(items, props) {
                var out = [];
                if (angular.isArray(items)) {
                    items.forEach(function(item) {
                        var itemMatches = false;

                        var keys = Object.keys(props);
                        for (var i = 0; i < keys.length; i++) {
                            var prop = keys[i];
                            var text = props[prop].toLowerCase();
                            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                itemMatches = true;
                                break;
                            }
                        }

                        if (itemMatches) {
                            out.push(item);
                        }
                    });
                } else {
                    out = items;
                }
                return out;
            };
        });
    }]);


