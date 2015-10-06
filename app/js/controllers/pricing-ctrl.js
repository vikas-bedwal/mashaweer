/**
 * Created by Vikas on 31/07/15.
 */

    App.controller('pricingController',
        function($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout, $filter, editableOptions, editableThemes, $q,$state,ngDialog) {
            // editable row
            // -----------------------------------
            $scope.distanceFareBike = [];
            $scope.distanceFareVan = [];
            $scope.distanceFareTruck = [];
            $scope.waitFareBike = [];
            $scope.waitFareVan = [];
            $scope.waitFareTruck = [];
            $scope.fromLimit = '';
            var waitFareBike = '';
            $scope.bikeBasePrice = 11;
            $scope.vanBasePrice = 71;
            $scope.truckBasePrice = 121;

            $http.get(MY_CONSTANT.url + 'api/admin/pricingInfo/' + $cookieStore.get('obj').accesstoken)
                .success(function (response, status) {
                    if (status == 200) {

                       /* ----------------Bike Fare List-----------*/
                        if(response.data.bikePricingInfo.length) {
                            var dataArray = [];
                            var distanceFareBike = response.data.bikePricingInfo[0].distancePricing;
                            $scope.distanceFareBike = distanceFareBike;
                            if(distanceFareBike.length){
                                $scope.fromLimitBike = distanceFareBike[distanceFareBike.length-1].to;
                            }

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
                            $scope.waitFareBike = waitFareBike;
                            if(waitFareBike.length){
                                $scope.waitfromLimitBike = waitFareBike[waitFareBike.length-1].to;
                            }
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
                            var dataArray = [];
                            var distanceFareVan = response.data.vanPricingInfo[0].distancePricing;
                            $scope.distanceFareVan = distanceFareVan;
                            if(distanceFareVan.length){
                                $scope.fromLimitVan = distanceFareVan[distanceFareVan.length-1].to;
                            }
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
                            $scope.waitFareVan = waitFareVan;
                            if(waitFareVan.length){
                                $scope.waitfromLimitVan = waitFareVan[waitFareVan.length-1].to;
                            }
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
                            var dataArray = [];
                            var distanceFareTruck = response.data.truckPricingInfo[0].distancePricing;
                            $scope.distanceFareTruck = distanceFareTruck;
                            if(distanceFareTruck.length){
                                $scope.fromLimitTruck = distanceFareTruck[distanceFareTruck.length-1].to;
                            }
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
                            var waitFareTruck = response.data.truckPricingInfo[0].waitTimePricing;
                            $scope.waitFareTruck = waitFareTruck;
                            if(waitFareTruck.length){
                                $scope.waitfromLimitTruck = waitFareTruck[waitFareTruck.length-1].to;
                            }
                            waitFareTruck.forEach(function (column) {
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
                            $scope.waitFareTruck = dataArray;
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

            $scope.saveUser = function(data,id) {
                if(id == undefined){
                    if(data.from <= $scope.fromLimit || data.from >= data.to){
                        $scope.type = "Send in error part of hit";
                    }
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
                }


                else{
                    if(isNaN(parseInt(data.to)))
                        data.to = 1000000;
                    if(data.from <= $scope.toLimit || data.to <= data.from || data.to >= $scope.fromLimit){
                        $scope.type = "Send in error part of hit";
                    }
                    $http({
                        url: MY_CONSTANT.url + 'api/admin/editPricing',
                        method: "POST",
                        data: { accessToken: $cookieStore.get('obj').accesstoken,
                            _id: id,
                            vehicleType: $scope.type,
                            from: data.from.toString(),
                            to: data.to.toString(),
                            fareCharge: data.fareCharge.toString(),
                            flag: $scope.flag
                        }
                    })
                        .then(function(response) {
                            $scope.list = response;
                            $state.reload();
                        },
                        function(response) { // optional
                            ngDialog.open({
                                template: 'display_failure_validation_msg',
                                className: 'ngdialog-theme-default',
                                scope: $scope,
                                showClose: false
                            });
                            // failed
                        });
                }
            };

            $scope.editRow = function(type,index){
                switch(type) {
                    case 'distanceFareBike':
                        $scope.type = "BIKE";
                        $scope.flag = 0;
                     if(index == 0 && $scope.distanceFareBike.length == 1 ){
                         $scope.toLimit = -1;
                         $scope.fromLimit = 1000001;
                    }
                     else if(index==0){
                            $scope.toLimit = -1;
                            $scope.fromLimit = $scope.distanceFareBike[index+1].from;
                        }
                        else if(index == $scope.distanceFareBike.length-1){
                            $scope.toLimit = $scope.distanceFareBike[index-1].to;
                            $scope.fromLimit = 1000001;
                        }
                        else{
                            $scope.toLimit = $scope.distanceFareBike[index-1].to;
                            $scope.fromLimit = $scope.distanceFareBike[index+1].from;
                        }
                        break;
                    case 'waitFareBike':
                        $scope.type = "BIKE";
                        $scope.flag = 1;
                        if(index == 0 && $scope.waitFareBike.length == 1 ){
                            $scope.toLimit = -1;
                            $scope.fromLimit = 1000001;
                        }
                        else if(index==0){
                            $scope.toLimit = -1;
                            $scope.fromLimit = $scope.waitFareBike[index+1].from;
                        }
                        else if(index == $scope.waitFareBike.length-1){
                            $scope.toLimit = $scope.waitFareBike[index-1].to;
                            $scope.fromLimit = 1000001;
                        }
                        else{
                            $scope.toLimit = $scope.waitFareBike[index-1].to;
                            $scope.fromLimit = $scope.waitFareBike[index+1].from;
                        }
                        break;
                    case 'distanceFareVan':
                        $scope.type = "VAN";
                        $scope.flag = 0;
                        if(index == 0 && $scope.distanceFareVan.length == 1 ){
                            $scope.toLimit = -1;
                            $scope.fromLimit = 1000001;
                        }
                        else if(index==0){
                            $scope.toLimit = -1;
                            $scope.fromLimit = $scope.distanceFareVan[index+1].from;
                        }
                        else if(index == $scope.distanceFareVan.length-1){
                            $scope.toLimit = $scope.distanceFareVan[index-1].to;
                            $scope.fromLimit = 1000001;
                        }
                        else{
                            $scope.toLimit = $scope.distanceFareVan[index-1].to;
                            $scope.fromLimit = $scope.distanceFareVan[index+1].from;
                        }
                        break;
                    case 'waitFareVan':
                        $scope.type = "VAN";
                        $scope.flag = 1;
                        if(index == 0 && $scope.waitFareVan.length == 1 ){
                            $scope.toLimit = -1;
                            $scope.fromLimit = 1000001;
                        }
                        else if(index==0){
                            $scope.toLimit = 0;
                            $scope.fromLimit = $scope.waitFareVan[index+1].from;
                        }
                        else if(index == $scope.waitFareVan.length-1){
                            $scope.toLimit = $scope.waitFareVan[index-1].to;
                            $scope.fromLimit = 1000001;
                        }
                        else{
                            $scope.toLimit = $scope.waitFareVan[index-1].to;
                            $scope.fromLimit = $scope.waitFareVan[index+1].from;
                        }
                        break;
                    case 'distanceFareTruck':
                        $scope.type = "TRUCK";
                        $scope.flag = 0;
                        if(index == 0 && $scope.distanceFareTruck.length == 1){
                            $scope.toLimit = -1;
                            $scope.fromLimit = 1000001;
                        }
                        else if(index==0){
                            $scope.toLimit = -1;
                            $scope.fromLimit = $scope.distanceFareTruck[index+1].from;
                        }
                        else if(index == $scope.distanceFareTruck.length-1){
                            $scope.toLimit = $scope.distanceFareTruck[index-1].to;
                            $scope.fromLimit = 1000001;
                        }
                        else{
                            $scope.toLimit = $scope.distanceFareTruck[index-1].to;
                            $scope.fromLimit = $scope.distanceFareTruck[index+1].from;
                        }
                        break;
                    case 'waitFareTruck':
                        $scope.type = "TRUCK";
                        $scope.flag = 1;
                        if(index == 0 && $scope.waitFareTruck.length == 1){
                            $scope.toLimit = -1;
                            $scope.fromLimit = 1000001;
                        }
                        else if(index==0 && $scope.waitFareTruck.length > 1){
                            $scope.toLimit = -1;
                            $scope.fromLimit = $scope.waitFareTruck[index+1].from;
                        }
                        else if(index == $scope.waitFareTruck.length-1 && $scope.waitFareTruck.length > 1){
                            $scope.toLimit = $scope.waitFareTruck[index-1].to;
                            $scope.fromLimit = 1000001;
                        }
                        else{
                            $scope.toLimit = $scope.waitFareTruck[index-1].to;
                            $scope.fromLimit = $scope.waitFareTruck[index+1].from;
                        }
                        break;
                    default: console.log("Default");
                }
            }


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
                            $scope.fromLimit = $scope.fromLimitBike;
                            break;
                        case 'waitFareBike':
                            $scope.waitFareBike.push($scope.inserted);
                            $scope.type = "BIKE";
                            $scope.flag = 1;
                            $scope.fromLimit = $scope.waitfromLimitBike;
                            break;
                        case 'distanceFareVan':
                            $scope.distanceFareVan.push($scope.inserted);
                            $scope.type = "VAN";
                            $scope.flag = 0;
                            $scope.fromLimit = $scope.fromLimitVan;
                            break;
                        case 'waitFareVan':
                            $scope.waitFareVan.push($scope.inserted);
                            $scope.type = "VAN";
                            $scope.flag = 1;
                            $scope.fromLimit = $scope.waitfromLimitVan;
                            break;
                        case 'distanceFareTruck':
                            $scope.distanceFareTruck.push($scope.inserted);
                            $scope.type = "TRUCK";
                            $scope.flag = 0;
                            $scope.fromLimit = $scope.fromLimitTruck;
                            break;
                        case 'waitFareTruck':
                            $scope.waitFareTruck.push($scope.inserted);
                            $scope.type = "TRUCK";
                            $scope.flag = 1;
                            $scope.fromLimit = $scope.waitfromLimitTruck;
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
                    case 'waitFareTruck':
                        $scope.from = $scope.waitFareTruck[$scope.index].from;
                        $scope.to = $scope.waitFareTruck[$scope.index].to;
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
                        $scope.list = data;
                        $scope.$apply();
                        $state.reload();
                    });

            };

            /**=========================================================
             * Module: Find active tab
             =========================================================*/
            $scope.tabNo = function(tabNo){
                var activeTab = {'tab': tabNo};
                $cookieStore.put('obj2', activeTab);
            }
        });