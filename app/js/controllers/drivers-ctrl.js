/**
 * Created by Vikas on 31/07/15.
 */
App.controller('driversController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout) {
    'use strict';
    console.log("In driver");
    $http.get(MY_CONSTANT.url + 'api/admin/driverList/' + $cookieStore.get('obj').accesstoken)
        .success(function (response, status) {
            console.log(response);
            if (status == 200) {
                var dataArray = [];
                var driverList = response.data;
                driverList.forEach(function (column) {
                    var d = {};
                    d._id = column._id;
                    d.fullName = column.fullName;
                    d.title = column.title;
                    d.isDedicated = column.isDedicated
                    if(column.isDedicated == false)
                        d.isDedicated = 'Freelancer';
                    else
                        d.isDedicated = 'Dedicated';
                    dataArray.push(d);
                });
                $scope.list = dataArray;

                /*-----------Customer BLock Section Starts---------------------*/
                $scope.blockCust = function (email) {
                    console.log($cookieStore.get('obj').accesstoken);
                    console.log(email);
                    $http({
                        method: 'POST',
                        url: MY_CONSTANT.url + 'api/admin/toggleCustomerBlock',
                        data: { accessToken: 'YWRtaW5AbWFzaGF3ZWVyLmNvbVRodSBKdWwgMzAgMjAxNSAxNzo1OToxOSBHTVQrMDUzMCAoSVNUKQ==', email: email},
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                        .success(function (response) {
                            console.log(response);
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
});