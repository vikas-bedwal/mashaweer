/**
 * Created by Vikas on 12/08/15.
 */
App.controller('promoController', function ($scope, $http, $cookies, $cookieStore, $stateParams,
                                                  MY_CONSTANT, $timeout, $window, $state, ngDialog,addHour) {
    'use strict';
    $scope.pop = {};


    /*--------------------------------------------------------------------------
     * --------- Only One Datepicker will display at a time ---------------------------------------
     --------------------------------------------------------------------------*/
    $scope.datepicker={
        dt:false,
        dt2:false
    };
    $scope.openDt1 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepicker.dt2 = false;
        $scope.datepicker.dt1 = true;
    };

    $scope.openDt2 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepicker.dt1 = false;
        $scope.datepicker.dt2 = true;
    };
console.log("try");
    $http.get(MY_CONSTANT.url + 'api/admin/getPromoCode/' + $cookieStore.get('obj').accesstoken)
        .success(function (response, status) {
            console.log(response);
            console.log(status);
            if (status == 200) {
                var dataArray = [];
                var tm = '';
                var promoList = response.data;
                promoList.forEach(function (column) {
                    var d = {};
                    d._id = column._id;
                    d.promoCode = column.promoCode;
                    d.city = column.city;
                    d.credits = column.credits;
                    d.discount = column.discount;
                    d.minAmount = column.minAmount;
                    d.vehicleType = column.vehicleType;
                    d.promoType = column.promoType;
                    var currentDate = moment(new Date()).format('YYYY-MM-DD');
                    var startDate = moment(column.startTime).format('YYYY-MM-DD');
                    var endDate = moment(column.endTime).format('YYYY-MM-DD');
                    if((moment(endDate).isBefore(currentDate)))
                        d.dltHide = 0;
                    else if(moment(startDate).isAfter(currentDate))
                        d.dltHide = 0;
                    else
                        d.dltHide = 1;
                    d.startTime = column.startTime;
                    d.endTime = column.endTime;
                    d.isDeleted = column.isDeleted;

                    tm = (new Date(column.createdAt));
                    tm = addHour.addHours(tm,4);
                    /*d.createdAt = moment.utc(tm).format("Do MMM YYYY hh:mm A");*/

                    d.createdAt = tm;
                    dataArray.push(d);
                });
                $scope.list = dataArray;
                /*------------Edit Promo Section Starts---------------*/
                $scope.editData = function (data_get) {
                    ngDialog.openConfirm({
                        template: 'modalDialogId',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    }).then(function (value) {
                    }, function (reason) {
                    });
                    $scope.details = data_get;
                    $scope.pop._id = data_get._id;
                    $scope.pop.promoCode = data_get.promoCode;
                    $scope.pop.city = data_get.city;
                    $scope.pop.credits = data_get.credits;
                    $scope.pop.discount = data_get.discount;
                    $scope.pop.minAmount = data_get.minAmount;
                    $scope.pop.vehicleType = data_get.vehicleType;
                    $scope.pop.promoType = data_get.promoType;
                    $scope.pop.startTime = data_get.startTime;
                    $scope.pop.endTime = data_get.endTime;

                    var startDate = moment(data_get.startTime).format('YYYY-MM-DD');
                    var currentDate = moment(new Date()).format('YYYY-MM-DD');
                    var startResult = (moment(startDate).isAfter(currentDate));
                    $scope.startResult = startResult;
                    $scope.show = startResult;

                    var endDate = moment(data_get.endTime).format('YYYY-MM-DD');
                    var currentDate = moment(new Date()).format('YYYY-MM-DD');
                    var endResult = (moment(endDate).isAfter(currentDate));

                    $scope.endResult = endResult;

                    if(!startResult){
                        $scope.min_date = '3015-01-01';
                    }

                    if(!endResult){
                        $scope.min_dt = '3015-01-01';
                    }

                };


                $scope.editPromo = function () {
                    var sDate = moment.utc($scope.pop.startTime).format("YYYY-MM-DD");
                    var eDate = moment.utc($scope.pop.endTime).format("YYYY-MM-DD");
                    $.post(MY_CONSTANT.url + 'api/admin/editPromoCode',
                        {
                            accessToken: $cookieStore.get('obj').accesstoken,
                            promoId:  $scope.pop._id,
                            promoType: $scope.pop.promoType,
                            vehicleType: $scope.pop.vehicleType,
                            discount: $scope.pop.discount,
                            minAmount: $scope.pop.minAmount,
                            credits: $scope.pop.credits,
                            city: $scope.pop.city,
                            startTime: sDate,
                            endTime: eDate


                        },
                        function (data) {
                            $state.reload();
                            ngDialog.close();
                        });
                };

                /*------------Edit Promo Section End---------------*/

                /*------------Delete Promo Code Section Start---------------*/
                $scope.openConfirm = function (data_get,restrictDlt) {
                    console.log(restrictDlt);
                    if(restrictDlt){
                        ngDialog.openConfirm({
                            template: 'restrictDlt',
                            className: 'ngdialog-theme-default',
                            scope: $scope
                        })
                    }
                    else{
                        $scope.visible = true;
                        ngDialog.openConfirm({
                            template: 'modalDialogId1',
                            className: 'ngdialog-theme-default',
                            scope: $scope
                        }).then(function (value) {
                        }, function (reason) {
                        });
                        $scope.id = data_get;
                        $('#ngdialog1').find('div.ngdialog-content').attr('ng-show', 'visible');
                    }
                };
                $scope.deleteOffer = function (promo_id) {
                    $.post(MY_CONSTANT.url + 'api/admin/deletePromoCode',
                        {
                            accessToken: $cookieStore.get('obj').accesstoken,
                            promoId: promo_id
                        },
                        function (data) {
                            $state.reload();
                            ngDialog.close();
                        });

                };

                /*------------Delete Promo Code Section End---------------*/

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
                    /*    "order": [[ 11, "desc" ]]*/
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
