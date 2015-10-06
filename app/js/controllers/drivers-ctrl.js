/**
 * Created by Vikas on 31/07/15.
 */
App.controller('driversController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout,$state,ngDialog) {
    'use strict';
    $http.get(MY_CONSTANT.url + 'api/admin/driverList/' + $cookieStore.get('obj').accesstoken)
        .success(function (response, status) {
            if (status == 200) {
                var dataArray = [];
                var driverList = response.data;
                driverList.forEach(function (column) {
                    var d = {};
                    d._id = column._id;
                    d.firstName = column.firstName;
                    d.lastName = column.lastName;
                    d.fullName = column.fullName;
                    d.email = column.email;
                    d.title = column.title;
                    d.vehicleType = column.vehicleType;
                    d.isDedicated = column.isDedicated
                    if(column.isDedicated == false)
                        d.isDedicated = 'Freelancer';
                    else
                        d.isDedicated = 'Dedicated';
                    if(column.isDeleted == false)
                        d.isDeleted = 'Active';
                    else
                        d.isDeleted = 'Inactive';
                    if(column.isBlocked == false)
                        d.isBlocked = 0;
                    else
                        d.isBlocked = 1;
                    dataArray.push(d);
                });
                $scope.list = dataArray;

                /*-----------Customer BLock Section Starts---------------------*/
                $scope.blockCust = function (email) {
                    $http({
                        method: 'POST',
                        url: MY_CONSTANT.url + 'api/admin/toggleCustomerBlock',
                        data: { accessToken: 'YWRtaW5AbWFzaGF3ZWVyLmNvbVRodSBKdWwgMzAgMjAxNSAxNzo1OToxOSBHTVQrMDUzMCAoSVNUKQ==', email: email},
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                        .success(function (response) {
                            if (status == 200) {
                                $scope.list = data;
                                $scope.$apply();
                                $state.reload();
                            } else {
                                alert("Something went wrong, please try again later.");
                                return false;
                            }
                        })
                        .error(function (error) {
                            console.log(error);
                        });
                };
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


    // -----------Driver BLock Section Starts---------------------
    $scope.blockDriver = function (email) {
        $.post(MY_CONSTANT.url + 'api/admin/toggleDriverBlock',
            {
                accessToken: $cookieStore.get('obj').accesstoken, email: email
            },
            function (data) {
                $scope.list = data;
                $scope.$apply();
                $state.reload();
            });
    };

    /*------------Add Driver Info Section Starts---------------*/
    $scope.addData = function () {
        ngDialog.openConfirm({
            template: 'addDriver',
            className: 'ngdialog-theme-default',
            scope: $scope
        })
    };
    $scope.addDriver = function(data_get){
        console.log(data_get);
        alert("Oops..... Api pending")
       /* if(data_get.add_driver_type == $scope.details.isDedicated)
            var flag = false;
        else
            var flag = true
        $http({
            url: MY_CONSTANT.url + 'api/admin/addDriverInfo',
            method: "POST",
            data: { accessToken : $cookieStore.get('obj').accesstoken,
                email: $scope.pop.email,
                firstName: $scope.pop.firstName,
                lastName: $scope.pop.lastName,
                vehicleType: $scope.pop.vehicleType,
                flag: flag
            }
        })
            .then(function(response) {
                ngDialog.close();
                $state.reload();
            },
            function(response,status) { // optional
                // failed
                alert("Something went wrong");
            });*/
    }
    /*------------Add Driver Info Section End---------------*/

    /*------------Edit Driver Info Section Starts---------------*/
    $scope.pop = {};
    $scope.editData = function (data_get) {
        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (value) {
        }, function (reason) {
        });
        $scope.details = data_get;
        $scope.pop.firstName = data_get.firstName;
        $scope.pop.email = data_get.email;
        $scope.pop.lastName = data_get.lastName;
        $scope.pop.vehicleType = data_get.vehicleType;
        $scope.pop.isDedicated = data_get.isDedicated;

    };

    $scope.editDriver = function(){
        console.log($scope.pop.vehicleType);

        if($scope.pop.isDedicated == $scope.details.isDedicated)
        var flag = false;
        else
        var flag = true
        $http({
            url: MY_CONSTANT.url + 'api/admin/editDriverInfo',
            method: "POST",
            data: { accessToken : $cookieStore.get('obj').accesstoken,
                email: $scope.pop.email,
                firstName: $scope.pop.firstName,
                lastName: $scope.pop.lastName,
                vehicleType: $scope.pop.vehicleType,
                flag: flag
            }
        })
            .then(function(response) {
                ngDialog.close();
                $state.reload();
            },
            function(response,status) { // optional
                // failed
                alert("Something went wrong");
            });
    }
    /*------------Edit Driver Info Section End---------------*/
});