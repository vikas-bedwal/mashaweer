/**
 * Created by Vikas on 19/08/15.
 */
/**
 * Created by Vikas on 29/07/15.
 */
App.controller('RegisterFormController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state) {
    $scope.account = {};
    $scope.authMsg = '';
    $scope.register = function () {
        $scope.authMsg = '';
        $.post(MY_CONSTANT.url + 'api/admin/createSubAdmin',
            {
                email: $scope.account.email,
                password: $scope.account.password,
                fullName: $scope.account.fullName
            }).then(
            function (data,status) {
                if (status != 'success') {
                    $scope.authMsg = data.message;
                    setTimeout(function () {
                        $scope.authMsg = "";
                        $scope.$apply();
                    }, 3000);
                    $scope.$apply();
                } else {
                    var someSessionObj = {'accesstoken': data.data.accessToken};
                    $cookieStore.put('obj', someSessionObj);
                    $state.go('page.login');
                }
            });
    };
    $scope.logout = function () {
        $cookieStore.remove('obj');
        $state.go('page.login');
    }

});