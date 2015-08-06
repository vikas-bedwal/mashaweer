/**
 * Created by Vikas on 31/07/15.
 */

    /**=========================================================
     * Module: demo-buttons.js
     * Provides a simple demo for buttons actions
     =========================================================*/

    App.controller('pricingController',
        function($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout, $filter, editableOptions, editableThemes, $q,$state) {
            console.log("In pricing");
            // editable row
            // -----------------------------------
            $scope.distanceFareBike = [];
            $scope.distanceFareVan = [];
            $scope.distanceFareTruck = [];
            $scope.waitFareBike = [];
            $scope.waitFareVan = [];
            $scope.waitFareTruck = [];

            $scope.bike = function(){
                console.log("In bike");
            }


            $http.get(MY_CONSTANT.url + 'api/admin/pricingInfo/' + $cookieStore.get('obj').accesstoken)
                .success(function (response, status) {
                    if (status == 200) {


                       /* ----------------Bike Fare List-----------*/
                        if(response.data.bikePricingInfo.length) {
                            console.log("bike");
                            var distanceFareBike = response.data.bikePricingInfo[0].distancePricing;
                            distanceFareBike.forEach(function (column) {
                                var d = {};
                                d._id = column._id;
                                d.from = column.from;
                                d.to = column.to;
                                d.fareCharge = column.fareCharge;
                            });
                            $scope.distanceFareBike = distanceFareBike;

                            var waitFareBike = response.data.bikePricingInfo[0].waitTimePricing;
                            waitFareBike.forEach(function (column) {
                                var d = {};
                                d._id = column._id;
                                d.from = column.from;
                                d.to = column.to;
                                d.fareCharge = column.fareCharge;
                            });
                            $scope.waitFareBike = waitFareBike;
                        }
                        /* ----------------Van Fare List-----------*/
                        if(response.data.vanPricingInfo.length) {
                            console.log("van");

                            var distanceFareVan = response.data.vanPricingInfo[0].distancePricing;
                            distanceFareVan.forEach(function (column) {
                                var d = {};
                                d._id = column._id;
                                d.from = column.from;
                                d.to = column.to;
                                d.fareCharge = column.fareCharge;
                            });
                            $scope.distanceFareVan = distanceFareVan;

                            var waitFareVan = response.data.vanPricingInfo[0].waitTimePricing;

                            waitFareVan.forEach(function (column) {
                                var d = {};
                                d._id = column._id;
                                d.from = column.from;
                                d.to = column.to;
                                d.fareCharge = column.fareCharge;

                            });
                            $scope.waitFareVan = waitFareVan;
                        }
                        /* ----------------Van Fare List-----------*/
                        if(response.data.truckPricingInfo.length) {
                            console.log("truck");
                            var distanceFareTruck = response.data.truckPricingInfo[0].distancePricing;

                            distanceFareTruck.forEach(function (column) {
                                var d = {};
                                d._id = column._id;
                                d.from = column.from;
                                d.to = column.to;
                                d.fareCharge = column.fareCharge;
                            });
                            $scope.distanceFareTruck = distanceFareTruck;

                            var waitFaretruck = response.data.truckPricingInfo[0].waitTimePricing;
                            waitFaretruck.forEach(function (column) {
                                var d = {};
                                d._id = column._id;
                                d.from = column.from;
                                d.to = column.to;
                                d.fareCharge = column.fareCharge;
                            });
                            $scope.waitFaretruck = waitFaretruck;
                        }

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


            $scope.users = [
                {id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
                {id: 2, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
                {id: 3, name: 'awesome user3', status: 2, group: null}
            ];

            $scope.statuses = [
                {value: 1, text: 'status1'},
                {value: 2, text: 'status2'},
                {value: 3, text: 'status3'},
                {value: 4, text: 'status4'}
            ];

            $scope.groups = [];
            $scope.loadGroups = function() {
                return $scope.groups.length ? null : $http.get('server/xeditable-groups.json').success(function(data) {
                    $scope.groups = data;
                });
            };

            $scope.showGroup = function(user) {
                if(user.group && $scope.groups.length) {
                    var selected = $filter('filter')($scope.groups, {id: user.group});
                    return selected.length ? selected[0].text : 'Not set';
                } else {
                    return user.groupName || 'Not set';
                }
            };

            $scope.showStatus = function(user) {
                var selected = [];
                if(user.status) {
                    selected = $filter('filter')($scope.statuses, {value: user.status});
                }
                return selected.length ? selected[0].text : 'Not set';
            };

            $scope.checkName = function(data, id) {
                if (id === 2 && data !== 'awesome') {
                    return "Username 2 should be `awesome`";
                }
            };

            $scope.saveUser = function(data) {
                $.post(MY_CONSTANT.url + 'api/admin/addPricing',
                 {
                 accessToken: $cookieStore.get('obj').accesstoken,
                 vehicleType: $scope.type,
                     from: data.from,
                     to: data.to,
                     fareCharge: data.fareCharge,
                     flag: $scope.flag
                 },
                 function (data) {
                 console.log(data)
                 $scope.list = data;
                 $scope.$apply();
                 $state.reload();
                 });



                //$scope.user not updated yet
               /* angular.extend(data, {from: row.from,to:row.to,fareCharge:row.fareCharge});
                console.log('Saving user: ' + row);
                console.log(data);*/
                // return $http.post('/saveUser', data);
            };

            // remove user
            $scope.removeUser = function(index,type,flag) {
                console.log(index);
                console.log(type);
                console.log(flag);
                console.log($scope.distanceFareBike[index]);

                $.post(MY_CONSTANT.url + 'api/admin/deletePricing',
                    {
                        accessToken: $cookieStore.get('obj').accesstoken,
                        vehicleType: type,
                        from: $scope.distanceFareBike[index].from,
                        to: $scope.distanceFareBike[index].to,
                        flag: flag
                    },
                    function (data) {
                        console.log(data)
                        $scope.list = data;
                        $scope.$apply();
                        $state.reload();
                    });
            };

            // -----------------Add row for Fare List------------------------
            $scope.addRow = function(type) {
                    /*$.post(MY_CONSTANT.url + 'api/admin/addPricing',
                        {
                            accessToken: $cookieStore.get('obj').accesstoken,
                            vehicleType: '"VAN"',
                            priceFrom: 5,
                            priceTo: 55,
                            priceCharge: 155,
                            waitFrom: 5,
                            waitTo: 75,
                            waitCharge: 95
                        },
                        function (data) {
                            console.log(data)
                            $scope.list = data;
                            $scope.$apply();
                            $state.reload();
                        });*/
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

            // editable column
            // -----------------------------------


            $scope.saveColumn = function(column) {
                console.log("Check");
                console.log($scope.type)
                var results = [];
                angular.forEach($scope.users, function(user) {
                    // results.push($http.post('/saveColumn', {column: column, value: user[column], id: user.id}));
                    console.log('Saving column: ' + column);
                });
                return $q.all(results);
            };

            // editable table
            // -----------------------------------

            // filter users to show
            $scope.filterUser = function(user) {
                return user.isDeleted !== true;
            };

            // mark user as deleted
            $scope.deleteUser = function(id) {
                var filtered = $filter('filter')($scope.users, {id: id});
                if (filtered.length) {
                    filtered[0].isDeleted = true;
                }
            };

            // cancel all changes
            $scope.cancel = function() {
                for (var i = $scope.users.length; i--;) {
                    var user = $scope.users[i];
                    // undelete
                    if (user.isDeleted) {
                        delete user.isDeleted;
                    }
                    // remove new
                    if (user.isNew) {
                        $scope.users.splice(i, 1);
                    }
                }
            };

            // save edits
            $scope.saveTable = function() {
                var results = [];
                for (var i = $scope.users.length; i--;) {
                    var user = $scope.users[i];
                    // actually delete user
                    if (user.isDeleted) {
                        $scope.users.splice(i, 1);
                    }
                    // mark as not new
                    if (user.isNew) {
                        user.isNew = false;
                    }
                    // send on server
                    // results.push($http.post('/saveUser', user));
                    console.log('Saving Table...');
                }

                return $q.all(results);
            };

        });