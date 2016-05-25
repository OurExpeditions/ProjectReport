angular.module('authService', [])
    .factory('AuthService',
        ['$q', '$timeout', '$http','$rootScope',
            function ($q, $timeout, $http, $rootScope) {
                // create user variable
                var user = null;
                // return available functions for use in the controllers
                return ({
                    isLoggedIn: isLoggedIn,
                    getUserStatus: getUserStatus,
                    login: login,
                    logout: logout,
                    register: register
                });

                function isLoggedIn() {
                    return user;
                }

                function getUserStatus() {
                    return $http.get('/defect/status')
                        // handle success
                        .success(function (data) {
                            user = data.status;
                        })
                        // handle error
                        .error(function (data) {
                            user = false;
                        });
                }

                function login(username, password) {
                    // create a new instance of deferred
                    var deferred = $q.defer();
                    // send a post request to the server
                    $http.post('/defect/login',
                        {username: username, password: password})
                        // handle success
                        .success(function (data, status) {
                            if (status === 200 && data.status) {
                                user = true;
                                $rootScope.user = data.user;
                                window.sessionStorage["userInfo"] = JSON.stringify(data.user);
                                $rootScope.userInfo = JSON.parse(window.sessionStorage["userInfo"]);
                                window.sessionStorage["user"] = data.user;
                                deferred.resolve(data.user);
                            } else {
                                user = false;
                                deferred.reject();
                            }
                        })
                        // handle error
                        .error(function (data) {
                            user = false;
                            deferred.reject();
                        });
                    // return promise object
                    return deferred.promise;
                }

                function logout() {
                    // create a new instance of deferred
                    var deferred = $q.defer();
                    // send a get request to the server
                    $http.get('/defect/logout')
                        // handle success
                        .success(function (data) {
                            user = false;
                            deferred.resolve();
                        })
                        // handle error
                        .error(function (data) {
                            user = false;
                            deferred.reject();
                        });
                    // return promise object
                    return deferred.promise;
                }

                function register(regUser) {
                    // create a new instance of deferred
                    var deferred = $q.defer();
                    // send a post request to the server
                    $http.post('/defect/signup', regUser)
                        // handle success
                        .success(function (data, status) {
                            if (status === 200 && data.status) {
                                deferred.resolve();
                            } else {
                                deferred.reject();
                            }
                        })
                        // handle error
                        .error(function (data) {
                            deferred.reject();
                        });
                    // return promise object
                    return deferred.promise;
                }
            }]);