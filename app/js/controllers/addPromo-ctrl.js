/**
 * Created by Vikas on 13/08/15.
 */
App.controller('addPromoController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $window,ngDialog) {

    'use strict';
    $scope.choice = '';
    $scope.min_date = new Date();
    $scope.show = 0;
    /*--------------------------------------------------------------------------
     * --------- Only One Datepicker will display at a time ---------------------------------------
     --------------------------------------------------------------------------*/
    $scope.datepicker = {
        dt: false,
        dt2: false
    };
    $scope.openDt1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepicker.dt2 = false;
        $scope.datepicker.dt1 = true;
    };

    $scope.openDt2 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepicker.dt1 = false;
        $scope.datepicker.dt2 = true;
    };

    /*--------------------------------------------------------------------------
     * --------- Add Promo Code Call ---------------------------------------
     --------------------------------------------------------------------------*/

    $scope.status = function (val) {
        $scope.show = val;
    }

    $scope.addPromo = function (add) {
        $scope.loc = {};
        $scope.successMsg = '';
        $scope.errorMsg = '';
        if ($scope.type)
            var type = "DISCOUNT";
        else {
            var type = "CREDIT";
        }
        var startDate = moment(add.startTime).format('YYYY-MM-DD');
        var endDate = moment(add.endTime).format('YYYY-MM-DD');
        var result = (moment(endDate).isAfter(startDate));
        var sDate = moment.utc(add.startTime).format("YYYY-MM-DD");
        var eDate = moment.utc(add.endTime).format("YYYY-MM-DD");
        $scope.loc.city = add.city;
        $scope.loc.state = "Haryana";
        $scope.loc.latitude = 0;
        $scope.loc.longitude = 0;

        /*--------------------------------------------------------------------------
         * ---------Validations On datePicker ---------------------------------------
         --------------------------------------------------------------------------*/
        var startTime = add.startTime;
        var endTime = add.end_date;
        var days = endTime - startTime;
        if (add.startTime == '' || add.startTime == undefined || add.startTime == null) {
            $scope.errorMsg = "Please select start date";
            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 3000);
            return false;
        }
        else if (add.endTime == '' || add.endTime == undefined || add.endTime == null) {
            $scope.errorMsg = "Please select end date";
            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 3000);
            return false;
        }
        else if (!result) {
            $scope.errorMsg = "Start date must be less than end date";
            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 3000);
            return false;
        }
        else {

            startTime = $("#start_date").val();
            endTime = $("#end_date").val();
        }

        $.ajax({
            type: "POST",
            url: MY_CONSTANT.url + 'api/admin/addPromoCode',
            data: {
                accessToken: $cookieStore.get('obj').accesstoken,
                promoId: add._id,
                promoType: type,
                promoCode: add.name,
                vehicleType: add.vehicleType,
                discount: add.discount,
                minAmount: add.minAmount,
                credits: add.credits,
                location: $scope.loc,
                startTime: startTime,
                endTime: endTime
            },
            success: function(data){
                $window.location = "#/app/promotion";
            },
            error: function(status) {
                if(status.status == 409){
                    ngDialog.open({
                        template: 'display_failure_conflict_msg',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        showClose: true
                    });
                }
            }
        });
    };
});

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