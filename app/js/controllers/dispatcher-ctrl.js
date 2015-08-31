/**
 * Created by vikas on 21/08/15.
 */

App.controller('dispatcherController', function ($scope, $http, $cookies, $cookieStore, $stateParams,
                                            MY_CONSTANT, $timeout, $window, $state,ngDialog) {
    'use strict';
    $scope.account = {};
    $scope.authMsg = '';
    $scope.addDispatcher = function(){
        console.log("dispatcher");
        ngDialog.openConfirm({
            template: 'dispatcher',
            className: 'ngdialog-theme-default placeOrder',
            scope: $scope
        }).then(function (value) {
        }, function (reason) {
        });
    }

    $http.get(MY_CONSTANT.url + 'api/admin/getDispatcher/' + $cookieStore.get('obj').accesstoken)
        .success(function (response, status) {
            if (status == 200) {
                var dataArray = [];
                var dispatcherList = response.data;
                dispatcherList.forEach(function (column) {
                    var d = {};
                    d._id = column._id;
                    d.fullName = column.fullName;
                    d.email = column.email;
                    d.type = column.type
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

    $scope.register = function () {
        console.log("In register dispatcher");
        $scope.authMsg = '';
        console.log($scope.account.fullName);
        console.log($scope.account.email);
        $.post(MY_CONSTANT.url + 'api/admin/createSubAdmin',
            {
                email: $scope.account.email,
                password: "dispatcher",
                fullName: $scope.account.fullName
            })
            .success(function (data,status)  {
                console.log(data)
                console.log(status)
                console.log("IN SUCCESS API");
                if (status != 'success') {
                    console.log("if");
                    $scope.authMsg = data.message;
                    setTimeout(function () {
                        $scope.authMsg = "";
                        $scope.$apply();
                    }, 3000);
                    $scope.$apply();
                } else {
                    console.log("else");
                    $scope.displaymsg = "Dispatcher Added Successfully";
                    $state.reload();
                    ngDialog.close({
                        template: 'dispatcher',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });

                    ngDialog.open({
                        template: 'display_msg',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        showClose: true
                    });
                }
            })
            .error(function(data, status){
                console.log(data)
                console.log(status)
                console.log("IN Error API");
            })

    };
});
