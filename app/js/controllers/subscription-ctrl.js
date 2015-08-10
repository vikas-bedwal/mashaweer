/**
 * Created by Vikas on 31/07/15.
 */
App.controller('subscriptionController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT,MY_CONSTANT1, $timeout) {

    'use strict';
    $scope.choice = '';
    $scope.conditionArray = [];


    var markerArr = new Array();
    $scope.map = {
        zoom:  10,
        center: new google.maps.LatLng(30.00,76.00),
        pan : true
    }
    //var markerArr = new Array();
    //var markerArr1 = new Array();
    $scope.mapContainer = new google.maps.Map(document.getElementById('map-container'), $scope.map);

    $scope.placeMarker = function(lat,long) {
        var icon = 'app/img/mashaweer-logo.png';
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
    /*--------------------------------------------------------------------------
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
    $scope.subscribe = function (add) {
        console.log($scope.conditionArray);
        $scope.successMsg = '';
        $scope.errorMsg = '';
        $scope.lat = '';
        $scope.lng = '';
        console.log("In subscribe");
        console.log(add);



        (new google.maps.Geocoder()).geocode({
            'address': add.city
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $scope.lat = results[0].geometry.location.lat();
                $scope.lng = results[0].geometry.location.lng();
                $scope.placeMarker(results[0].geometry.location.lat(),results[0].geometry.location.lng());

                /*--------------------------------------------------------------------------
                 * --------- Convert lat lng into address string ---------------------------------------
                 --------------------------------------------------------------------------*/
                $http.get(MY_CONSTANT1.url+'?latlng='+$scope.lat+','+$scope.lng+'&sensor=true')
                    .success(function (response, status) {
                        if (status == 200) {
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
                        } else {
                            alert("Something went wrong, please try again later.");
                            return false;
                        }
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            }
            else {
                alert("unable to identify location");
            }
        })
return false;
        $.post(MY_CONSTANT.url + 'api/admin/addSubscription',
            {
                accessToken: $cookieStore.get('obj').accesstoken,
                vehicleType: add.type,
                amount: add.amount,
                credit: add.credit,
                duration: add.duration,
                heading: add.details,
                text: add.flag,
                location: add.flag,
                ExpiryDate: add.flag
            },
            function (data) {
                console.log(data)
                $scope.list = data;
                $scope.$apply();
                $state.reload();
            });

    };

    /*--------------------------------------------------------------------------
     * --------- Dynamically Row addition ---------------------------------------
     --------------------------------------------------------------------------*/
   // $scope.choices = [{id: 'choice1'}, {id: 'choice2'}, {id: 'choice3'}];
    $scope.addNewChoice = function() {
        $scope.conditionArray.push({ name: ''});
        //var newItemNo = $scope.choices.length+1;
        //$scope.choices.push({'id':'choice'+newItemNo});
    };
    $scope.showAddChoice = function(choice) {
        return choice.id === $scope.choices[$scope.choices.length-1].id;
    };

    $scope.showChoiceLabel = function(choice) {
        return choice.id === 'choice1';
    };

    $scope.addNewChoice();

});