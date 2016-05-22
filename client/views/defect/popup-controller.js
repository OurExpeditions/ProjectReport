var errorMessageString = '';
var defectPopupController = ['$scope', '$rootScope', '$uibModalInstance',
    function ($scope, $rootScope, $uibModalInstance) {
        var popup = this;
        popup.errorMessage = '';
        popup.defect = {};
        var defectItem = $scope.$$prevSibling.summary.selectedDefect;
        var serviceCall = $scope.$$prevSibling.summary.defectService;
        var appList = $scope.$$prevSibling.summary.applicationList;
        var severityList = $rootScope.severityList;
        var injectedList = $rootScope.injectedAndIdentifiedStageList;
        var rootCauseList = $rootScope.rootCauseList;
        var teamsList = $rootScope.teamsList;

        popup.appList = appList;
        popup.teamsList = teamsList;
        popup.severityList = severityList;
        popup.injectedAndIdentifiedStageList = injectedList;
        popup.rootCauseList = rootCauseList;

        var appName = '';
        if (defectItem._id === undefined) {
            popup.defect.description = defectItem.Summary;
            appName = defectItem.Application;
            popup.defect.appName = appList[getAppSelectedItem(defectItem.Application, appList)].id;
            popup.defect.defectId = defectItem['Defect ID'];
            popup.defect.projectName = defectItem['Clarity ID'];
        }
        else {
            appName = defectItem.appName;
            popup.defect.appName = appList[getAppSelectedItem(defectItem.appName, appList)].id;
            popup.defect.teamName = teamsList[findSelectedTeam(defectItem.team, teamsList)]._id;
            popup.defect.severity = severityList[findSelectedOption(defectItem.severity, severityList)]._id;
            popup.defect.injectedStage = injectedList[findSelectedOption(defectItem.injectedStage, injectedList)]._id;
            popup.defect.identifiedStage = injectedList[findSelectedOption(defectItem.identifiedStage, injectedList)]._id;
            popup.defect.rootCause = rootCauseList[findSelectedOption(defectItem.rootCause, rootCauseList)]._id;
            popup.defect.description = defectItem.description;
            popup.defect.solutionToFix = defectItem.solutionToFix;
            popup.defect.comments = defectItem.comments;
            popup.defect.defectId = defectItem._id;
            popup.defect.projectName = defectItem.projectName;
        }

        serviceCall.getTeams(appName).success(function (data) {
            popup.teamsList = data;
        });

        popup.cancelForm = function () {
            $uibModalInstance.dismiss('cancel');
        };

        popup.submitForm = function () {
            popup.errorMessage = '';
            if (isValidForm(popup.defect)) {
                var defect = popup.defect;
                defect.severity = popup.severityList[defect.severity - 1].type;
                defect.rootCause = popup.rootCauseList[defect.rootCause - 1].type;
                defect.identifiedStage = popup.injectedAndIdentifiedStageList[defect.identifiedStage - 1].type;
                defect.injectedStage = popup.injectedAndIdentifiedStageList[defect.injectedStage - 1].type;
                defect.appName = popup.appList[defect.appName - 1].appName;
                defect.teamName = popup.teamsList[defect.teamName - 1].team;
                if (defectItem._id !== undefined) {
                    defect._id = defectItem._id;
                    defect.updatedDate = new Date();
                    defect.updatedBy = 'Ravi';
                    serviceCall.updateDefect(defect).success(function () {
                        serviceCall.getSavedDefectsList().success(function (data) {
                            popup.savedDefectList = [];
                            popup.savedDefectList = data;
                            defect = {};
                            popup.defect = {};
                            $uibModalInstance.dismiss('cancel');
                        });
                    })
                }
                else {
                    defect.createdDate = new Date();
                    defect.createdBy = "Ravi";
                    serviceCall.addDefectSummary(defect).success(function (data) {
                        if (data.code === undefined) {
                            defect = {};
                            popup.defect = {};
                            $scope.$$prevSibling.summary.deleteSelectedSpreadSheetItem(popup.item.$$hashKey);
                            $uibModalInstance.dismiss('cancel');
                        }
                        else {
                            popup.errorMessage = data.op._id + ' Already exist';
                        }
                    })
                }
            }
            else {
                popup.errorMessage = errorMessageString;
            }
        };

        popup.appChanged = function () {
            if (popup.defect.appName != null) {
                var appName = popup.appList[parseInt(popup.defect.appName) - 1].appName;
                serviceCall.getTeams(appName).success(function (data) {
                    popup.teamsList = data;
                });
            }
        };
    }
];

function isValidForm(form) {
    if (form.appName === undefined || form.appName === null) {
        errorMessageString = 'Select application name';
        return false;
    }
    else if (form.teamName === undefined || form.teamName === null) {
        errorMessageString = 'Select team name';
        return false;
    }
    else if (form.defectId === undefined || form.defectId === '') {
        errorMessageString = 'Enter defect number';
        return false;
    }
    else if (form.severity === undefined || form.severity === null) {
        errorMessageString = 'Select defect severity';
        return false;
    }
    else if (form.injectedStage === undefined || form.injectedStage === null) {
        errorMessageString = 'Select defect injectedStage';
        return false;
    }
    else if (form.identifiedStage === undefined || form.identifiedStage === null) {
        errorMessageString = 'Select defect identified stage';
        return false;
    }
    else if (form.rootCause === undefined || form.rootCause === null) {
        errorMessageString = 'Select defect root cause';
        return false;
    }
    else if (form.solutionToFix === undefined || form.solutionToFix === '') {
        errorMessageString = 'Enter defect solution to fix';
        return false;
    }
    else if (form.description === undefined || form.description === '') {
        errorMessageString = 'Enter defect description';
        return false;
    }
    else {
        errorMessageString = '';
        return true;
    }
}

function findSelectedOption(type, list) {
    for (var i = 0; i < list.length; i++) {
        if (type == list[i].type) {
            return i;
        }
    }
}

function getAppSelectedItem(appName, list) {
    for (var i = 0; i < list.length; i++) {
        if (appName == list[i].appName) {
            return i;
        }
    }
}

function findSelectedTeam(name, list) {
    for (var i = 0; i < list.length; i++) {
        if (name == list[i].team) {
            return i;
        }
    }
}