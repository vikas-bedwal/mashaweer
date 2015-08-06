/**
 * Created by Vikas on 31/07/15.
 */
App.controller('paymentController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout) {
    'use strict';
    console.log("In payment");
    $http.get(MY_CONSTANT.url + 'api/admin/paymentList/' + $cookieStore.get('obj').accesstoken)
        .success(function (response, status) {
            if (status == 200) {
                console.log(response);
                var dataArray = [];
                var custList = response.data;
                custList.forEach(function (column) {
                    var d = {};
                    d._id = column._id;
                    d.fullName = column.fullName;
                    d.amount = column.amount;
                    d.paymentMode = column.paymentMode;
                    var str = moment.utc(column.createdAt).format("Do MMM YYYY hh:mm A");
                    d.createdAt = str;
                    dataArray.push(d);
                });
                $scope.list = dataArray;
                var dtInstance;
                $timeout(function () {
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
});