/**
 * Created by Vikas  on 03/08/15.
 */



App.controller('customersController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT) {

    'use strict';
    $(function () {
        $("#datatable2").dataTable({
            'aLengthMenu':[[100,50,25,10],[100,50,25,10]],
            "processing": true,
            "bServerSide": true,
            "sAjaxSource": MY_CONSTANT.url + 'api/admin/customerList/' + $cookieStore.get('obj').accesstoken
        });
    });
});


/*
App.controller('customersController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT) {
    'use strict';
    */
/* .get("http://52.6.8.249:8000/api/admin/" + id._id + "/" + accessToken.accessToken + "/getBookingSumPanel?offset=" + offset)*//*

    console.log($cookieStore.get('obj').accesstoken);
        $http.get(MY_CONSTANT.url + 'api/admin/customerList/' + $cookieStore.get('obj').accesstoken)
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
                console.log(error);
            });
});*/
