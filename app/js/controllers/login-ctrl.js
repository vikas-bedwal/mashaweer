/**
 * Created by Vikas on 29/07/15.
 */
App.controller('LoginController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state,$rootScope) {
    $scope.account = {};
    $scope.authMsg = '';
    $scope.loginAdmin = function () {
        $scope.authMsg = '';

            $http({
                url: MY_CONSTANT.url + 'api/admin/login',
                method: "POST",
                data: { email: $scope.account.email,
                    password: $scope.account.password
                }
            })
                .then(function(response) {
                    console.log(response);
                    var someSessionObj = {'accesstoken': response.data.data.accessToken};
                    var someSessionObj1 = {'adminType': response.data.data.adminType};
                    $cookieStore.put('obj', someSessionObj);
                    $cookieStore.put('obj1', someSessionObj1);
                    var someSessionObj2 = {'reassignedorderList': {}};
                    $cookieStore.put('obj3', someSessionObj2);
                    $state.go('app.dashboard');
                },
                function(response) { // optional
                    console.log(response);
                    // failed
                    if(response.status==401){
                        $scope.authMsg = response.data.message;
                        setTimeout(function () {
                            $scope.authMsg = "";
                            $scope.$apply();
                        }, 3000);
                    }
                    else
                    alert("Something Went Wrong");
                });
    };
    $scope.recover = function () {
        $.post(MY_CONSTANT.url + '/forgot_password',
            {
                email: $scope.account.email
            }).then(
            function (data) {
                data = JSON.parse(data);
                if (data.status == 200) {
                    $scope.successMsg = data.message.toString();
                } else {
                    $scope.errorMsg = data.message.toString();

                }
                $scope.$apply();
            })
    };
    $scope.logout = function () {
        $cookieStore.remove('obj');
        $state.go('page.login');
    }

});