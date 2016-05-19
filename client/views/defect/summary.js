angular.module('defect.summary', ['ui.grid.selection']);
//http://plnkr.co/edit/cq7s9lKn90xTVgNxIC6b?p=preview
projectSummaryController = ['$rootScope', '$scope', 'DefectService',
    function ($rootScope, $scope, DefectService) {
        var summary = this;
        summary.defect = {};
        summary.severityList = [];
        summary.injectedAndIdentifiedStageList = [];
        summary.rootCauseList = [];
        summary.savedDefectList = [];
        summary.applicationList = [{id: 1, appName: 'QuikView'}, {id: 2, appName: 'QVXP'}];
        summary.canShowSavedDefects = false;
        summary.spreadSheetItemId = "";
        summary.teamsList = [];
        summary.gridOptions = {
            enableRowSelection: true,
            enableRowHeaderSelection: false
        };

        summary.reset = reset;

        function reset() {
            console.log(summary.gridOptions.data);
            summary.gridOptions.data = [];
            summary.gridOptions.columnDefs = [];
        }

        summary.spreadSheetItemClicked = function (item) {
            summary.spreadSheetItemId = item.$$hashKey;
            summary.defect.description = item.Summary;
            summary.defect.appName = summary.applicationList[getAppSelectedItem(item.Application, summary.applicationList)].id;
            var appName = summary.applicationList[parseInt(summary.defect.appName) - 1].appName;
            DefectService.getTeams(appName).success(function (data) {
                summary.teamsList = data;
            });
            summary.defect.defectId = item['Defect ID'];
            summary.defect.projectName = item['Clarity ID'];
        };

        summary.appChanged = function () {
            if (summary.defect.appName != null) {
                var appName = summary.applicationList[parseInt(summary.defect.appName) - 1].appName;
                DefectService.getTeams(appName).success(function (data) {
                    summary.teamsList = data;
                    if (data.length === 0) {
                        summary.addTeams();
                    }
                });
            }
        };
        summary.addTeams = function () {
            var list = getTeamNames();
            list.forEach(function (entry) {
                DefectService.addTeam(entry).success(function (team) {
                    summary.teamsList.push(team);
                });
            })
        };
        DefectService.getSeverityList().success(function (data) {
            summary.severityList = data;
            if (data.length === 0) {
                var severityArr = addSeverityList();
                severityArr.forEach(function (entry) {
                    DefectService.addSeverityList(entry).success(function (data) {
                        summary.severityList.push(data);
                    });
                })
            }
        });


        DefectService.getInjectAndIdentifyList().success(function (data) {
            summary.injectedAndIdentifiedStageList = data;
            if (data.length === 0) {
                var injectedAndIdentifyArr = addInjectedAndIdentifyStages();
                injectedAndIdentifyArr.forEach(function (entry) {
                    DefectService.addInjectAndIdentifyList(entry).success(function (data) {
                        summary.injectedAndIdentifiedStageList.push(data);
                    });
                })
            }
        });

        DefectService.getRootCauseList().success(function (data) {
            summary.rootCauseList = data;
            if (data.length === 0) {
                var rootCauseArr = addRootCauseInfo();
                rootCauseArr.forEach(function (entry) {
                    DefectService.addRootCause(entry).success(function (data) {
                        summary.rootCauseList.push(data);
                    });
                })
            }
        });

        summary.spreadSheetColumn = function (gridOptions) {
            console.log(gridOptions);
        };

        summary.submitForm = function () {
            if (isValidForm(summary.defect)) {
                var defect = summary.defect;
                defect.severity = summary.severityList[defect.severity - 1].type;
                defect.rootCause = summary.rootCauseList[defect.rootCause - 1].type;
                defect.identifiedStage = summary.injectedAndIdentifiedStageList[defect.identifiedStage - 1].type;
                defect.injectedStage = summary.injectedAndIdentifiedStageList[defect.injectedStage - 1].type;

                if (defect._id !== undefined) {
                    defect.updatedDate = new Date();
                    defect.updatedBy = 'Ravi';
                    DefectService.updateDefect(defect).success(function () {
                        DefectService.getSavedDefectsList().success(function (data) {
                            summary.savedDefectList = [];
                            summary.savedDefectList = data;
                            defect = {};
                            summary.defect = {};
                        });
                    })
                }
                else {
                    defect.createdDate = new Date();
                    defect.createdBy = "Ravi";
                    DefectService.addDefectSummary(defect).success(function () {
                        defect = {};
                        summary.defect = {};
                        for (var i = summary.gridOptions.data.length - 1; i >= 0; i--) {
                            if (summary.gridOptions.data[i].$$hashKey === summary.spreadSheetItemId) {
                                delete summary.gridOptions.data.splice(i, 1);
                                break;
                            }
                        }
                        if (summary.gridOptions.data.length === 0) {
                            DefectService.getSavedDefectsList().success(function (data) {
                                summary.savedDefectList = data;
                            });
                        }
                    })
                }
            }
        };
        summary.resetForm = function () {
            summary.defect = {};
        };

        summary.updateDefect = function (defect) {
            var injectedList = summary.injectedAndIdentifiedStageList;
            var rootCauseList = summary.rootCauseList;
            var severityList = summary.severityList;
            summary.defect._id = defect._id;
            summary.defect.projectName = defect.projectName;
            summary.defect.severity = severityList[findSelectedOption(defect.severity, severityList)]._id;
            summary.defect.injectedStage = injectedList[findSelectedOption(defect.injectedStage, injectedList)]._id;
            summary.defect.identifiedStage = injectedList[findSelectedOption(defect.identifiedStage, injectedList)]._id;
            summary.defect.rootCause = rootCauseList[findSelectedOption(defect.rootCause, rootCauseList)]._id;
            summary.defect.description = defect.description;
            summary.defect.solutionToFix = defect.solutionToFix;
            summary.defect.comments = defect.comments;
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

function isValidForm(form) {
    return (form.defectId !== undefined && form.severity !== null && form.injectedStage !== null &&
    form.identifiedStage !== null && form.rootCause !== null && form.solutionToFix !== undefined &&
    form.comments !== undefined && form.description !== undefined);
}

function getAppSelectedItem(appName, list) {
    for (var i = 0; i < list.length; i++) {
        if (appName == list[i].appName) {
            return i;
        }
    }
}
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
function findSelectedOption(type, list) {
    for (var i = 0; i < list.length; i++) {
        if (type == list[i].type) {
            return i;
        }
    }
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