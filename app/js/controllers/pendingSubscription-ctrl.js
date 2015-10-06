/**
 * Created by vikas on 30/09/15.
 */
App.controller('pendingSubscriptionController', function ($scope, $http, $cookies, $cookieStore, $stateParams,
                                                   MY_CONSTANT, $timeout, $window, $state, ngDialog, convertdatetime) {
    'use strict';

    $http.get(MY_CONSTANT.url + 'api/admin/pendingSubscriptions/' + $cookieStore.get('obj').accesstoken)
        .success(function (response, status) {
            if (status == 200) {
                var dataArray = [];
                var suscriptionList = response.data.pendingSubscriptions;
                suscriptionList.forEach(function (column) {
                    var d = {};
                    d.subscriptionId = column._id;
                    d.heading = column.heading;
                    d.paymentMode = column.paymentMode;
                        dataArray.push(d);
                });
                $scope.list = dataArray;
                var dtInstance;
                $timeout(function () {
                    console.log("datatables");

                    if (!$.fn.dataTable) return;
                    dtInstance = $('#datatable2').dataTable({
                        'paging': true,  // Table pagination
                        'ordering': true,  // Column ordering
                        'info': true,  // Bottom left status text
                        oLanguage: {
                            sSearch: 'Search all columns:',
                            sLengthMenu: '_MENU_ records per page',
                            info: 'Showing page _PAGE_ of _PAGES_',
                            zeroRecords: 'Nothing found - sorry',
                            infoEmpty: 'No records available',
                            infoFiltered: '(filtered from _MAX_ total records)'
                        },
                        "pageLength": 50
                    });
                    var inputSearchClass = 'datatable_input_col_search';
                    var columnInputs = $('tfoot .' + inputSearchClass);

                    // On input keyup trigger filtering
                    columnInputs
                        .keyup(function () {
                            dtInstance.fnFilter(this.value, columnInputs.index(this));
                        });
                });
                $scope.$on('$destroy', function () {
                    dtInstance.fnDestroy();
                    $('[class*=ColVis]').remove();
                })
            } else {
                alert("Something went wrong, please try again later.");
                return false;
            }
        })
        .error(function (error) {
            console.log(error);
        });

    /*===========Approve/Reject Packeage Request ============ */

    $scope.action = function (id,flag) {
        if(flag)
        var flag = "true";
        else
            var flag = "false";
        $http({
            method: 'PUT',
            url: MY_CONSTANT.url + 'api/admin/approveRejectSubscriptions',
            data: { accessToken: $cookieStore.get('obj').accesstoken,
                subscriptionId: id,
                toggleFlag: flag}
        }).then(function successCallback(response) {
            console.log(response);
            $state.reload();
        }, function errorCallback(response) {
            console.log(response);
        });
    };
});