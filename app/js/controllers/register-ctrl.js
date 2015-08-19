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
        console.log($scope.account.fullName);
        console.log($scope.account.email);
        console.log($scope.account.password);
        console.log($scope.account.password2);
        $.post(MY_CONSTANT.url + 'api/admin/createSubAdmin',
            {
                email: $scope.account.email,
                password: $scope.account.password,
                fullName: $scope.account.fullName
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
                    $state.go('page.login');
                }
            });
    };
    $scope.logout = function () {
        $cookieStore.remove('obj');
        $state.go('page.login');
    }

});