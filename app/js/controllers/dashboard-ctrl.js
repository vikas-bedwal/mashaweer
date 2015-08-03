/**
 * Created by Vikas on 28/07/15.
 */
/**
 * Created by vikash on 3/28/15.
 */
App.controller('dashboardController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout,ngDialog) {

    'use strict';

    $scope.addCreditDialog = function(){
        ngDialog.open({
            template: 'addCredit',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument: false,
            closeByEscape: false
        });
    }

    $scope.addCredit = function(data){
        console.log("Credit called");
        console.log(data);
    }
    $scope.list= [];

    var dataArray = {};
console.log($cookieStore.get('obj').accesstoken)
    $http.post(MY_CONSTANT.url + 'dashboard_report', {
        access_token: $cookieStore.get('obj').accesstoken,
        mail:'xyz@gmail.com',
        test:'value'
    },{
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

    })
        .success(function(response) {
            console.log(response)
            $("#loader").hide();
            if(response['status'] == 101) {

                //window.location.href = "index.html";
            }
            else if (response['status'] == 100) {
                var dashboardData = response.data;
                dashboardData.forEach(function (column) {
                    var d = {};

                    d.booking_id = column.booking_id;
                    // d.booking_type = column.booking_type;
                    d.booking_customer_name = column.customer_name ;
                    d.booking_therapist_name = column.therapist_name ;
                    d.booking_business_name = column.business_name ;
                    d.booking_customer_url =  "/app/customer_info/" + column.customer_id ;
                    d.booking_therapist_url =  "/app/therapist_info/" + column.therapist_id ;
                    d.booking_business_url =  "/app/business_info/" + column.business_id ;
                    d.booking_product_name = column.product_name ;
                    d.booking_address = column.address;
                    d.booking_duration = column.duration;
                    d.booking_cost = column.cost;
                    d.booking_appointment_time = column.appointment_time;
                    d.booking_status = column.booking_status;
                    d.booking_therapist_feedback = column.therapist_feedback ;
                    d.booking_customer_feedback = column.customer_feedback ;
                    d.booking_payment_status = column.payment_status;
                    // d.booking_appointment_time = column.appointment_datetime_local;
                    var str = moment.utc(column.appointment_datetime_local).format("Do MMM YYYY hh:mm A");
                    d.booking_appointment_time=str;
                    //  d.booking_payment_status = column.payment_status;
                    switch(column.payment_status){
                        case 0:
                            d.booking_payment_status = 'Not Done';
                            d.text_color='#FF0000';
                            break;
                        case 1:
                            d.booking_payment_status = 'Completed';
                            d.text_color='#1f9c3d';

                            break;
                        case 2:
                            d.d.booking_payment_status = 'Refunded';
                            d.text_color='#2f80e7';

                            break;

                    }
                    switch(column.booking_type){
                        case 1:
                            d.booking_type = 'Go for Massage';
                            break;
                        case 2:
                            d.booking_type = 'Get a Massage';
                            break;

                    }

                    switch(column.status){
                        case 1:
                            d.booking_status = 'Requested';
                            break;
                        case 2:
                            d.booking_status = 'Confirmed';
                            break;
                        case 3:
                            d.booking_status = 'Started';
                            break;
                        case 4:
                            d.booking_status = 'Completed';
                            break;
                        case 5:
                            d.booking_status = 'Cancelled';
                            break;
                        case 6:
                            d.booking_status = 'Rejected';
                            break;
                        case 7:
                            d.booking_status = 'Under Admin Review';
                            break;

                    }
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
            } else{
                alert("Something went wrong, please try again later.");
                return false;
            }
        })
        .error(function(error) {
            console.log(error);
        });

});
