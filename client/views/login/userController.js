var UserController = ['$scope', '$location', 'AuthService', '$rootScope', 'DefectService',
    function ($scope, $location, AuthService, $rootScope, DefectService) {
        $scope.signup = {};
        $scope.login = {};
        $scope.validRoles = ['- Select Role -', 'ADMIN', 'MANAGER', 'LEAD', 'USER'];
        $scope.selectedRole = $scope.validRoles[0];
        $scope.teamsList = $rootScope.teamsList;
        $scope.appList = $rootScope.appList;
        $scope.showAppAndTeamDropdowns = false;
        //console.log("$scope.releSelected    ", $scope.releSelected)

        $scope.appChanged = function () {
            if ($scope.appName != null) {
                var appName = $scope.appList[parseInt($scope.appName) - 1].appName;
                DefectService.getTeams(appName).success(function (data) {
                    $scope.teamsList = data;
                });
            }
        };

        $scope.doLogin = function () {
            // initial values
            $scope.error = false;
            $scope.disabled = true;

            // call login from service
            AuthService.login($scope.login.username, $scope.login.password)
                // handle success
                .then(function () {
                    $location.path('/main');
                    $scope.disabled = false;
                    $scope.login = {};
                    $scope.user = AuthService.user;
                    $rootScope.dashboardClass = 'inner-home';
                })
                // handle error
                .catch(function () {
                    $scope.error = true;
                    $scope.errorMessage = "Invalid username and/or password";
                    $scope.disabled = false;
                    $scope.login = {};
                })

        };

        $scope.doRegister = function (isValid) {
            if (isValid && $scope.selectedRole !== '- Select Role -') {
                // initial values
                $scope.error = false;
                $scope.disabled = true;
                $scope.signup.createDate = new Date();
                $scope.signup.createdBy = 'Ravi';
                // call register from service
                $scope.signup.role = $scope.selectedRole;
                $scope.signup.appName = ($scope.appName !== undefined && $scope.appName !== null) ? $scope.teamName : "";
                $scope.signup.teamName = ($scope.teamName !== undefined && $scope.teamName !== null) ? $scope.teamName : "";

                console.log("Signup resg form   ", $scope.signup);
                AuthService.register($scope.signup)
                    // handle success
                    .then(function () {
                        $location.path('/login');
                        $scope.disabled = false;
                        $scope.signup = {};
                    })
                    // handle error
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Something went wrong!";
                        $scope.disabled = false;
                        $scope.signup = {};
                    });
            }
        };

        $scope.refreshForm = function () {
            $scope.signup = {};
            $scope.login = {};
        };

        $scope.rolesDropdownSelected = function (item) {
            $scope.selectedRole = item;
            $scope.showAppAndTeamDropdowns = !($scope.selectedRole === 'ADMIN' || $scope.selectedRole === 'MANAGER');
        }
    }];
