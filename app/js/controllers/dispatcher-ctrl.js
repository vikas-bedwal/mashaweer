/**
 * Created by vikas on 21/08/15.
 */

App.controller('dispatcherController', function ($scope, $http, $cookies, $cookieStore, $stateParams,
                                            MY_CONSTANT, $timeout, $window, $state,ngDialog) {
    'use strict';
    $scope.account = {};
    $scope.authMsg = '';
    $scope.addDispatcher = function(){
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
                    d.firstName = column.firstName,
                    d.lastName = column.lastName,
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
        $scope.authMsg = '';
        $.post(MY_CONSTANT.url + 'api/admin/createSubAdmin',
            {
                email: $scope.account.email,
                firstName: $scope.account.fName,
                lastName: $scope.account.lName
            })
            .success(function (data,status)  {
                if (status != 'success') {
                    $scope.authMsg = data.message;
                    setTimeout(function () {
                        $scope.authMsg = "";
                        $scope.$apply();
                    }, 3000);
                    $scope.$apply();
                } else {
                    $scope.displaymsg = "Dispatcher Added Successfully";
                    $state.reload();
                    ngDialog.close();

                    ngDialog.open({
                        template: 'display_msg',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        showClose: true
                    });
                }
            })
            .error(function(data, status){
                ngDialog.open({
                    template: 'display_conflict_msg',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    showClose: true
                });
                console.log("IN Error API");
            })

    };

    $scope.editData = function(data){
        $scope.popUpData = data;
        ngDialog.open({
            template: 'editDispatcher',
            className: 'ngdialog-theme-default',
            scope: $scope,
            showClose: true
        })
    }

    $scope.editDispatcher = function(data){
        $http({
            url: MY_CONSTANT.url + 'api/admin/editDispatcher',
            method: "POST",
            data: { 'accessToken' : $cookieStore.get('obj').accesstoken,
                '_id': data._id,
                'email': data.email,
                'firstName': data.firstName,
                'lastName': data.lastName
            }
        })
            .then(function(response) {
                ngDialog.close();
                $state.reload();
            },
            function(response) { // optional
                // failed
                alert("Something went wrong");
            });
    }

$scope.deleteData = function(dispatcherId){
    $scope.dispatcherId = dispatcherId;
    ngDialog.open({
        template: 'deleteDispatcher',
        className:'ngdialog-theme-default',
        scope: $scope

    })
}

    $scope.deleteDispatcher = function(dispatcherId){
        $http({
            url: MY_CONSTANT.url + 'api/admin/deleteDispatcher',
            method: "POST",
            data: { 'accessToken' : $cookieStore.get('obj').accesstoken,
                '_id': dispatcherId
            }
        })
            .then(function(response) {
                ngDialog.close();
               $state.reload();
            },
            function(response) { // optional
                // failed
                alert("Something Went Wrong");
            });
    }

});
