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
            zoom: 13,
            refresh: false,
            events: {},
            bounds: {}
        };

        //$scope.map.markers2 = [{
        //    id: "1",
        //    latitude: "30.718789",
        //    longitude: "76.810155",
        //    showWindow: false,
        //    options: {
        //        labelContent: "",
        //        labelAnchor: "22 0",
        //        labelClass: "marker-labels",
        //        title: "Admin"
        //    }
        //
        //}];

        $scope.total_no_of_drivers = "";
        $scope.MapTitle = "Driver Name";

        markerArr = new Array();
        markerCount = 0;
        var bound_val =0

        $scope.map = {
            zoom:10,
            center: new google.maps.LatLng(30.8857, 76.2599),
            pan : true
        }
        $scope.mapContainer = new google.maps.Map(document.getElementById('map-container'), $scope.map);
        var infoWindow = new google.maps.InfoWindow();

        var createMarker = function (info) {


            //d.fullName = column.fullName;
            //d.isOnline = column.isOnline;
            //d.latitude = column.latitude
            //d.longitude = column.longitude;
            //d.profilePicture = column.profilePicture;


            var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(info.latitude, info.longitude),
                map: $scope.mapContainer
            });

            marker.content = '<div class="infoWindowContent">' +
            '<center>Driver Info</center>' +
            '<span> Name - ' + info.fullName + '</span><br>' +
            '<span> Phone - ' + info.fullName + '</span><br>' +
            '<span> Email - ' + info.fullName + '</span>' +
            '</div>';


            google.maps.event.addListener(marker, 'click', function () {
                console.log(marker.content);
                infoWindow.setContent(marker.content);
                infoWindow.open($scope.mapContainer, marker);
            });

            markerArr.push(marker);
            markerCount = markerCount + 1;

        }



        var createMarker1 = function (info) {
            var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(info.pickupLat, info.pickupLong),
                map: $scope.mapContainer
            });

            marker.content = '<div class="infoWindowContent">' +
            '<center>Driver Info</center>' +
            '<span> Name - ' + info.pickupAddress + '</span><br>' +
            '<span> Phone - ' + info.pickupAddress + '</span><br>' +
            '<span> Email - ' + info.pickupAddress + '</span>' +
            '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                console.log(marker.content);
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
                    if (status == 200) {
                        console.log(response);
                        var dataArray = [];
                        var liveDriverList = response.data.driverDetailArray;
                        var liveOrderList = response.data.orderDetail;

                        var orderLength = response.data.orderDetail.length;
                        var driverLength = response.data.driverDetailArray.length;
                        $scope.total_no_of_drivers = driverLength;

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


                        //liveDriverList.forEach(function (column) {
                        //    var d = {};
                        //    d.fullName = column.fullName;
                        //    d.isOnline = column.isOnline;
                        //    d.latitude = column.latitude
                        //    d.longitude = column.longitude;
                        //    d.profilePicture = column.profilePicture;
                        //    dataArray.push(d);
                        //});
                        //$scope.list = dataArray;
                        //var dtInstance;
                        //$timeout(function () {
                        //    if (!$.fn.dataTable) return;
                        //    dtInstance = $('#datatable2').dataTable({
                        //        'paging': true,  // Table pagination
                        //        'ordering': true,  // Column ordering
                        //        'info': true,  // Bottom left status text
                        //        oLanguage: {
                        //            sSearch: 'Search all columns:',
                        //            sLengthMenu: '_MENU_ records per page',
                        //            info: 'Showing page _PAGE_ of _PAGES_',
                        //            zeroRecords: 'Nothing found - sorry',
                        //            infoEmpty: 'No records available',
                        //            infoFiltered: '(filtered from _MAX_ total records)'
                        //        },
                        //        "pageLength": 50
                        //    });
                        //    var inputSearchClass = 'datatable_input_col_search';
                        //    var columnInputs = $('tfoot .' + inputSearchClass);
                        //
                        //    // On input keyup trigger filtering
                        //    columnInputs
                        //        .keyup(function () {
                        //            dtInstance.fnFilter(this.value, columnInputs.index(this));
                        //        });
                        //});
                        //$scope.$on('$destroy', function () {
                        //    dtInstance.fnDestroy();
                        //    $('[class*=ColVis]').remove();
                        //});


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

        $scope.setinterval= setInterval(function(){

            markerArr = [];    //empty the markerArray to refresh the map
            markerCount = 0;

            $scope.drawMap();
        }, 400000);


    }]);

























/*        $.post(MY_CONSTANT.url + '/get_technician_location', {
            access_token: $cookieStore.get('obj').accesstoken
        }, function (response) {
            //console.log("MAP DATA");
            //console.log(response);
            //if (response.status = responseCode.SUCCESS) {
            var data = response.data;
            var markerAddresses = [];
            //var driverData = data.driver_data;
            data.forEach(function (column, index) {
                var markerAddress = {
                    latitude: "",
                    longitude: "",
                    name: ""
                };

                markerAddress.latitude = column.mailing_address_latitude;
                markerAddress.longitude = column.mailing_address_longitude;
                markerAddress.name = column.first_name;
                markerAddress.id = index;

                markerAddresses.push(markerAddress);
            });
            //$scope.mapLoading = false;
            var center = {
                latitude: data[0].mailing_address_latitude,
                longitude: data[0].mailing_address_longitude
            };

            $scope.map = {
                center: center,
                pan: true,
                zoom: 14,
                refresh: false,
                events: {},
                bounds: {}
            };
            $scope.map.markers2 = markerAddresses;
            //zconsole.log($scope.map.markers2);
        });*/

        /*             var map = new google.maps.Map(document.getElementById('map'), {
         zoom: 12,
         // center: new google.maps.LatLng(-33.92, 151.25),
         center: new google.maps.LatLng(30.8857, 76.2599),
         mapTypeId: google.maps.MapTypeId.ROADMAP
         });

         var infowindow = new google.maps.InfoWindow();

         var marker, i;

         for (i = 0; i < liveDriverList.length; i++) {
         marker = new google.maps.Marker({
         position: new google.maps.LatLng(liveDriverList[i].latitude, liveDriverList[i].longitude),
         map: map
         });

         google.maps.event.addListener(marker, 'click', (function(marker, i) {
         return function() {
         infowindow.setContent(liveDriverList[i].fullName, liveDriverList[i].fullName);
         infowindow.open(map, marker);
         }
         })(marker, i));
         }*/






