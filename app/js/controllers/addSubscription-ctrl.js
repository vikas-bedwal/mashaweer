/**
 * Created by Vikas on 31/07/15.
 */
App.controller('addSubscriptionController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, MY_CONSTANT1, $state, $window,ngDialog) {

    'use strict';
    $scope.showCity = 1;
    $scope.showCity2 = 1;
    $scope.showCity3 = 1;
    $scope.choice = '';
    $scope.conditionArray = [];
    jQuery('#datetimepicker').datetimepicker({
        lang: 'de',
        i18n: {
            de: {
                months: [
                    'January', 'February', 'March', 'April',
                    'May', 'June', 'July', 'August',
                    'September', 'October', 'November', 'December',
                ],
                dayOfWeek: [
                    "Sun", "Mon", "Tue", "Wed",
                    "Thu", "Fri", "Sat",
                ]
            }
        },
        timepicker: false,
        format: 'Y-m-d',
        minDate: ''//yesterday is minimum date(for today use 0 or -1970/01/01)

    });

    /*--------------------------------------------------------------------------
     * --------- Shows/Hide form fields According to Selected Choice --------------------------
     --------------------------------------------------------------------------*/
    $scope.status = function (val) {
        if (val == "WITHIN_CITY") {
            $scope.showCity = 1;
            $scope.showRadius = 0;
            $scope.showFromTo = 0;
        }
        else if (val == "WITHIN_RADIUS") {
            $scope.showRadius = 1;
            $scope.showCity = 0;
            $scope.showFromTo = 0;
        }
        else {
            $scope.showFromTo = 1;
            $scope.showRadius = 0;
            $scope.showCity = 0;
        }
    }
    $scope.status2 = function (val) {
        if (val == "WITHIN_CITY") {
            $scope.showCity2 = 1;
            $scope.showRadius2 = 0;
            $scope.showFromTo2 = 0;
        }
        else if (val == "WITHIN_RADIUS") {
            $scope.showRadius2 = 1;
            $scope.showCity2 = 0;
            $scope.showFromTo2 = 0;
        }
        else {
            $scope.showFromTo2 = 1;
            $scope.showRadius2 = 0;
            $scope.showCity2 = 0;
        }
    }
    $scope.status3 = function (val) {
        if (val == "WITHIN_CITY") {
            $scope.showCity3 = 1;
            $scope.showRadius3 = 0;
            $scope.showFromTo3 = 0;
        }
        else if (val == "WITHIN_RADIUS") {
            $scope.showRadius3 = 1;
            $scope.showCity3 = 0;
            $scope.showFromTo3 = 0;
        }
        else {
            $scope.showFromTo3 = 1;
            $scope.showRadius3 = 0;
            $scope.showCity3 = 0;
        }
    }

    /*--------------------------------------------------------------------------
     * --------- Add subscribe Code Call ---------------------------------------
     --------------------------------------------------------------------------*/

    $scope.loc = {};
    $scope.text = [];
    $scope.subscribe = function (add) {
        $scope.loading = true;
        $scope.successMsg = '';
        $scope.errorMsg = '';
        $scope.text = [];
        var str = add.description;
        var descArray = str.split(",");
        /*for (var i = 0; i < $scope.conditionArray.length; i++) {
            if (!$scope.conditionArray[i].name == "")
                $scope.text.push($scope.conditionArray[i].name);
        }*/
        $scope.totalCredits = parseInt(add.credit) + parseInt(add.credit2) + parseInt(add.credit3);
        /*--------------------------------------------------------------------------
         * --------- Create required json for hit ---------------------------------------
         --------------------------------------------------------------------------*/
            if(add.subscriptionType=="WITHIN_CITY"){
                var obj = {
                    subscriptionType: add.subscriptionType,
                    credits: add.credit,
                    vehicleType: add.vehicleType,
                    city: add.city
                };
            }
            else if(add.subscriptionType=="WITHIN_RADIUS"){
                var obj = {
                    subscriptionType: add.subscriptionType,
                    credits: add.credit,
                    vehicleType: add.vehicleType,
                    radius: add.radius
                };
            }
            else{
                var obj = {
                    subscriptionType: add.subscriptionType,
                    credits: add.credit,
                    vehicleType: add.vehicleType,
                    fromCity: add.from,
                    toCity: add.to
                };
            }


        if(add.subscriptionType2=="WITHIN_CITY"){
            var obj2 = {
                subscriptionType: add.subscriptionType2,
                credits: add.credit2,
                vehicleType: add.vehicleType2,
                city: add.city2
            };
        }
        else if(add.subscriptionType2=="WITHIN_RADIUS"){
            var obj2 = {
                subscriptionType: add.subscriptionType2,
                credits: add.credit2,
                vehicleType: add.vehicleType2,
                radius: add.radius2
            };
        }
        else{
            var obj2 = {
                subscriptionType: add.subscriptionType2,
                credits: add.credit2,
                vehicleType: add.vehicleType2,
                fromCity: add.from2,
                toCity: add.to2
            };
        }

        if(add.subscriptionType3=="WITHIN_CITY"){
            var obj3 = {
                subscriptionType: add.subscriptionType3,
                credits: add.credit3,
                vehicleType: add.vehicleType3,
                city: add.city3
            };
        }
        else if(add.subscriptionType3=="WITHIN_RADIUS"){
            var obj3 = {
                subscriptionType: add.subscriptionType3,
                credits: add.credit3,
                vehicleType: add.vehicleType3,
                radius: add.radius3
            };
        }
        else{
            var obj3 = {
                subscriptionType: add.subscriptionType3,
                credits: add.credit3,
                vehicleType: add.vehicleType3,
                fromCity: add.from3,
                toCity: add.to3
            };
        }

        var arrayOfObj = [];
            if($scope.len==1){
                arrayOfObj[0]=obj;
            }
            else if($scope.len==2){
                arrayOfObj[0]=obj;
                arrayOfObj[1]=obj2;
            }
        else{
                arrayOfObj[0]=obj;
                arrayOfObj[1]=obj2;
                arrayOfObj[2]=obj3;
            }
        $http({
            url: MY_CONSTANT.url + 'api/admin/addSubscription',
            method: "POST",
            data: { 'accessToken' : $cookieStore.get('obj').accesstoken,
                    'heading': add.heading,
                'text': descArray,
                'amount': add.amount,
                'expiryDate': add.validUpto,
                'validity': add.validity,
                'totalCredits': $scope.totalCredits,
                'conditionsApply': arrayOfObj
            }
        })
            .then(function(response) {
                $window.location = "#/app/subscription";
                $scope.loading = false;
            },
            function(response) { // optional
                // failed
                ngDialog.open({
                    template: 'display_msg',
                    scope: '$scope',
                    className: 'ngdialog-theme-default'
                })
            });
    };

    /*--------------------------------------------------------------------------
     * --------- Dynamically Row addition ---------------------------------------
     --------------------------------------------------------------------------*/
    // $scope.choices = [{id: 'choice1'}, {id: 'choice2'}, {id: 'choice3'}];
    $scope.addNewChoice = function () {
        $scope.conditionArray.push({name: ''});
        $scope.length = $scope.conditionArray.length;
        //var newItemNo = $scope.choices.length+1;
        //$scope.choices.push({'id':'choice'+newItemNo});
    };
    $scope.showAddChoice = function (choice) {
        return choice == $scope.length;
    };

    $scope.showChoiceLabel = function (choice) {
        return choice.id === 'choice1';
    };
    $scope.addNewChoice();

    $scope.len = 1;
    $scope.btnChange1 = 0;
    $scope.btnChange2 = 0;
    $scope.second = 0;
    $scope.third = 0;
    $scope.addNewForm = function (len) {
        $scope.len = $scope.len + 1;
        if (len == 1) {
            $scope.second = 1;
            $scope.btnChange = 1;

        }
        else if (len == 2) {
            $scope.btnChange2 = 1;
            $scope.second = 1;
            $scope.third = 1;
        }
        else {
            $scope.btnChange2 = 1;
        }
        $scope.length = $scope.conditionArray.length;
    };

    $scope.deleteForm = function (formNo) {
        if (formNo == 3) {
            $scope.third = 0;
            $scope.len = $scope.len - 1;
            $scope.btnChange2 = 0;
        }
        else if (formNo == 2) {
            $scope.second = 0;
            $scope.btnChange = 0;

            $scope.len = $scope.len - 1;
        }
        else {
            console.log("Impossible");
        }
    }

});

App.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your input.
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
});