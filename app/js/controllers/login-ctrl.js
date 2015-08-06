/**
 * Created by Vikas on 29/07/15.
 */
App.controller('LoginController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state) {
    $scope.account = {};
    $scope.authMsg = '';
    $scope.loginAdmin = function () {
        $scope.authMsg = '';
        console.log($scope.account.email);
        console.log($scope.account.password);
        $.post(MY_CONSTANT.url + 'api/admin/login',
            {
                email: $scope.account.email,
                password: $scope.account.password
            }).then(
            function (data,status) {
                console.log(data)
                console.log(status)
                if (status != 'success') {
                    console.log("if");
                    $scope.authMsg = data.message;
                    setTimeout(function () {
                        $scope.authMsg = "";
                        $scope.$apply();
                    }, 3000);
                    $scope.$apply();
                } else {
                    console.log("else");
                    var someSessionObj = {'accesstoken': data.data.accessToken};
                    $cookieStore.put('obj', someSessionObj);
                    console.log($cookieStore.get('obj').accesstoken)
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
                console.log(data);
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