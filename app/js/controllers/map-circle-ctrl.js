/**
 * Created by Vikas on 05/08/15.
 */

App.controller('MapCircleController', ['$scope','$state', '$timeout', '$http', 'uiGmapLogger','uiGmapGoogleMapApi', '$cookies', '$cookieStore', 'MY_CONSTANT','ngDialog'
    , function ($scope,$state, $timeout, $http, $log, GoogleMapApi, $cookies, $cookieStore, MY_CONSTANT,ngDialog) {

        var orderCount = 0;
        $scope.total_no_of_drivers = "";
        $scope.MapTitle = "Driver Name";
        $log.currentLevel = $log.LEVELS.debug;

        markerArr = new Array();
        markerCount = 0;
        var bound_val =0
        $scope.map = {
            zoom:3,
            center: new google.maps.LatLng(30.8857, 76.2599),
            pan : true,
            refresh: false,
            events: {},
            bounds: {}
        }
        $scope.mapContainer = new google.maps.Map(document.getElementById('map-container'), $scope.map);
        var infoWindow = new google.maps.InfoWindow();

        $scope.$on('$destroy',function() {
            clearInterval($scope.setinterval);
            $("#dashdatetimepicker").datetimepicker('hide');
            $("#dashdatetimepicker1").datetimepicker('hide');
            ngDialog.close();

        });

        $scope.setBounds = function(){
            if(bound_val==0){
                var bounds = new google.maps.LatLngBounds();
                for(var i=0;i<markerCount;i++) {
                    bounds.extend(markerArr[i].getPosition());
                }
                $scope.mapContainer.fitBounds(bounds);

            }
            return 1;
        }
        $scope.drawMap = function () {
            orderCount = 0;
            $http.get(MY_CONSTANT.url + 'api/admin/getLiveView/' + $cookieStore.get('obj').accesstoken)
                .success(function (response, status) {
                    if (status == 200) {
                        var dataArray = [];
                        var dataArray1 = [];
                        $scope.liveDriverList = response.data.driverDetailArray;
                        var liveDriverList = response.data.driverDetailArray;
                        $scope.liveDriverList = response.data.driverDetailArray;
                        console.log($scope.liveDriverList)
                        var liveOrderList = response.data.orderDetail;
                        var liveDriverStatusList = response.data.driverStatusArray;
                        var orderLength = response.data.orderDetail.length;
                        var driverLength = response.data.driverDetailArray.length;
                        $scope.total_no_of_drivers = driverLength;

                        /*================ Live driver info window===================*/
                        var defaultImg = 'app/img/default_user_icon.png';
                        liveDriverStatusList.forEach(function (column) {
                            var d = {};
                            d.driverId = column.driverId;
                            d.fullName = column.fullName;
                            d.phoneNumber = column.phoneNumber;
                            if(column.profilePicture == null)
                                d.profilePicture = defaultImg;
                            else
                                d.profilePicture = column.profilePicture;
                            if(column.status=='busy')
                                d.status = 0;
                            else
                                d.status = 1;
                            dataArray.push(d);
                        });
                        $scope.list = dataArray;

                        /*================  ongoing order table ===================*/
                        liveOrderList.forEach(function (column) {
                            var d = {};
                            d._id = column._id;
                            d.orderId = column.orderId;
                            d.driverId = column.driverId;
                            d.driverFullName = column.driverFullName;
                            d.dropUpAddress = column.dropUpAddress;
                            d.pickupAddress = column.pickupAddress;
                            var DATE = new Date(column.pickupTime);
                            d.pickupTime =  moment.utc(DATE.toString()).format("YYYY-MM-DD HH:mm");
                            var DATE = new Date(column.deliveryTime);
                            d.deliveryTime =  moment.utc(DATE.toString()).format("YYYY-MM-DD HH:mm");
                            d.status = column.status;
                            dataArray1.push(d);
                        });
                        $scope.orderList = dataArray1;
                        var dtInstance;
                        $timeout(function () {
                            if (!$.fn.dataTable) return;
                            dtInstance = $('#datatable2').dataTable({
                                'paging': true,  // Table pagination
                                'ordering': true,  // Column ordering
                                'info': true,  // Bottom left status text
                                'destroy': true,
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

                        /*================Calling Live driver marker set function===================*/
                        if (driverLength) {
                            liveDriverList.forEach(function (column) {
                                createMarker(column);
                                $scope.openInfoWindow = function (e, selectedMarker) {
                                    e.preventDefault();
                                    google.maps.event.trigger(selectedMarker, 'click');
                                }
                            });
                            $scope.mcOptions = {gridSize: 50, maxZoom: 20};

                            if ($scope.markerClusterer) {
                                $scope.markerClusterer.clearMarkers();   //clearing the markercluster to add new
                            }

                            $scope.markerClusterer = new MarkerClusterer($scope.mapContainer, markerArr, $scope.mcOptions);

                            //function to get lat long bounds according to marker position
                            bound_val = $scope.setBounds();
                        }
                        else {
                        }

                        /*================Calling marker set function for Live order pickup location===================*/
                        if (orderLength) {
                            liveOrderList.forEach(function (column) {
                                createMarker1(column);
                                $scope.openInfoWindow = function (e, selectedMarker) {
                                    e.preventDefault();
                                    google.maps.event.trigger(selectedMarker, 'click');
                                }

                            });
                            $scope.mcOptions = {gridSize: 50, maxZoom: 20};

                            if ($scope.markerClusterer) {
                                $scope.markerClusterer.clearMarkers();   //clearing the markercluster to add new
                            }

                            $scope.markerClusterer = new MarkerClusterer($scope.mapContainer, markerArr, $scope.mcOptions);

                            //function to get lat long bounds according to marker position
                            bound_val = $scope.setBounds();
                        }
                        else

                        /*================Calling marker set function for Live order drop off location===================*/
                        if (orderLength) {
                            liveOrderList.forEach(function (column) {
                                createMarker2(column);
                                $scope.openInfoWindow = function (e, selectedMarker) {
                                    e.preventDefault();
                                    google.maps.event.trigger(selectedMarker, 'click');
                                }
                            });
                            $scope.mcOptions = {gridSize: 50, maxZoom: 20};
                            if ($scope.markerClusterer) {
                                $scope.markerClusterer.clearMarkers();   //clearing the markercluster to add new
                            }
                            $scope.markerClusterer = new MarkerClusterer($scope.mapContainer, markerArr, $scope.mcOptions);
                            //function to get lat long bounds according to marker position
                            bound_val = $scope.setBounds();
                        }
                        else {

                        }
                    } else {
                        alert("Something went wrong, please try again later.");
                        return false;
                    }
                })
                .error(function (error) {
                    console.log(error);
                    $state.go('page.login');
                });
        };
        $scope.drawMap();

        /*================ Listing Reassignable  driver for  ongoing order ===================*/
        $scope.reAssignList = function(orderId,driverId,status){
            var list = $cookieStore.get('obj3').reassignedorderList;
            console.log(list)
            function isEmpty(obj) {
                for(var prop in obj) {
                    if(obj.hasOwnProperty(prop))
                        return false;
                }

                return true;
            }
            Object.size = function(obj) {
                var size = 0, key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) size++;
                }
                return size;
            };
            if(!isEmpty(list)) {
                var size = Object.size(list);
                for(i=0;i<size;i++) {
                    if(orderId == list[i]) {
                        ngDialog.open({
                            template: 'can_not_reassign_again',
                            className: 'ngdialog-theme-default',
                            scope: $scope,
                            showClose: true
                        });
                        return false;
                    }
                }
            }

            if(status == 'DRIVER_ASSIGNED' || status == 'SUCCESS' ||  status == 'REACHED_PICKUP_POINT' || status == 'REQUEST_SENT_TO_DRIVER' ||
                status == 'ACCEPTED' || status == 'REFUSED' || status == 'DRIVER_RESPONDED'){
                $scope.orderId = orderId;
                $http.get(MY_CONSTANT.url + 'api/admin/' + $cookieStore.get('obj').accesstoken + '/fetchNearestDrivers/' + orderId)
                    .success(function (response, status) {
                        if (status == 200) {
                            var dataArray = [];
                            var nearDriverList = response.data.results;
                            nearDriverList.forEach(function (column) {
                                if (column._id != driverId) {
                                    var d = {};
                                    d._id = column._id;
                                    d.fullName = column.fullName;
                                    d.isDedicated = column.isDedicated;
                                    dataArray.push(d);
                                }
                            });
                            $scope.nearDriverList = dataArray;
                            if ($scope.nearDriverList.length > 0) {
                                $scope.changedDriver = $scope.nearDriverList[0]._id;
                                ngDialog.open({
                                    template: 'display_driver_list',
                                    className: 'ngdialog-theme-default',
                                    scope: $scope,
                                    showClose: true
                                });
                            }
                            else{
                                ngDialog.open({
                                    template: 'display_no_driver',
                                    className: 'ngdialog-theme-default',
                                    scope: $scope,
                                    showClose: true
                                });
                            }
                        } else {
                            alert("Something went wrong, please try again later.");
                            return false;
                        }
                    })
                    .error(function (error) {
                        ngDialog.open({
                            template: 'display_no_driver',
                            className: 'ngdialog-theme-default',
                            scope: $scope,
                            showClose: true
                        });
                        console.log(error);
                    });
            }
            else{
                ngDialog.open({
                    template: 'can_not_reassign',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    showClose: true
                });
            }

        }

        $scope.changeDriver = function(i){
            $scope.changedDriver = $scope.nearDriverList[i-1]._id;
        }

        /*================ Reassigning driver for  ongoing order ===================*/
        $scope.reAssign = function() {
            var reassignedorderList = [];
            reassignedorderList.push($scope.orderId)
            console.log("Lenth = "+reassignedorderList);
            reassignedorderList = {'reassignedorderList': reassignedorderList}
            $cookieStore.put('obj3', reassignedorderList);
            console.log("Cookie Result = "+$cookieStore.get('obj3').reassignedorderList);
            $http({
                method: 'POST',
                url: MY_CONSTANT.url + 'api/admin/orderAssignDriver',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {accessToken: $cookieStore.get('obj').accesstoken, orderId: $scope.orderId, driverId: $scope.changedDriver}

            })
                .success(function (response, status) {
                    ngDialog.open({
                        template: 'display_reAssign_msg',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        showClose: true,
                        closeByDocument: false
                    });
                })
                .error(function (response, status) {
                    console.log(response);
                    alert("Oops driver not assigned.");
                })
        }

        $scope.collapse  = function(){
            console.log("called")
            $("#sidebar").animate({
                width: 'toggle'
            });
            var value = $("#map")[0].style.width !== "100vw" ? '115vw' : '110vw';
            $("#map").animate({
                width: value
            }, {step:function(){
                google.maps.event.trigger(map,'resize');
            }
            });
        }

/*        function move(column) {
            var marker =  new google.maps.Marker({
                position: new google.maps.LatLng(column.longitude, column.latitude),
                labelContent: '<span style="color: #F7584B">' +  +'</span>',
                map: $scope.mapContainer
            });
            var oldLat = $scope.liveDriverList[markerCount].longitude;
            var oldLng = $scope.liveDriverList[markerCount].latitude;
            var numDeltas = 50;
            var delay = 10; //milliseconds
            var i = 0;
            var lat;
            var lng;
            var deltaLat, deltaLng;

            transition();
            function transition() {
                i = 0;
                lat = column.longitude;
                lng = column.latitude;
                console.log("first old = ",oldLat);
                deltaLat = (lat - oldLat) / numDeltas;
                deltaLng = (lng - oldLng) / numDeltas;
                console.log("delta = ",deltaLat, deltaLng)
                //if(deltaLat != 0 || deltaLng != 0){
                    moveMarker();
                    markerCount++;
                //}
                //else {
                //    console.log("createMarker")
                //    createMarker(column);
                //}

            }

            function moveMarker() {
                oldLat += deltaLat;
                oldLng += deltaLng;
                console.log("last values = ",oldLat);
                console.log("i = ",i);
                marker.setPosition(new google.maps.LatLng(oldLat, oldLng));
                if ( i != numDeltas) {
                    //console.log("i = ",i);
                    i++;
                    //moveMarker();
                    setTimeout(moveMarker,delay);
                }
            }
        }*/

        $scope.drawMap1 = function () {
            orderCount = 0;
            $http.get(MY_CONSTANT.url + 'api/admin/getLiveView/' + $cookieStore.get('obj').accesstoken)
                .success(function (response, status) {
                    if (status == 200) {
                        var dataArray = [];
                        var dataArray1 = [];
                        $scope.liveDriverList = response.data.driverDetailArray;
                        var liveDriverList = response.data.driverDetailArray;
                        var liveOrderList = response.data.orderDetail;
                        var liveDriverStatusList = response.data.driverStatusArray;
                        var orderLength = response.data.orderDetail.length;
                        var driverLength = response.data.driverDetailArray.length;
                        $scope.total_no_of_drivers = driverLength;
                        /*================Calling Live driver marker set function===================*/
                        if (driverLength) {
                            liveDriverList.forEach(function (column) {
                                //marker.setPosition(new google.maps.LatLng(column.latitude, column.longitude));
                                //move(column);
                                createMarker(column);
                                $scope.openInfoWindow = function (e, selectedMarker) {
                                    e.preventDefault();
                                    google.maps.event.trigger(selectedMarker, 'click');
                                }
                            });
                            $scope.mcOptions = {gridSize: 50, maxZoom: 20};

                            if ($scope.markerClusterer) {
                                $scope.markerClusterer.clearMarkers();   //clearing the markercluster to add new
                            }

                            $scope.markerClusterer = new MarkerClusterer($scope.mapContainer, markerArr, $scope.mcOptions);

                            //function to get lat long bounds according to marker position
                            bound_val = $scope.setBounds();
                        }
                        else {
                        }

                    } else {
                        alert("Something went wrong, please try again later.");
                        return false;
                    }
                })
                .error(function (error) {
                    console.log(error);
                    $state.go('page.login');
                });
        };

        /********************************************************************
         ================ Setting marker for Live driver ===================
         ********************************************************************/

        var createMarker = function (info) {
            var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(info.longitude, info.latitude),
                labelContent: '<span style="color: #F7584B">' + info.fullName +'</span>',
                map: $scope.mapContainer
            });

            marker.content = '<div class="infoWindowContent">' +
            '<center>Driver Info</center>' +
            '<span> Name - ' + info.fullName + '</span><br>' +
            '<span> Phone - ' + info.phoneNumber + '</span><br>' +
            '<span> Email - ' + info.email + '</span>' +
            '</div>';


            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent(marker.content);
                infoWindow.open($scope.mapContainer, marker);
            });

            markerArr.push(marker);
            markerCount = markerCount + 1;

        }

        /*================Setting marker for Live order pick up location===================*/
        var createMarker1 = function (info) {
            var icon = 'app/img/map_icon.png';
            orderCount++;
            var marker = new MarkerWithLabel({
                icon: icon,
                position: new google.maps.LatLng(info.pickupLat, info.pickupLong),
                labelContent: '<span style="color: #F7584B">' + orderCount +'</span>',
                map: $scope.mapContainer
            });

            marker.content = '<div class="infoWindowContent">' +
            '<center>Order Info</center>' +
            '<span> Order Id - ' + info.orderId + '</span><br>' +
            '<span> Driver Name - ' + info.driverFullName + '</span><br>' +
            '<span> Pick Up Address - ' + info.pickupAddress + '</span><br>' +
            '<span> Drop Off Address - ' + info.dropUpAddress + '</span><br>' +
            '<span> Status - ' + info.status + '</span>' +
            '</div>';

            google.maps.event.addListener(marker, 'click', function () {
               // console.log(marker)
                infoWindow.setContent(marker.content);
                infoWindow.open($scope.mapContainer, marker);
            });
            markerArr.push(marker);
            markerCount = markerCount + 1;
        }

        /********************************************************************
        ================ Edit Timings for  ongoing order ===================
         ********************************************************************/

        $scope.editTimings = function (_id,pickupTime,deliveryTime) {
            $scope.pickup = pickupTime;
            $scope.delivery = deliveryTime;
            $scope.orderId = _id;
            console.log(_id);
            ngDialog.open({
                template: 'edit_timings',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false
            });


            $scope.$on('ngDialog.opened', function (e, element) {
                $("#dashdatetimepicker").datetimepicker({
                    format: 'yyyy/mm/dd hh:ii',

                    autoclose: true
                    //startDate: start
                    //endDate: e
                });
            });
            $scope.$on('ngDialog.opened', function (e, element) {
                $("#dashdatetimepicker1").datetimepicker({
                    format: 'yyyy/mm/dd hh:ii',

                    autoclose: true
                    //startDate: start
                    //endDate: e
                });
            });
        }

        $scope.edit = function(){
            var DATE = new Date($("#dashdatetimepicker").val());
            console.log(moment.utc(DATE).format("YYYY-MM-DD HH:mm"));
            $scope.pickup = moment.utc(DATE).format("YYYY-MM-DD HH:mm");
            var DATE = new Date($("#dashdatetimepicker1").val());
            console.log(moment.utc(DATE).format("YYYY-MM-DD HH:mm"));
            $scope.delivery = moment.utc(DATE).format("YYYY-MM-DD HH:mm");
            $http({
                method: 'PUT',
                url: MY_CONSTANT.url + 'api/admin/editOrderTiming',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {accessToken: $cookieStore.get('obj').accesstoken, orderId: $scope.orderId, pickUpTime: $scope.pickup+":00 +0000", dropUpTime: $scope.delivery+":00 +0000"}
            })
                .success(function (response, status) {
                    console.log(response);
                    $state.reload();
                })
                .error(function (response, status) {
                    console.log(response);
                    alert("Oops not updated.");
                })
        }

        $scope.setinterval= setInterval(function(){
          /*  $scope.$on('$destroy', function () {
                dtInstance.fnDestroy();
                $('[class*=ColVis]').remove();
            })*/
            markerArr = [];    //empty the markerArray to refresh the map
            markerCount = 0;
            $scope.drawMap1();
        }, 10000);

    }]);