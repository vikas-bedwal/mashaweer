/**
 * Created by Vikas on 31/07/15.
 */
App.controller('ordersController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog,addHour) {
    'use strict';

    /*--------------------------------------------------------------------------
     * --------- Only One Datepicker will display at a time ---------------------------------------
     --------------------------------------------------------------------------*/
    $scope.datepicker={
        dt1:false,
        dt2:false
    };
    $scope.openDt1 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepicker.dt2 = false;
        $scope.datepicker.dt1 = true;
    };

    $scope.openDt2 = function($event) {
        console.log("here");
        console.log("$scope.datepicker.dt2"+$scope.datepicker.dt2);
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepicker.dt1 = false;
        $scope.datepicker.dt2 = true;
        console.log("$scope.datepicker.dt2"+$scope.datepicker.dt2);
    };

    $scope.$on('$destroy',function() {
        clearInterval($scope.setinterval);
    });


    $scope.loading = true;
        var tm = '';
    var sendData = [];
    $scope.showAll = 0;

   /*============= Pagination Section Starts=============*/
        $scope.records = 50;
        $scope.itemsPage = $scope.records;
        $scope.maxSize = 5;
        $scope.bigCurrentPage = 1;
        $scope.skip = 0;
        $scope.footerInfo = $scope.itemsPage;
        $scope.setPage = function (pageNo) {
        $scope.bigCurrentPage = pageNo;
        console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.pageChanged = function() {
        $scope.skip = ($scope.bigCurrentPage-1) * $scope.records;
        $scope.footerInfo = $scope.itemsPage * $scope.bigCurrentPage;
        $scope.recordsPerPage();
    };
    /*============= Pagination Section Ends=============*/


    $scope.recordsPerPage = function(){       //  hit on page load and whenever records per page changes
        //$scope.records = $scope.records;
        $scope.itemsPage = $scope.records;
        $scope.skip = ($scope.bigCurrentPage-1) * $scope.records;
        if($scope.showAll)
            sendData = ''
        else
            sendData = {limit : $scope.records, skip: $scope.skip}

        $http({
            url: MY_CONSTANT.url + 'api/admin/orderList/' + $cookieStore.get('obj').accesstoken,
            method: "GET",
            params: sendData

        })
            .then(function(response,status) {
                console.log(response);
                $scope.bigTotalItems = response.data.totalLength;
                $scope.footerInfo = ($scope.itemsPage * $scope.bigCurrentPage);
                if($scope.footerInfo > $scope.bigTotalItems)
                    $scope.footerInfo = $scope.bigTotalItems;
                $scope.response = response.data;
                /* if (response.data[0].timeLine[0].cancelled)*/
                if (response.status == 200) {
                    var dataArray = [];
                    /* Date.prototype.addHours= function(h){
                     this.setHours(this.getHours()+h);
                     return this;
                     }*/
                    var custList = response.data.data;
                    custList.forEach(function (column) {
                        var d = {};
                        d._id = column._id;
                        d.orderId = column.orderId;
                        d.customerName = column.customerName;
                        d.driverName = column.driverName;
                        d.parcelDetails = column.parcelDetails;
                        tm = (new Date(column.timeLine[0].scheduledPickUp));
                        var tm = addHour.addHours(tm,4)
                        /*tm = tm.addHours(4);*/
                        d.scheduledPickUp = moment.utc(tm).format("Do MMM YYYY hh:mm A");
                        tm = (new Date(column.timeLine[0].scheduledDelivery));
                        var tm = addHour.addHours(tm,4)
                        d.scheduledDelivery = moment.utc(tm).format("Do MMM YYYY hh:mm A");
                        if(column.timeLine[0].pickedUp){
                            tm = (new Date(column.timeLine[0].pickedUp));
                            var tm = addHour.addHours(tm,4);
                            d.actualCollectionTime = moment.utc(tm).format("Do MMM YYYY hh:mm A");
                        }
                        else{
                            d.actualCollectionTime = '-';
                        }

                        if (column.timeLine[0].delivered == undefined)
                            d.actualDeliveryTime = "-";
                        else{
                            tm = (new Date(column.timeLine[0].delivered));
                            var tm = addHour.addHours(tm,4)
                            d.actualDeliveryTime = moment.utc(tm ).format("Do MMM YYYY hh:mm A");
                        }

                        d.collectionFrom = column.collectionFrom;
                        d.deliverTo = column.deliverTo;
                        d.waitingTime = column.waitingTime;
                        d.vehicleRequired = column.vehicleRequired;
                        d.distance = Math.round(column.distance*100)/100;
                        d.amount = column.amount;
                        d.amount = Math.round(column.amount*100)/100;
                        d.initialEstimatedFare = Math.round(column.initialEstimatedFare*100)/100;
                        d.pickupLocation = column.pickupLocation;
                        d.deliveryLocation = column.deliveryLocation;
                        d.status = column.status;

                        switch (column.status) {
                            case 'PENDING':
                                d.status = 'Pending';
                                d.text_color = '#FF0000';
                                break;
                            case 'ORDER_DELIVERED':
                                d.status = 'Delivered';
                                d.text_color = '#1f9c3d';

                                break;
                            case 'CANCELLED':
                                d.status = 'Cancelled';
                                d.text_color = '#FF0033';
                                break;
                            case 'SUCCESS':
                                d.status = 'Success';
                                d.text_color = '#F6D21A';
                                break;
                            case 'REFUND':
                                d.status = 'Refund';
                                d.text_color = '#99FF66';
                                break;
                            case 'REACHED_PICKUP_POINT':
                                d.status = 'Reached At Pick Up Point';
                                d.text_color = '#D8BFD8';
                                break;
                            case 'PICKED_UP':
                                d.status = 'Picked Up';
                                d.text_color = '#D8BFD8';
                                break;
                            case 'REACHED_DELIVERY_POINT':
                                d.status = 'Reached At Delivery Point';
                                d.text_color = '#008080';
                                break;
                            case 'REQUEST_SENT_TO_DRIVER':
                                d.status = 'Request Sent to Driver';
                                d.text_color = '#3300FF';
                                break;
                            case 'DRIVER_ASSIGNED':
                                d.status = 'Driver Assigned';
                                d.text_color = '#330033';
                                break;
                            case 'ACCEPTED':
                                d.status = 'Accepted';
                                d.text_color = '#336600';

                                break;
                            case 'REFUSED':
                                d.status = 'Refused';
                                d.text_color = '#FF3333';
                                break;
                            case 'DRIVER_RESPONDED':
                                d.status = 'Driver Responded';
                                d.text_color = '#99FFCC';
                                break;
                            case 'REASSIGNED':
                                d.status = 'Reassigned';
                                d.text_color = '#FF0000';
                                break;
                        }
                        d.cancellationCost = column.paymentBreakup.cancellationCost;
                        d.creditsUsed = column.paymentBreakup.creditsUsed;
                        d.cardCharged = column.paymentBreakup.cardCharged;
                        d.cashCollectedAtPickUp = column.paymentBreakup.cashCollectedAtPickup;
                        d.cashCollectedAtDelivery = column.paymentBreakup.cashCollectedAtDelivery;
                        d.discountGiven = column.paymentBreakup.discountGiven;
                        d.finalCost = column.paymentBreakup.finalCost;
                        d.negativeCreditsAdded = column.paymentBreakup.negativeCreditsAdded;
                        d.outStandingAmountTaken = column.paymentBreakup.previousOutstandingAmount;
                        d.remainingAmountToBeCharged = column.paymentBreakup.remainingAmountToBeCharged;
                        d.surplusAmountTransferredToCredit = column.paymentBreakup.surplusAmountTransferredToCredit;
                        d.initialEstimatedFare = Math.round(column.paymentBreakup.initialEstimatedFare);
                        d.totalChargedCost = Math.round(column.paymentBreakup.totalChargedCost);
                        d.waitingChargeAtPickup = Math.round(column.paymentBreakup.waitingChargeAtPickup);
                        d.waitingChargeAtDelivery = Math.round(column.paymentBreakup.waitingChargeAtDelivery);
                        tm = (new Date(column.timeLine[0].createdAt));
                        var tm = addHour.addHours(tm,4)
                        d.createdAt = moment.utc(tm).format("Do MMM YYYY hh:mm A");
                        dataArray.push(d);
                    });
                    $scope.list = dataArray;

/*================For datatable reinitialization purpose=======================*/
                    var createtable=function(){
                        var dtInstance;
                        $timeout(function () {
                            $scope.loading = false;
                            if (!$.fn.dataTable) return;
                            dtInstance = $('#datatable2').dataTable({
                                dom: 'Bfrtip',
                                buttons: [
                                    /*'copyHtml5',
                                    'excelHtml5',*/
                                    'csvHtml5',
                                    /*'pdfHtml5'*/
                                ],
                                'paging': false,  // Table pagination
                                'ordering': true,  // Column ordering
                                'info': false,
                                "scrollX": true,
                                "scrollY": "345px",
                                "sEmptyTable": '',
                                "sInfoEmpty": '',
                                "sZeroRecords":'',
                                "aLengthMenu": [10, 25, 50, 100],

                                // Bottom left status text
                                oLanguage: {

                                    sSearch: 'Search all columns:',
                                    sLengthMenu: '_MENU_ records per page',
                                    info: 'Showing page _PAGE_ of _PAGES_',
                                    zeroRecords: 'Nothing found - sorry',
                                    infoEmpty: 'No records available',
                                    infoFiltered: '(filtered from _MAX_ total records)'
                                },
                                "order": [[1, "desc"]],
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
                    }
                    if ($.fn.DataTable.isDataTable("#datatable2")) {
                        console.log("hello");
                        $('#datatable2').DataTable().clear().destroy();
                    }
                    createtable();
                } else {
                    alert("Something went wrong, please try again later.");
                    return false;
                }
            },
            function(response) { // optional
                // failed
              alert("Something went wrong, please try again later.");
                $state.go('page.login');
            });
    }
    $scope.recordsPerPage();

    /* =================== Show All Order Once At a time ============================= */
    $scope.showAllOrder = function(){
        $scope.loading = true;
        $scope.showAll = 1;
        $scope.recordsPerPage();
    }
    $scope.recordsPerPageVal = function(){
        $scope.loading = true;
        $scope.showAll = 0;
        $scope.recordsPerPage();
    }

   /* =================== Order timeline ============================= */
    $scope.timeLine = function (_id,orderId) {
        var timeLine = [];
        $scope.orderId = orderId;
        for (var i = 0; i < $scope.response.data.length; i++) {
            if ($scope.response.data[i]._id == _id) {
                if ($scope.response.data[i].timeLine[0].createdAt){
                    tm = (new Date($scope.response.data[i].timeLine[0].createdAt));
                    var tm = addHour.addHours(tm,4)
                    timeLine.push("Order placed at " +  moment.utc(tm).format("Do MMM YYYY hh:mm A"));
                }

                if ($scope.response.data[i].timeLine[0].driverAssigned){
                    tm = (new Date($scope.response.data[i].timeLine[0].driverAssigned));
                    var tm = addHour.addHours(tm,4)
                    timeLine.push("Driver assigned at " + moment.utc(tm).format("Do MMM YYYY hh:mm A"));
                }

                if ($scope.response.data[i].timeLine[0].scheduledPickUp){
                    tm = (new Date($scope.response.data[i].timeLine[0].scheduledPickUp));
                    var tm = addHour.addHours(tm,4)
                    timeLine.push("Scheduled pick up time is " + moment.utc(tm).format("Do MMM YYYY hh:mm A"));
                }


                if ($scope.response.data[i].timeLine[0].scheduledDelivery) {
                    tm = (new Date($scope.response.data[i].timeLine[0].scheduledDelivery));
                    var tm = addHour.addHours(tm,4)
                    timeLine.push("Scheduled delivery time is " + moment.utc(tm).format("Do MMM YYYY hh:mm A"));
                }

                if ($scope.response.data[i].timeLine[0].reachedPickUpPoint) {
                    tm = (new Date($scope.response.data[i].timeLine[0].reachedPickUpPoint));
                    var tm = addHour.addHours(tm,4)
                    timeLine.push($scope.response.data[i].driverName+" reached at pickup point at " + moment.utc(tm).format("Do MMM YYYY hh:mm A"));
                }

                if ($scope.response.data[i].timeLine[0].pickedUp) {
                    tm = (new Date($scope.response.data[i].timeLine[0].pickedUp));
                    var tm = addHour.addHours(tm,4)
                    timeLine.push($scope.response.data[i].driverName+" picked up order at " + moment.utc(tm).format("Do MMM YYYY hh:mm A"));
                }
                if ($scope.response.data[i].timeLine[0].reachedDeliveryPoint) {
                    tm = (new Date($scope.response.data[i].timeLine[0].reachedDeliveryPoint));
                    var tm = addHour.addHours(tm,4)
                            timeLine.push($scope.response.data[i].driverName+" reached at delivery point at " + moment.utc(tm).format("Do MMM YYYY hh:mm A"));
                }

                if ($scope.response.data[i].timeLine[0].cancelled) {
                    tm = (new Date($scope.response.data[i].timeLine[0].cancelled));
                    var tm = addHour.addHours(tm,4)
                    timeLine.push("Order cancelled at " + moment.utc(tm).format("Do MMM YYYY hh:mm A"));
                }

                if ($scope.response.data[i].timeLine[0].delivered) {
                    tm = (new Date($scope.response.data[i].timeLine[0].delivered));
                    var tm = addHour.addHours(tm,4)
                    timeLine.push("Order delivered at " + moment.utc(tm).format("Do MMM YYYY hh:mm A"));
                }
            }
        }
        $scope.timings = timeLine.reverse();
        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument: true,
            closeByEscape: true
        }).then(function (value) {
        }, function (reason) {
        });
    }

    /*=========== Advance Search Section Starts ====================== */
    $scope.addSearchDialog = function(){
        ngDialog.openConfirm({
            template: 'advanceSearch',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument: true,
            closeByEscape: true
        })
    }
    $scope.advanceSearch = function(get_data){
        console.log(get_data);
    }
    var dtInstance;
    $scope.setinterval= setInterval(function(){
        $scope.$on('$destroy', function () {
            dtInstance.fnDestroy();
            $('[class*=ColVis]').remove();
        })
        $scope.recordsPerPage();
    }, 12000);

});