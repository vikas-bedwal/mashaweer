/**
 * Created by Vikas on 31/07/15.
 */
App.controller('paymentController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout,addHour) {
    'use strict';
    $http.get(MY_CONSTANT.url + 'api/admin/paymentList/' + $cookieStore.get('obj').accesstoken)
        .success(function (response, status) {
            if (status == 200) {
                var dataArray = [];
                Date.prototype.addHours= function(h){
                    this.setHours(this.getHours()+h);
                    return this;
                }
                var tm = '';
                var custList = response.data;
                custList.forEach(function (column) {
                    var d = {};
                    d._id = column._id;
                    d.customerName = column.customerName;
                    d.amount = column.amount;
                    d.paymentMode = column.paymentMode;
                    tm = (new Date(column.createdAt));
                    tm = addHour.addHours(tm,4);
                    d.createdAt = moment.utc(tm).format("Do MMM YYYY hh:mm A");
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
            alert(error.message);
            $state.go('page.login');
            console.log(error);
        });
});