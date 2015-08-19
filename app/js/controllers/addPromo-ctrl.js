/**
 * Created by Vikas on 13/08/15.
 */
App.controller('addPromoController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT,$window) {

    'use strict';
    $scope.choice = '';
    $scope.min_date = new Date();
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
     * --------- Add Promo Code Call ---------------------------------------
     --------------------------------------------------------------------------*/

    $scope.addPromo = function (add) {
        $scope.loc = {};
        $scope.successMsg = '';
        $scope.errorMsg = '';
        console.log(add);
        var sDate = moment.utc(add.startTime).format("YYYY-MM-DD");
        var eDate = moment.utc(add.endTime).format("YYYY-MM-DD");
        $scope.loc.city = add.city;
        $scope.loc.state = "Haryana";
        $scope.loc.latitude = 0;
        $scope.loc.longitude = 0;
        $.post(MY_CONSTANT.url + 'api/admin/addPromoCode',
            {
                accessToken: $cookieStore.get('obj').accesstoken,
                promoId:  add._id,
                promoType: "DISCOUNT",
                vehicleType: add.vehicleType,
                discount: add.discount,
                minAmount: add.minAmount,
                credits: add.credits,
                location: $scope.loc,
                startTime: sDate,
                endTime: eDate


            },
            function (data) {
                console.log(data);
                $window.location = "#/app/promotion";
            });

        /*--------------------------------------------------------------------------
         * ---------Validations On datePicker ---------------------------------------
         --------------------------------------------------------------------------*/
        var start_date = $scope.add.start_date;
        var end_date = $scope.add.end_date;
        var days = end_date - start_date;
        if($scope.add.start_date == '' || $scope.add.start_date == undefined || $scope.add.start_date == null){
            $scope.errorMsg = "Please select start date";
            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 3000);
        }
        else if($scope.add.end_date == '' || $scope.add.end_date == undefined || $scope.add.end_date == null){
            $scope.errorMsg = "Please select end date";
            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 3000);
        }
        else if (days <= 0) {
            $scope.errorMsg = "Start date must be less than end date";
            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 3000);
        }
        else {

            start_date = $("#start_date").val();
            end_date = $("#end_date").val();
            console.log(start_date);   console.log(start_date);
        }
    };
});