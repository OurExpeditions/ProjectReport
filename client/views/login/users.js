var userModule = angular.module('users', []);

userModule.config(['$stateProvider', function ($stateProvider) {
    //Login
    $stateProvider.state('login', {
        url: "/login",
        templateUrl: 'views/login/login-form.html',
        controller: UserController
    });

    //Signup
    $stateProvider.state('register', {
        url: "/register",
        templateUrl: 'views/login/register-form.html',
        controller: UserController
    });

    //Logout
    $stateProvider.state('logout', {
        url: "/logout",
        controller: 'logoutController'
    });
}]);

userModule.controller('logoutController', ['$scope', '$location', '$rootScope', 'AuthService',
    function ($scope, $location, $rootScope, AuthService) {
        AuthService.logout()
            .then(function () {
                //alert('Coming Here ');
                console.log('coming Here logout block');
                sessionStorage.clear();
                $rootScope.userInfo = false;
                $rootScope.user = {};
                $location.path('/login');
                $rootScope.dashboardClass = 'login-page';
            });

    }
]);

userModule.directive('compareTo', function () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function (scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function (modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
});