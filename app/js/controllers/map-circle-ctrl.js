/**
 * Created by Vikas on 05/08/15.
 */

App.controller('MapCircleController', ['$scope', '$timeout', '$http', 'uiGmapLogger', 'uiGmapGoogleMapApi', '$cookies', '$cookieStore', 'MY_CONSTANT'
    , function ($scope, $timeout, $http, $log, GoogleMapApi, $cookies, $cookieStore, MY_CONSTANT) {

        $log.currentLevel = $log.LEVELS.debug;

        var center = {
            latitude: "30.7333148",
            longitude: "76.7794179"
        };

        $scope.map = {
            center: center,
            pan: true,
            zoom: 3,
            refresh: false,
            events: {},
            bounds: {}
        };

        $scope.total_no_of_drivers = "";
        $scope.MapTitle = "Driver Name";

        markerArr = new Array();
        markerCount = 0;
        var bound_val =0

        $scope.map = {
            zoom:3,
            center: new google.maps.LatLng(30.8857, 76.2599),
            pan : true
        }
        $scope.mapContainer = new google.maps.Map(document.getElementById('map-container'), $scope.map);
        var infoWindow = new google.maps.InfoWindow();


        /*================Setting marker for Live driver===================*/
        var createMarker = function (info) {
            var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(info.latitude, info.longitude),
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
            var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(info.pickupLat, info.pickupLong),
                map: $scope.mapContainer
            });

            marker.content = '<div class="infoWindowContent">' +
            '<center>Driver Info</center>' +
            '<span> Address - ' + info.driverFullName + '</span><br>' +
            '<span> Drop Off Address - ' + info.dropUpAddress + '</span><br>' +
            '<span> Phone - ' + info.pickupPhoneNo + '</span><br>' +
            '<span> Status - ' + info.status + '</span>' +
            '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent(marker.content);
                infoWindow.open($scope.mapContainer, marker);
            });
            markerArr.push(marker);
            markerCount = markerCount + 1;
        }

        /*================Setting marker for Live order drop off location===================*/
        var createMarker2 = function (info) {
            var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(info.dropUpLat, info.dropUpLong),
                map: $scope.mapContainer
            });

            marker.content = '<div class="infoWindowContent">' +
            '<center>Driver Info</center>' +
            '<span> Address - ' + info.driverFullName + '</span><br>' +
            '<span> Pick Up Address - ' + info.pickupAddress + '</span><br>' +
            '<span> Phone - ' + info.dropUpPhoneNo + '</span><br>' +
            '<span> Status - ' + info.status + '</span>' +
            '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent(marker.content);
                infoWindow.open($scope.mapContainer, marker);
            });
            markerArr.push(marker);
            markerCount = markerCount + 1;
        }

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
            $http.get(MY_CONSTANT.url + 'api/admin/getLiveView/' + $cookieStore.get('obj').accesstoken)
                .success(function (response, status) {
                    console.log(response);
                    if (status == 200) {
                        var dataArray = [];
                        var dataArray1 = [];
                        var liveDriverList = response.data.driverDetailArray;
                        var liveOrderList = response.data.orderDetail;
                        var liveDriverStatusList = response.data.driverStatusArray;

                        var orderLength = response.data.orderDetail.length;
                        var driverLength = response.data.driverDetailArray.length;
                        $scope.total_no_of_drivers = driverLength;


                        /*================ Live driver info window===================*/
                        liveDriverStatusList.forEach(function (column) {
                            var d = {};
                            d.driverId = column.driverId;
                            d.fullName = column.fullName;
                            d.phoneNumber = column.phoneNumber;
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
                            d.driverFullName = column.driverFullName;
                            d.dropUpAddress = column.dropUpAddress;
                            d.pickupAddress = column.pickupAddress;
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
/*
                        $scope.$on('$destroy', function () {
                            dtInstance.fnDestroy();
                            $('[class*=ColVis]').remove();
                        })*/

                        /*================ Reassigning driver for  ongoing order ===================*/
                        $scope.reAssign = function(){

                        }


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
                        else {

                        }


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
                });
        };

        $scope.drawMap();

      /*  $scope.setinterval= setInterval(function(){
            $scope.$on('$destroy', function () {
                dtInstance.fnDestroy();
                $('[class*=ColVis]').remove();
            })
            markerArr = [];    //empty the markerArray to refresh the map
            markerCount = 0;

            $scope.drawMap();
        }, 500000);*/


    }]);