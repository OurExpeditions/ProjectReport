var defectTracking = angular.module('defect-tracking-app',
    ['ui.grid', 'defect-service', 'report',
        'ui.router', 'ui.bootstrap', 'ui.bootstrap.tpls',
        'defect.summary', 'ngOnlyNumberApp']);

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

/*
 defectTracking.run(function ($rootScope, $state) {
 $rootScope.$state = $state; //Get state info in view
 $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
 window.location.href = "#report";
 });
 });*/

defectTracking.directive('defectMaxlength', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            var maxLength = Number(attrs.defectMaxlength);

            function fromUser(text) {
                var enterStr = text.toString();
                if (enterStr.length > maxLength) {
                    var transformedInput = enterStr.substring(0, maxLength);
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                    return transformedInput;
                }
                return text;
            }

            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

defectTracking.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9]/g, '');
                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits, 10);
                }
                return undefined;
            }

            ctrl.$parsers.push(inputValue);
        }
    };
});