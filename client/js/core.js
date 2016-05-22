var defectTracking = angular.module('defect-tracking-app',
    ['ui.grid', 'defect-service', 'report',
        'ui.router', 'ui.bootstrap', 'ui.bootstrap.tpls',
        'defect.summary', 'ngOnlyNumberApp', 'chart.js']);

/*defectTracking.controller('MainCtrl', ['$scope','DefectService', function ($scope, DefectService) {

 }]);*/

defectTracking.config(['$urlRouterProvider', '$stateProvider',
    function ($urlRouterProvider, $stateProvider) {
        $stateProvider.state('report', {
            url: '/report',
            templateUrl: 'views/project/project-report.html',
            controller: reportController,
            controllerAs: 'report',
            data: {
                auth: false
            }
        });
        $stateProvider.state('summary', {
            url: '/summary',
            templateUrl: 'views/defect/defect-summary.html',
            controller: projectSummaryController,
            controllerAs: 'summary',
            data: {
                auth: false
            }
        });
        $urlRouterProvider.otherwise("/report");
    }
]);

/*defectTracking.config(function ($urlRouterProvider, $httpProvider) {
 //session check and redirect to specific state

 });*/

defectTracking.directive("fileread", [function () {
    return {
        scope: {
            opts: '='
        },
        link: function ($scope, $elm, $attrs) {
            $elm.on('change', function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $scope.$apply(function () {
                        var data = evt.target.result;
                        var workbook = XLSX.read(data, {type: 'binary'});
                        var headerNames = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1})[0];
                        var columnData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                        $scope.opts.columnDefs = [];
                        headerNames.forEach(function (h) {
                            $scope.opts.columnDefs.push({field: h});
                        });

                        $scope.opts.data = columnData;
                        $elm.val(null);
                    });
                };
                reader.readAsBinaryString(changeEvent.target.files[0]);
            });
        }
    }
}]);


defectTracking.run(['$rootScope', '$state', 'DefectService',
    function ($rootScope, $state, DefectService) {
        $rootScope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $rootScope.severityList = [];
        $rootScope.teamsList = [];
        $rootScope.injectedAndIdentifiedStageList = [];
        $rootScope.rootCauseList = [];
        var appName = null;
        DefectService.getTeams(appName).success(function (data) {
            $rootScope.teamsList = data;
            if (data.length === 0) {
                var list = getTeamNames();
                list.forEach(function (entry) {
                    DefectService.addTeam(entry).success(function (team) {
                        $rootScope.teamsList.push(team);
                    });
                })
            }
        });
        DefectService.getSeverityList().success(function (data) {
            $rootScope.severityList = data;
            if (data.length === 0) {
                var severityArr = addSeverityList();
                severityArr.forEach(function (entry) {
                    DefectService.addSeverityList(entry).success(function (data) {
                        $rootScope.severityList.push(data);
                    });
                })
            }
        });

        DefectService.getInjectAndIdentifyList().success(function (data) {
            $rootScope.injectedAndIdentifiedStageList = data;
            if (data.length === 0) {
                var injectedAndIdentifyArr = addInjectedAndIdentifyStages();
                injectedAndIdentifyArr.forEach(function (entry) {
                    DefectService.addInjectAndIdentifyList(entry).success(function (data) {
                        $rootScope.injectedAndIdentifiedStageList.push(data);
                    });
                })
            }
        });

        DefectService.getRootCauseList().success(function (data) {
            $rootScope.rootCauseList = data;
            if (data.length === 0) {
                var rootCauseArr = addRootCauseInfo();
                rootCauseArr.forEach(function (entry) {
                    DefectService.addRootCause(entry).success(function (data) {
                        $rootScope.rootCauseList.push(data);
                    });
                })
            }
        });
    }
]);

function getTeamNames() {
    return [
        {
            id: 1,
            appName: 'QuikView',
            team: 'eXtreme'
        }, {
            id: 2,
            appName: 'QuikView',
            team: 'Expandable'
        }, {
            id: 3,
            appName: 'QuikView',
            team: 'Thunderblast'
        }, {
            id: 4,
            appName: 'QuikView',
            team: '007'
        }, {
            id: 5,
            appName: 'QVXP',
            team: 'Parachute'
        }, {
            id: 6,
            appName: 'QVXP',
            team: 'Spider'
        }, {
            id: 7,
            appName: 'QVXP',
            team: 'Sigma'
        }, {
            id: 8,
            appName: 'QVXP',
            team: 'Warriors'
        }
    ]
}

function addSeverityList() {
    return [
        {
            id: 1,
            type: 'Critical'
        },
        {
            id: 2,
            type: 'Severe'
        },
        {
            id: 3,
            type: 'Average'
        }, {
            id: 4,
            type: 'Low'
        }
    ]
}

function addInjectedAndIdentifyStages() {
    return [
        {
            id: 1,
            type: 'Requirements'
        },
        {
            id: 2,
            type: 'Design'
        },
        {
            id: 3,
            type: 'Build'
        },
        {
            id: 4,
            type: 'DIT'
        },
        {
            id: 5,
            type: 'QAT'
        },
        {
            id: 6,
            type: 'Post Production'
        }
    ]
}

function addRootCauseInfo() {
    return [
        {
            id: 1,
            type: 'Design gap'
        },
        {
            id: 2,
            type: 'Requirements Gap'
        },
        {
            id: 3,
            type: 'Overlook the requirements'
        },
        {
            id: 4,
            type: 'Configuration Issue'
        },
        {
            id: 5,
            type: 'Lack of Coding Standards'
        },
        {
            id: 6,
            type: 'Lack of knowledge on code base'
        },
        {
            id: 7,
            type: 'Logical fallacy'
        },
        {
            id: 8,
            type: 'Not a valid defect'
        },
        {
            id: 9,
            type: 'Oversight'
        },
        {
            id: 10,
            type: 'Middleware Issue'
        },
        {
            id: 11,
            type: 'Test Data not available'
        }
    ]
}