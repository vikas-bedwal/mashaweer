/**
 * Created by Vikas  on 03/08/15.
 */


App.controller('customersController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT,$timeout, $state, ngDialog) {
    'use strict';
    $scope.init = function () {
    console.log($cookieStore.get('obj').accesstoken);
        $http.get(MY_CONSTANT.url + 'api/admin/customerList/' + $cookieStore.get('obj').accesstoken)
            .success(function (response, status) {
                if (status == 200) {
                    console.log(response);
                    var dataArray = [];
                    var excelArray = [];
                    var custList = response.data;
                    custList.forEach(function (column) {
                        var d = {};
                        d._id = column._id;
                        d.fullName = column.fullName;
                        d.email = column.email;
                        d.phoneNumber = column.phoneNumber
                        d.credits = column.credits;
                        if(column.isDeleted == false)
                            d.isDeleted = 'Active';
                        else
                            d.isDeleted = 'Inactive';
                        if(column.isBlocked == false)
                            d.isBlocked = 0;
                        else
                            d.isBlocked = 1;
                        dataArray.push(d);
                        excelArray.push(d);
                    });
                    $scope.list = dataArray;
                    $scope.excelList = dataArray;
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


          // -----------Customer BLock Section Starts---------------------
    $scope.blockCust = function (email) {
        console.log("Check");
        $.post(MY_CONSTANT.url + 'api/admin/toggleCustomerBlock',
            {
                accessToken: $cookieStore.get('obj').accesstoken, email: email
            },
            function (data) {
                console.log(data)
                $scope.list = data;
                $scope.$apply();
                $state.reload();
            });
    };
    }
    $scope.addCreditDialog = function () {
        ngDialog.open({
            template: 'addCredit',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument: false,
            closeByEscape: false
        });
    }

    /*-----------Customer BLock Section Starts---------------------*/

    $scope.addCredit = function (data) {
        $.post(MY_CONSTANT.url + 'api/admin/addCustomerCredits',
            {
                accessToken: $cookieStore.get('obj').accesstoken, email: data.email, credit: data.credit
            },
            function (data, status) {
                console.log(data);
                console.log(status);
                if (status == "success") {
                    ngDialog.close({
                        template: 'addCredit',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });
                    $scope.displaymsg2 = 'Credit Added';
                    ngDialog.open({
                        template: 'display_msg',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        showClose: false
                    });
                }
                else {
                    ngDialog.close({
                        template: 'addCredit',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });
                    $scope.displaymsg2 = 'Error';
                    ngDialog.open({
                        template: 'display_msg',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        showClose: false
                    });
                }
                console.log(data)
                $scope.list = data;
                $scope.$apply();
            });
    };
    /*-----------Export CSV Section Starts---------------------*/
    $scope.exportData = function () {
        alasql('SELECT * INTO CSV("customer.csv",{headers:true}) FROM ?', [$scope.excelList]);
    };
});