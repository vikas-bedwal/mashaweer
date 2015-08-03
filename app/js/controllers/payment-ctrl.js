/**
 * Created by Vikas on 31/07/15.
 */
App.controller('paymentController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout) {

    'use strict';
    console.log("In payment");
       $(function () {
     $("#datatable2").dataTable({
     'aLengthMenu':[[100,50,25,10],[100,50,25,10]],
     "processing": true,
     "bServerSide": true,
     "sAjaxSource": MY_CONSTANT.url + 'api/admin/paymentList/' + $cookieStore.get('obj').accesstoken
     });
     });
});