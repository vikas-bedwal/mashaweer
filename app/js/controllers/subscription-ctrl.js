/**
 * Created by vikas on 26/08/15.
 */
App.controller('subscriptionController', function ($scope, $http, $cookies, $cookieStore, $stateParams,
                                                   MY_CONSTANT, $timeout, $window, $state, ngDialog) {
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
                        d.validUpto = column.validUpto,
                        d.subscriptionType = column.conditionsApply,
                        d.totalCredits = column.totalCredits,

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

    /*-----------Add Credit Section dialog---------------------*/
    $scope.subscriptionInfoDialog = function (data) {
        $scope.fromTo = 1;
        $scope.city = 1;
        $scope.radius = 1;
        var dataArray1 = [];
        data.forEach(function (column) {
            var d = {};
            d._id = column._id;
            d.credits = column.credits;
            d.subscriptionType = column.subscriptionType,
                d.vehicleType = column.vehicleType
            if(column.city==undefined && column.radius==undefined)
                d.des = column.fromCity + ' To ' + column.toCity;
            else if(column.city==undefined && column.toCity==undefined)
                d.des = 'Radius = '+column.radius;
            else
                d.des = 'City --> '+column.city;

                /*d.fromCity = column.fromCity;
                d.toCity = column.toCity,
                d.fromTo = column.fromCity + ' To ' + column.toCity,
                d.city = column.city,
                d.radius = column.radius*/
                dataArray1.push(d);
        });
        $scope.list1 = dataArray1;
        ngDialog.open({
            template: 'subInfo',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument: false,
            closeByEscape: false
        });
    }

});
