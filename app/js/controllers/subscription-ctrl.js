/**
 * Created by Vikas on 31/07/15.
 */
App.controller('subscriptionController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout) {

    'use strict';
    console.log("In subscription");
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
});