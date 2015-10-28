
/**
 * Created by Vikas on 03/08/15.
 */

App.controller('dashboardController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT,$rootScope,ngDialog,$log) {
    'use strict';
    $rootScope.test = $cookieStore.get('obj1').adminType;
    $http.get(MY_CONSTANT.url + 'api/admin/statsInfo/' + $cookieStore.get('obj').accesstoken)
        .success(function (response, status) {
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
            alert(error.message)
            console.log(error);
        });
});