/**
 * Created by Vikas on 29/07/15.
 */
App.controller('LoginController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state,$rootScope) {
  /*  $("#login-button").click(function(event){
        event.preventDefault();

        $('form').fadeOut(500);
        $('.wrapper').addClass('form-success');
    });*/
    $scope.account = {};
    $scope.authMsg = '';
    $scope.loginAdmin = function () {
        $scope.authMsg = '';
        $.post(MY_CONSTANT.url + 'api/admin/login',
            {
                email: $scope.account.email,
                password: $scope.account.password
            }).then(
            function (data,status) {
                console.log(data);
                if (status != 'success') {
                    $scope.authMsg = data.message;
                    setTimeout(function () {
                        $scope.authMsg = "";
                        $scope.$apply();
                    }, 3000);
                    $scope.$apply();
                } else {
                    var someSessionObj = {'accesstoken': data.data.accessToken};
                    var someSessionObj1 = {'adminType': data.data.adminType};
                    $cookieStore.put('obj', someSessionObj);
                    $cookieStore.put('obj1', someSessionObj1);
                    $state.go('app.dashboard');
                }
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