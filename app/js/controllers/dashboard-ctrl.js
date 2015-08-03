
/**
 * Created by Vikas on 03/08/15.
 */

App.controller('dashboardController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout,ngDialog) {

    'use strict';

    $scope.addCreditDialog = function () {
        ngDialog.open({
            template: 'addCredit',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument: false,
            closeByEscape: false
        });
    }

    $scope.addCredit = function (data) {
        console.log("Credit called");
        console.log(data);
    }

    /* .get("http://52.6.8.249:8000/api/admin/" + id._id + "/" + accessToken.accessToken + "/getBookingSumPanel?offset=" + offset)*/
    $scope.init = function () {
    $http.get(MY_CONSTANT.url + 'api/admin/statsInfo/' + $cookieStore.get('obj').accesstoken)
        .success(function (response, status) {
            console.log(response)
            console.log(status)
            if (status == 200) {
                $scope.totalCompletedOrder = response.data.totalCompletedOrder;
                $scope.totalNewCustomer = response.data.totalNewCustomer;
                $scope.totalOnlineDriver = response.data.totalOnlineDriver;
                $scope.totalOrder = response.data.totalOrder;
                $scope.totalRevenue = response.data.totalRevenue;
                $scope.totalUnAssignedOrder = response.data.totalUnAssignedOrder;

            } else {
                alert("Something went wrong, please try again later.");
                return false;
            }
        })
        .error(function (error) {
            console.log(error);
        });
}
/*
console.log("Check");
    $http.get(MY_CONSTANT.url + 'api/admin/statsInfo/'+$cookieStore.get('obj').accesstoken).
        then(function(response) {
            $scope.totalCompletedOrder = response.data.totalCompletedOrder;
            $scope.totalNewCustomer = response.data.totalNewCustomer;
            $scope.totalOnlineDriver = response.data.totalOnlineDriver;
            $scope.totalOrder = response.data.totalOrder;
            $scope.totalRevenue = response.data.totalRevenue;
            $scope.totalUnAssignedOrder = response.data.totalUnAssignedOrder;

            // this callback will be called asynchronously
            // when the response is available
        }, function(response) {
            alert("Something went wrong, please try again later.");
            return false;
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
*/




});
