/**
 * Created by vikas on 26/08/15.
 */
App.controller('subscriptionController', function ($scope, $http, $cookies, $cookieStore, $stateParams,
                                                 MY_CONSTANT, $timeout, $window, $state) {
    'use strict';
    $scope.account = {};
    $scope.authMsg = '';

    $http.get(MY_CONSTANT.url + 'api/admin/getSubscriptionInfo/' + $cookieStore.get('obj').accesstoken)
        .success(function (response, status) {
            console.log(response);
            if (status == 200) {
                var dataArray = [];
                var suscriptionList = response.data;
                suscriptionList.forEach(function (column) {
                    var d = {};
                    d._id = column._id;
                    d.heading = column.heading;
                    d.amount = column.amount;
                    d.validity = column.validity,
                    d.totalCredits = column.totalCredits,

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

});
