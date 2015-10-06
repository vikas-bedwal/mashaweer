/**
 * Created by vikas on 20/08/15.
 */

App.controller('MapCircleController1', ['$scope', '$timeout', '$http', 'uiGmapLogger', 'uiGmapGoogleMapApi', '$cookies', '$cookieStore', 'MY_CONSTANT'
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
        }


        $scope.cash = 1;
        $scope.subscription = 0;
        $scope.card = 0;
        $scope.minYear = parseInt(new Date().getYear()) + 1900;
        $scope.maxYear = parseInt(new Date().getYear()) + 1920;
        $scope.paymentMode = function(mode){
            if(mode=="cash"){
                $scope.cash = 1;
                $scope.subscription = 0;
                $scope.card = 0;
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
        jQuery('#datetimepicker').datetimepicker();
        jQuery('#datetimepicker1').datetimepicker();
        $("#p_mobile-number").intlTelInput({
            utilsScript: "vendor/utils.js"
        });
        $("#p_mobile-number").intlTelInput("selectCountry", "ae");

        $("#d_mobile-number").intlTelInput({
            utilsScript: "vendor/utils.js"
        });
        $("#d_mobile-number").intlTelInput("selectCountry", "ae");

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
            var icon = 'app/img/mapMarker.png';
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
                icon: icon,
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
                $scope.lat1 = marker.getPosition().lat();
                $scope.lng1 = marker.getPosition().lng();
                $scope.reverseGeocode(marker.getPosition(), 0);
                drawPath($scope.lat1, $scope.lng1, $scope.lat2, $scope.lng2);
            });

        }
        $scope.dropoffmarker = function (lat, long) {
            var icon = 'app/img/mapMarker.png';
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
                icon: icon,
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
                $scope.lat2 = marker.getPosition().lat();
                $scope.lng2 = marker.getPosition().lng();
                $scope.reverseGeocode(marker.getPosition(), 1);
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
        $scope.job = {};
        $scope.checkStatus = function (caseNo) {
            switch (caseNo) {
                case 1:
                    if ($scope.panelDemo4 == 0 && ($scope.job.vehival_id == undefined || $scope.job.email == undefined || $scope.job.parcel_detail == undefined || $scope.job.personal_phone_no == undefined
                        || $scope.job.vehival_id == "" || $scope.job.email == "" || $scope.job.parcel_detail == "" || $scope.job.personal_phone_no == "")) {
                        $scope.boxStatus1 = 0;
                    }
                    else if ($scope.panelDemo4 == 1 && ($scope.job.vehival_id == undefined || $scope.job.email == undefined || $scope.job.parcel_detail == undefined || $scope.job.personal_phone_no == undefined
                        || $scope.job.vehival_id == "" || $scope.job.email == "" || $scope.job.parcel_detail == "" || $scope.job.personal_phone_no == "")) {
                        $scope.boxStatus1 = 1;
                    }
                    else {
                        $scope.successHit1 = 1;
                    }
                    break;

                case 2:
                    if ($scope.panelDemo3 == 0 && ($scope.job.phone_no == undefined || $scope.job.sender_name == undefined || $scope.job.company_name == undefined || $scope.job.pick_up_before == undefined || $scope.job.pick_up_address == undefined || $scope.job.info == undefined
                        || $scope.job.phone_no == "" || $scope.job.sender_name == "" || $scope.job.company_name == "" || $scope.job.pick_up_before == "" || $scope.job.pick_up_address == "" || $scope.job.info == "")) {
                        $scope.boxStatus2 = 0;
                    }
                    else if ($scope.panelDemo3 == 1 && ($scope.job.phone_no == undefined || $scope.job.sender_name == undefined || $scope.job.company_name == undefined || $scope.job.pick_up_before == undefined || $scope.job.pick_up_address == undefined || $scope.job.info == undefined
                        || $scope.job.phone_no == "" || $scope.job.sender_name == "" || $scope.job.company_name == "" || $scope.job.pick_up_before == "" || $scope.job.pick_up_address == "" || $scope.job.info == "")) {
                        $scope.boxStatus2 = 1;
                    }
                    else {
                        $scope.successHit2 = 1;
                    }
                    break;

                case 3:
                    if ($scope.panelDemo2 == 0 && ($scope.job.d_phone_no == undefined || $scope.job.d_sender_name == undefined || $scope.job.d_company_name == undefined || $scope.job.d_drop_off_before == undefined || $scope.job.d_drop_off_address == undefined || $scope.job.d_info == undefined
                        || $scope.job.d_phone_no == "" || $scope.job.d_sender_name == "" || $scope.job.d_company_name == "" || $scope.job.d_drop_off_before == "" || $scope.job.d_drop_off_address == "" || $scope.job.d_info == "")) {
                        $scope.boxStatus3 = 0;
                    }
                    else if ($scope.panelDemo2 == 1 && ($scope.job.d_phone_no == undefined || $scope.job.d_sender_name == undefined || $scope.job.d_company_name == undefined || $scope.job.d_drop_off_before == undefined || $scope.job.d_drop_off_address == undefined || $scope.job.d_info == undefined
                        || $scope.job.d_phone_no == "" || $scope.job.d_sender_name == "" || $scope.job.d_company_name == "" || $scope.job.d_drop_off_before == "" || $scope.job.d_drop_off_address == "" || $scope.job.d_info == "")) {
                        $scope.boxStatus3 = 1;
                    }
                    else {
                        $scope.successHit3 = 1;
                    }
                    break;
                case 4:
                    if ($scope.panelDemo1 == 0 && ($scope.job.subscription_id == undefined || $scope.job.amount == undefined || $scope.job.payment_mode == undefined || $scope.job.payment_at == undefined || $scope.job.promo_code == undefined
                        || $scope.job.subscription_id == "" || $scope.job.amount == "" || $scope.job.payment_mode == "" || $scope.job.payment_at == "" || $scope.job.promo_code == "")) {
                        $scope.boxStatus4 = 0;
                    }
                    else if ($scope.panelDemo1 == 1 && ($scope.job.subscription_id == undefined || $scope.job.amount == undefined || $scope.job.payment_mode == undefined || $scope.job.payment_at == undefined || $scope.job.promo_code == undefined
                        || $scope.job.subscription_id == "" || $scope.job.amount == "" || $scope.job.payment_mode == "" || $scope.job.payment_at == "" || $scope.job.promo_code == "")) {
                        $scope.boxStatus4 = 1;
                    }
                    else {
                        $scope.successHit4 = 1;
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
            console.log(data);

            var country_code = $("#p_mobile-number").intlTelInput("getSelectedCountryData").dialCode;
            var country_code1 = $("#d_mobile-number").val();
            console.log(country_code);
            console.log(country_code1);

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
            if ($scope.panelDemo4==1 && $scope.panelDemo3==1 && $scope.panelDemo2==1 && $scope.panelDemo1==1) {
                $scope.pick_up.latitude = $scope.lat1;
                $scope.pick_up.longitude = $scope.lng1;
                $scope.pick_up.pickupTime = data.pick_up_before;
                $scope.pick_up.companyName = data.company_name;
                $scope.pick_up.senderName = data.sender_name;
                $scope.pick_up.phoneNumber = data.phone_no;
                $scope.pick_up.fullAddress = data.pick_up_address;
                $scope.pick_up.information = data.info;
                $scope.pick_up.otherDetails = data.other_details;

                $scope.drop_off.latitude = $scope.lat2;
                $scope.drop_off.longitude = $scope.lng2;
                $scope.drop_off.pickupTime = data.d_drop_off_before;
                $scope.drop_off.companyName = data.d_company_name;
                $scope.drop_off.senderName = data.d_sender_name;
                $scope.drop_off.phoneNumber = data.d_phone_no;
                $scope.drop_off.fullAddress = data.d_drop_off_address;
                $scope.drop_off.information = data.d_info;
                $scope.drop_off.otherDetails = data.d_other_details;

                $.post(MY_CONSTANT.url + 'api/admin/createOrder',
                    {
                        accessToken: $cookieStore.get('obj').accesstoken,
                        email: data.email,
                        vehicleId: data.vehival_id,
                        amount: data.amount,
                        parcelDetails: data.parcel_detail,
                        pickupLocation: $scope.pick_up,
                        deliveryLocation: $scope.drop_off,
                        note: data.note,
                        paymentMode: data.payment_mode,
                        subscribedSubscriptionId: data.subscription_id,
                        collectPaymentAt: data.payment_at,
                        promoCode: data.promo_code
                    })
                    .success(function (data,status)  {
                        if (status != 'success') {
                            $scope.authMsg = data.message;
                            setTimeout(function () {
                                $scope.authMsg = "";
                                $scope.$apply();
                            }, 3000);
                            $scope.$apply();
                        } else {
                            $scope.displaymsg = "Dispatcher Added Successfully";
                            ngDialog.open({
                                template: 'display_msg',
                                className: 'ngdialog-theme-default',
                                scope: $scope,
                                showClose: true
                            });
                        }
                    })
                    .error(function(data, status){
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
                        $scope.lat1 = results[0].geometry.location.lat();
                        $scope.lng1 = results[0].geometry.location.lng();
                        $scope.placeMarker($scope.lat1, $scope.lng1);
                        //drawPath( $scope.lat1,$scope.lng1,30.7333148,76.7794179);
                    }
                    else {
                        $scope.lat2 = results[0].geometry.location.lat();
                        $scope.lng2 = results[0].geometry.location.lng();
                        $scope.dropoffmarker($scope.lat2, $scope.lng2);
                        // drawPath( $scope.lat2,$scope.lng2,30.7333148,76.7794179);
                    }

                    drawPath($scope.lat1, $scope.lng1, $scope.lat2, $scope.lng2);
                }
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

        /**
         * AngularJS default filter with the following expression:
         * "person in people | filter: {name: $select.search, age: $select.search}"
         * performs a AND between 'name: $select.search' and 'age: $select.search'.
         * We want to perform a OR.
         */
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
                    // Let the output be the input untouched
                    out = items;
                }
                return out;
            };
        });
    }]);

App.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your input.
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
});