/**
 * Created by Vikas on 31/07/15.
 */
App.controller('ordersController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout) {

    'use strict';
    console.log("In order");
       $(function () {
     $("#datatable2").dataTable({
     'aLengthMenu':[[100,50,25,10],[100,50,25,10]],
     "processing": true,
     "bServerSide": true,
     "sAjaxSource": MY_CONSTANT.url + 'api/admin/orderList/' + $cookieStore.get('obj').accesstoken
     });
     });
});