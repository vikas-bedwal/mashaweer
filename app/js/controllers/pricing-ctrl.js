/**
 * Created by Vikas on 31/07/15.
 */

    App.controller('pricingController',
        function($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout, $filter, editableOptions, editableThemes, $q,$state,ngDialog) {
            console.log("In pricing");

            // editable row
            // -----------------------------------
            $scope.distanceFareBike = [];
            $scope.distanceFareVan = [];
            $scope.distanceFareTruck = [];
            $scope.waitFareBike = [];
            $scope.waitFareVan = [];
            $scope.waitFareTruck = [];

            $http.get(MY_CONSTANT.url + 'api/admin/pricingInfo/' + $cookieStore.get('obj').accesstoken)
                .success(function (response, status) {
                    if (status == 200) {

                       /* ----------------Bike Fare List-----------*/
                        if(response.data.bikePricingInfo.length) {
                            console.log("bike");
                            var dataArray = [];
                            var distanceFareBike = response.data.bikePricingInfo[0].distancePricing;
                            distanceFareBike.forEach(function (column) {
                                var d = {};
                                d._id = column._id;
                                d.from = column.from;
                                if(column.to==1000000)
                                d.to = "Above";
                                else
                                d.to = column.to;
                                d.fareCharge = column.fareCharge;
                                dataArray.push(d);
                            });
                            $scope.distanceFareBike =  dataArray;
                            var dataArray = [];
                            var waitFareBike = response.data.bikePricingInfo[0].waitTimePricing;
                            waitFareBike.forEach(function (column) {
                                var d = {};
                                d._id = column._id;
                                d.from = column.from;
                                if(column.to==1000000)
                                    d.to = "Above";
                                else
                                d.to = column.to;
                                d.fareCharge = column.fareCharge;
                                dataArray.push(d);
                            });
                            $scope.waitFareBike = dataArray;
                        }
                        /* ----------------Van Fare List-----------*/
                        if(response.data.vanPricingInfo.length) {
                            console.log("van");
                            var dataArray = [];
                            var distanceFareVan = response.data.vanPricingInfo[0].distancePricing;
                            distanceFareVan.forEach(function (column) {
                                var d = {};
                                d._id = column._id;
                                d.from = column.from;
                                if(column.to==1000000)
                                    d.to = "Above";
                                else
                                d.to = column.to;
                                d.fareCharge = column.fareCharge;
                                dataArray.push(d);
                            });
                            $scope.distanceFareVan =  dataArray;

                            var waitFareVan = response.data.vanPricingInfo[0].waitTimePricing;
                            var dataArray = [];
                            waitFareVan.forEach(function (column) {
                                var d = {};
                                d._id = column._id;
                                d.from = column.from;
                                if(column.to==1000000)
                                    d.to = "Above";
                                else
                                d.to = column.to;
                                d.fareCharge = column.fareCharge;
                                dataArray.push(d);

                            });
                            $scope.waitFareVan = dataArray;
                        }
                        /* ----------------Van Fare List-----------*/
                        if(response.data.truckPricingInfo.length) {
                            console.log("truck");
                            var dataArray = [];
                            var distanceFareTruck = response.data.truckPricingInfo[0].distancePricing;
                            distanceFareTruck.forEach(function (column) {
                                var d = {};
                                d._id = column._id;
                                d.from = column.from;
                                if(column.to==1000000)
                                    d.to = "Above";
                                else
                                d.to = column.to;
                                d.fareCharge = column.fareCharge;
                                dataArray.push(d);
                            });
                            $scope.distanceFareTruck = dataArray;

                            var dataArray = [];
                            var waitFaretruck = response.data.truckPricingInfo[0].waitTimePricing;
                            waitFaretruck.forEach(function (column) {
                                var d = {};
                                d._id = column._id;
                                d.from = column.from;
                                if(column.to==1000000)
                                    d.to = "Above";
                                else
                                d.to = column.to;
                                d.fareCharge = column.fareCharge;
                                dataArray.push(d);
                            });
                            $scope.waitFaretruck = dataArray;
                        }

                        var dtInstance;
                        $timeout(function () {
                            if (!$.fn.dataTable) return;
                            dtInstance = $('#datatable2').dataTable({
                                'paging': true,  // Table pagination
                                'ordering': true,  // Column ordering
                                'info': true,
                                'bDestroy' : true,// Bottom left status text
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

                            columnInputs
                                .keyup(function () {
                                    dtInstance.fnFilter(this.value, columnInputs.index(this));
                                });
                        });

                    } else {
                        alert("Something went wrong, please try again later.");
                        return false;
                    }
                })
                .error(function (error) {
                    console.log(error);
                });

            $scope.saveUser = function(data) {
                if(isNaN(parseInt(data.to)))
                    data.to = 1000000;

                $http({
                    url: MY_CONSTANT.url + 'api/admin/addPricing',
                    method: "POST",
                    data: { accessToken: $cookieStore.get('obj').accesstoken,
                        vehicleType: $scope.type,
                        from: data.from,
                        to: data.to,
                        fareCharge: data.fareCharge,
                        flag: $scope.flag
                    }
                })
                    .then(function(response) {
                        console.log(response);
                        $scope.list = response;
                        $state.reload();
                    },
                    function(response) { // optional
                        console.log("failed");
                        ngDialog.open({
                            template: 'display_failure_validation_msg',
                            className: 'ngdialog-theme-default',
                            scope: $scope,
                            showClose: false
                        });
                        // failed
                    });
            };

            // -----------------Add row for Fare List------------------------
            $scope.addRow = function(type) {
                $scope.inserted = {
                    from: null,
                    to: null,
                    fareCharge: null,
                    isNew: true
                };
                    switch(type) {
                        case 'distanceFareBike':
                            $scope.distanceFareBike.push($scope.inserted);
                            $scope.type = "BIKE";
                            $scope.flag = 0;
                            break;
                        case 'waitFareBike':
                            $scope.waitFareBike.push($scope.inserted);
                            $scope.type = "BIKE";
                            $scope.flag = 1;
                            break;
                        case 'distanceFareVan':
                            $scope.distanceFareVan.push($scope.inserted);
                            $scope.type = "VAN";
                            $scope.flag = 0;
                            break;
                        case 'waitFareVan':
                            $scope.waitFareVan.push($scope.inserted);
                            $scope.type = "VAN";
                            $scope.flag = 1;
                            break;
                        case 'distanceFareTruck':
                            $scope.distanceFareTruck.push($scope.inserted);
                            $scope.type = "TRUCK";
                            $scope.flag = 0;
                            break;
                        case 'waitFaretruck':
                            $scope.waitFaretruck.push($scope.inserted);
                            $scope.type = "TRUCK";
                            $scope.flag = 1;
                            break;
                        default: console.log("Default");
                    }
            };

            /**=========================================================
             * Module: delete row
             =========================================================*/

            $scope.openConfirmationDialog = function ($index,type,flag) {
                $scope.index = $index;
                $scope.type = type;
                $scope.flag = flag;
                ngDialog.open({
                    template: 'firstDialogId',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
            };

            $scope.confirmDelete = function () {
                switch($scope.type) {
                    case 'distanceFareBike':
                        $scope.from = $scope.distanceFareBike[$scope.index].from;
                        $scope.to = $scope.distanceFareBike[$scope.index].to;
                        $scope.type = "BIKE";
                        $scope.flag = 0;
                        break;
                    case 'waitFareBike':
                        $scope.from = $scope.waitFareBike[$scope.index].from;
                        $scope.to = $scope.waitFareBike[$scope.index].to;
                        $scope.type = "BIKE";
                        $scope.flag = 1;
                        break;
                    case 'distanceFareVan':
                        $scope.from = $scope.distanceFareVan[$scope.index].from;
                        $scope.to = $scope.distanceFareVan[$scope.index].to;
                        $scope.type = "VAN";
                        $scope.flag = 0;
                        break;
                    case 'waitFareVan':
                        $scope.from = $scope.waitFareVan[$scope.index].from;
                        $scope.to = $scope.waitFareVan[$scope.index].to;
                        $scope.type = "VAN";
                        $scope.flag = 1;
                        break;
                    case 'distanceFareTruck':
                        $scope.from = $scope.distanceFareTruck[$scope.index].from;
                        $scope.to = $scope.distanceFareTruck[$scope.index].to;
                        $scope.type = "TRUCK";
                        $scope.flag = 0;
                        break;
                    case 'waitFaretruck':
                        $scope.from = $scope.waitFaretruck[$scope.index].from;
                        $scope.to = $scope.waitFaretruck[$scope.index].to;
                        $scope.type = "TRUCK";
                        $scope.flag = 1;
                        break;
                    default: console.log("Default");
                }
                if($scope.to=="Above")
                    $scope.to = 1000000;
                $.post(MY_CONSTANT.url + 'api/admin/deletePricing',
                    {
                        accessToken: $cookieStore.get('obj').accesstoken,
                        vehicleType: $scope.type,
                        from: $scope.from,
                        to: $scope.to,
                        flag: $scope.flag
                    },
                    function (data) {
                        console.log(data)
                        $scope.list = data;
                        $scope.$apply();
                        $state.reload();
                    });

            };

            /**=========================================================
             * Module: Find active tab
             =========================================================*/
            $scope.tabNo = function(tabNo){
                console.log("In bike");
                var activeTab = {'tab': tabNo};
                $cookieStore.put('obj2', activeTab);
                console.log($cookieStore.get('obj2').tab)
            }
        });