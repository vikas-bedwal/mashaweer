/**
 * Created by Vikas on 31/07/15.
 */
App.controller('subscriptionController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, MY_CONSTANT1, $state, $timeout) {

    'use strict';
    $scope.showCity = 1;
    $scope.showCity2 = 1;
    $scope.showCity3 = 1;
    $scope.choice = '';
    $scope.conditionArray = [];
    jQuery('#datetimepicker').datetimepicker({
        lang:'de',
        i18n:{
            de:{
                months:[
                    'Januar','Februar','März','April',
                    'Mai','Juni','Juli','August',
                    'September','Oktober','November','Dezember',
                ],
                dayOfWeek:[
                    "So.", "Mo", "Di", "Mi",
                    "Do", "Fr", "Sa.",
                ]
            }
        },
        timepicker:false,
        format:'d.m.Y',
        minDate:''//yesterday is minimum date(for today use 0 or -1970/01/01)

    });

    /*--------------------------------------------------------------------------
     * --------- Shows/Hide According Selected Choice --------------------------
     --------------------------------------------------------------------------*/
    $scope.status = function (val) {
        if(val=="WITHIN_CITY") {
            $scope.showCity = 1;
            $scope.showRadius = 0;
            $scope.showFromTo = 0;
        }
        else if(val=="WITHIN_RADIUS") {
            $scope.showRadius = 1;
            $scope.showCity = 0;
            $scope.showFromTo = 0;
        }
        else {
            $scope.showFromTo = 1;
            $scope.showRadius = 0;
            $scope.showCity = 0;
        }
    }
    $scope.status2 = function (val) {
        if(val=="WITHIN_CITY") {
            $scope.showCity2 = 1;
            $scope.showRadius2 = 0;
            $scope.showFromTo2 = 0;
        }
        else if(val=="WITHIN_RADIUS") {
            $scope.showRadius2 = 1;
            $scope.showCity2 = 0;
            $scope.showFromTo2 = 0;
        }
        else {
            $scope.showFromTo2 = 1;
            $scope.showRadius2 = 0;
            $scope.showCity2 = 0;
        }
    }
    $scope.status3 = function (val) {
        if(val=="WITHIN_CITY") {
            $scope.showCity3 = 1;
            $scope.showRadius3 = 0;
            $scope.showFromTo3 = 0;
        }
        else if(val=="WITHIN_RADIUS") {
            $scope.showRadius3 = 1;
            $scope.showCity3 = 0;
            $scope.showFromTo3 = 0;
        }
        else {
            $scope.showFromTo3 = 1;
            $scope.showRadius3 = 0;
            $scope.showCity3 = 0;
        }
    }
   /*   var markerArr = new Array();
     $scope.map = {
     zoom:  10,
     center: new google.maps.LatLng(30.00,76.00),
     pan : true
     }
     //var markerArr = new Array();
     //var markerArr1 = new Array();
    $scope.mapContainer = new google.maps.Map(document.getElementById('map-container'), $scope.map);

     $scope.placeMarker = function(lat,long) {
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
     }*/
  /*  --------------------------------------------------------------------------
     * --------- Only One Datepicker will display at a time ---------------------------------------
     --------------------------------------------------------------------------*/
     $scope.datepicker={
     dt:false,
     dt2:false
     };
     $scope.openDt1 = function($event) {
     $event.preventDefault();
     $event.stopPropagation();

     $scope.datepicker.dt2 = false;
     $scope.datepicker.dt1 = true;
     };

     $scope.openDt2 = function($event) {
     $event.preventDefault();
     $event.stopPropagation();

     $scope.datepicker.dt1 = false;
     $scope.datepicker.dt2 = true;
     };

    /*--------------------------------------------------------------------------
     * --------- Add subscribe Code Call ---------------------------------------
     --------------------------------------------------------------------------*/
    /*
     $scope.clickIt = function(add){
     console.log("clickIt");
     console.log(add);
     (new google.maps.Geocoder()).geocode({
     'address': add
     }, function (results, status) {
     if (status == google.maps.GeocoderStatus.OK) {
     $scope.lat1 = results[0].geometry.location.lat();
     $scope.lng1 = results[0].geometry.location.lng();
     $scope.placeMarker($scope.lat1,$scope.lng1);
     }
     else {
     alert("unable to identify location");
     }
     });
     }*/

    $scope.loc = {};
    $scope.text = [];
    $scope.subscribe = function (add) {
        console.log(add);
        $scope.successMsg = '';
        $scope.errorMsg = '';
        $scope.lat = '';
        $scope.lng = '';
        $scope.city = "";

        /*--------------------------------------------------------------------------
         * --------- Convert lat lng into address string ---------------------------------------
         --------------------------------------------------------------------------*/

        $.ajax({
            type: 'POST',
            url: MY_CONSTANT1.url + '?latlng=' + $scope.lat + ',' + $scope.lng + '&sensor=true',
            async: false,
            processData: false,
            contentType: false,
            success: function (response) {
                var dataArray = [];
                var custList = response.results;
                custList.forEach(function (column) {
                    var d = {};
                    d.formatted_address = column.formatted_address;
                    dataArray.push(d);
                });
                $scope.list = dataArray.reverse();
                $scope.state = $scope.list[1].formatted_address;
                $scope.city = $scope.list[2].formatted_address;
                var res = $scope.state.split(",");
                $scope.state = res[0];
                var res = $scope.city.split(",");
                $scope.city = res[0];
                $scope.loc.city = $scope.city;
                $scope.loc.state = $scope.state;
                $scope.loc.latitude = $scope.lat;
                $scope.loc.longitude = $scope.lng;
                for (var i = 0; i < $scope.conditionArray.length; i++) {
                    if (!$scope.conditionArray[i].name == "")
                        $scope.text.push($scope.conditionArray[i].name);
                }
                var str = moment.utc(add.expiry_date).format("YYYY-MM-DD");
                $.post(MY_CONSTANT.url + 'api/admin/addSubscription',
                    {
                        accessToken: $cookieStore.get('obj').accesstoken,
                        vehicleType: add.type,
                        amount: add.amount,
                        credit: add.credit,
                        duration: add.duration,
                        heading: add.details,
                        text: $scope.text,
                        location: $scope.loc,
                        ExpiryDate: str
                    },
                    function (data) {
                        $scope.text = {};
                        console.log(data)
                        $scope.list = data;
                        $scope.$apply();
                        $state.reload();
                    });

            }
        })
    };

    /*--------------------------------------------------------------------------
     * --------- Dynamically Row addition ---------------------------------------
     --------------------------------------------------------------------------*/
    // $scope.choices = [{id: 'choice1'}, {id: 'choice2'}, {id: 'choice3'}];
    $scope.addNewChoice = function () {
        $scope.conditionArray.push({name: ''});
        $scope.length = $scope.conditionArray.length;
        //var newItemNo = $scope.choices.length+1;
        //$scope.choices.push({'id':'choice'+newItemNo});
    };
    $scope.showAddChoice = function (choice) {
        return choice == $scope.length;
    };

    $scope.showChoiceLabel = function (choice) {
        return choice.id === 'choice1';
    };
    $scope.addNewChoice();

    $scope.len = 1;
    $scope.btnChange1 = 0;
    $scope.btnChange2 = 0;
    $scope.second = 0;
    $scope.third = 0;
    $scope.addNewForm = function (len) {
        console.log(len);
        $scope.len = $scope.len + 1;
        if (len == 1) {
            console.log("If");
            $scope.second = 1;
            $scope.btnChange = 1;

        }
        else if (len == 2) {
            console.log("else");
            $scope.btnChange2 = 1;
            $scope.second = 1;
            $scope.third = 1;
        }
        else
            $scope.btnChange2 = 1;

        $scope.length = $scope.conditionArray.length;
        //var newItemNo = $scope.choices.length+1;
        //$scope.choices.push({'id':'choice'+newItemNo});
    };

    $scope.deleteForm = function (formNo) {
        console.log(formNo);
        if (formNo == 3) {
            $scope.third = 0;
            $scope.len = $scope.len - 1;
            $scope.btnChange2 = 0;
        }
        else if (formNo == 2) {
            $scope.second = 0;
            $scope.btnChange = 0;

            $scope.len = $scope.len - 1;
        }
        else {
            console.log("Impossible");
        }
    }

});