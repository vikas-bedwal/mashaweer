/**
 * Created by Vikas on 31/07/15.
 */
App.controller('ordersController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout) {
    'use strict';
    $scope.loading = true;
    $http.get(MY_CONSTANT.url + 'api/admin/orderList/' + $cookieStore.get('obj').accesstoken)
        .success(function (response, status) {
            if (status == 200) {
                var dataArray = [];
                var custList = response.data;
                custList.forEach(function (column) {
                    var d = {};
                    d._id = column._id;
                    d.orderId = column.orderId;
                    d.customerName = column.customerName;
                    d.driverName = column.driverName;
                    d.parcelDetails = column.parcelDetails;
                    d.actualCollectionTime = column.actualCollectionTime;
                    d.collectionFrom = column.collectionFrom;
                    d.deliverTo = column.deliverTo;
                    d.waitingTime = column.waitingTime;
                    d.vehicleRequired = column.vehicleRequired;
                    d.distance = column.distance;
                    d.amount = column.amount;
                    d.pickupLocation = column.pickupLocation;
                    d.deliveryLocation = column.deliveryLocation
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
                        case 'ONGOING':
                            d.d.status = 'Ongoing';
                            d.text_color = '#2f80e7';

                            break;

                    }
                    d.createdAt = column.createdAt;
                    dataArray.push(d);
                });
                $scope.list = dataArray;
                var dtInstance;
                $timeout(function () {
                    $scope.loading = false;
                    if (!$.fn.dataTable) return;
                    dtInstance = $('#datatable2').dataTable({
                        'paging': true,  // Table pagination
                        'ordering': true,  // Column ordering
                        'info': true,
                        "scrollX": true,

                        // Bottom left status text
                        oLanguage: {
                            sSearch: 'Search all columns:',
                            sLengthMenu: '_MENU_ records per page',
                            info: 'Showing page _PAGE_ of _PAGES_',
                            zeroRecords: 'Nothing found - sorry',
                            infoEmpty: 'No records available',
                            infoFiltered: '(filtered from _MAX_ total records)'
                        }

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