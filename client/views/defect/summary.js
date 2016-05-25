var defectModule = angular.module('defect.summary', []);

defectModule.config(['$urlRouterProvider', '$stateProvider',
    function ($urlRouterProvider, $stateProvider) {
        $stateProvider.state('summary', {
            url: '/summary',
            templateUrl: 'views/defect/summary.html',
            controller: projectSummaryController,
            controllerAs: 'summary',
            data: {
                auth: true
            }
        });
    }
]);
projectSummaryController = ['$rootScope', '$scope', 'DefectService', '$uibModal',
    function ($rootScope, $scope, DefectService, $uibModal) {
        var summary = this;
        summary.savedDefectList = [];
        summary.canShowSavedDefects = false;
        summary.spreadSheetItemId = "";
        summary.teamsList = [];
        summary.defectService = DefectService;
        summary.applicationList = [{id: 1, appName: 'QuikView'}, {id: 2, appName: 'QVXP'}];
        summary.animationsEnabled = true;
        summary.gridOptions = {
            enableRowSelection: true,
            enableRowHeaderSelection: false
        };
        summary.reset = reset;
        function reset() {
            summary.gridOptions.data = [];
            summary.gridOptions.columnDefs = [];
        }

        summary.deleteSelectedSpreadSheetItem = function (id) {
            for (var i = summary.gridOptions.data.length - 1; i >= 0; i--) {
                if (summary.gridOptions.data[i].$$hashKey === id) {
                    delete summary.gridOptions.data.splice(i, 1);
                    break;
                }
            }
            if (summary.gridOptions.data.length === 0) {
                DefectService.getSavedDefectsList().success(function (data) {
                    summary.savedDefectList = data;
                });
            }
        };

        summary.getAllDefects = function () {
            DefectService.getSavedDefectsList().success(function (data) {
                summary.savedDefectList = data;
            });
        };
        summary.spreadSheetItemClicked = function (item) {
            summary.spreadSheetItemId = item.$$hashKey;
            summary.selectedDefect = item;
            var modalInstance = $uibModal.open({
                animation: summary.animationsEnabled,
                templateUrl: '../views/defect/defect-popup.html',
                controller: defectPopupController,
                controllerAs: 'popup',
                backdrop: 'static',
                keyboard: false
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
                console.log("Modal instance Selected Item is ++ ", selectedItem);
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        summary.spreadSheetColumn = function (gridOptions) {
            console.log(gridOptions);
        };

        summary.updateDefect = function (defect) {
            summary.selectedDefect = defect;
            var modalInstance = $uibModal.open({
                animation: summary.animationsEnabled,
                templateUrl: '../views/defect/defect-popup.html',
                controller: defectPopupController,
                controllerAs: 'popup',
                backdrop: 'static',
                keyboard: false
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
                console.log("Modal instance Selected Item is ++ ", selectedItem);
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        summary.deleteDefect = function (defectId) {
            summary.defect = {};
            DefectService.deleteDefect(defectId).success(function () {
                DefectService.getSavedDefectsList().success(function (data) {
                    summary.savedDefectList = [];
                    summary.savedDefectList = data;
                });
            })
        }
    }
];