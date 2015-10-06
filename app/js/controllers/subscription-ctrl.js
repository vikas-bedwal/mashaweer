/**
 * Created by vikas on 26/08/15.
 */
App.controller('subscriptionController', function ($scope, $http, $cookies, $cookieStore, $stateParams,
                                                   MY_CONSTANT, $timeout, $window, $state, ngDialog, convertdatetime) {
    'use strict';
    $scope.account = {};
    $scope.authMsg = '';
    $scope.min_date = new Date();
    $scope.datepicker={
        dt:false,
        dt2:false
    };
    $scope.openDt1 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datepicker.dt1 = true;
    };

  /*  $scope.openDt2 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepicker.dt1 = false;
        $scope.datepicker.dt2 = true;
    };*/
    $http.get(MY_CONSTANT.url + 'api/admin/getSubscriptionInfo/' + $cookieStore.get('obj').accesstoken)
        .success(function (response, status) {
            if (status == 200) {
                var dataArray = [];
                var suscriptionList = response.data;
                suscriptionList.forEach(function (column) {
                    var d = {};
                    d._id = column._id;
                    d.heading = column.heading;
                    d.amount = column.amount;
                    d.validity = column.validity,
                    d.validUpto = moment.utc(column.expiryDate).format("YYYY-MM-DD");
                        d.subscriptionType = column.conditionsApply,
                        d.totalCredits = column.totalCredits,
                        d.description = column.text,

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

    /*-----------nested table for subscription info ---------------------*/
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

    /*------------Edit Driver Info Section Starts---------------*/
    $scope.pop = {};
    $scope.editData = function (data_get) {
        jQuery('#datetimepicker').datetimepicker({
            lang: 'de',
            i18n: {
                de: {
                    months: [
                        'Januar', 'Februar', 'März', 'April',
                        'Mai', 'Juni', 'Juli', 'August',
                        'September', 'Oktober', 'November', 'Dezember',
                    ],
                    dayOfWeek: [
                        "So.", "Mo", "Di", "Mi",
                        "Do", "Fr", "Sa.",
                    ]
                }
            },
            timepicker: false,
            format: 'Y-m-d',
            minDate: ''//yesterday is minimum date(for today use 0 or -1970/01/01)

        });
        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (value) {
        }, function (reason) {
        });
        $scope.details = data_get;
        $scope.pop.heading = data_get.heading;
        $scope.pop.totalCredits = data_get.totalCredits;
        $scope.pop.validUpto = data_get.validUpto;
        $scope.pop.validity = data_get.validity;
        $scope.pop.amount = data_get.amount;

    };

    $scope.editSubscription = function(){
        var convertedDate = convertdatetime.convertDate($scope.pop.validUpto)
        $http({
            url: MY_CONSTANT.url + 'api/admin/editSubscriptionInfo',
            method: "POST",
            data: { accessToken : $cookieStore.get('obj').accesstoken,
                _id: $scope.details._id,
                heading: $scope.pop.heading,
                expiryDate: convertedDate,
                validity: $scope.pop.validity,
                totalCredits: $scope.pop.totalCredits,
                amount: $scope.pop.amount
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

    /*-----------Delete subscription Section dialog---------------------*/
    $scope.deleteData = function(subscriptionId){
        $scope.subscriptionId = subscriptionId;
        ngDialog.open({
            template: 'deleteSubscription',
            className:'ngdialog-theme-default',
            scope: $scope

        })
    }

    $scope.deleteSubscription = function(subscriptionId){
        $http({
            url: MY_CONSTANT.url + 'api/admin/deleteSubscription',
            method: "POST",
            data: { accessToken : $cookieStore.get('obj').accesstoken,
                _id: subscriptionId
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