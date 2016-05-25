var reportModule = angular.module('project.report', []);
var errorMessageString = "";
reportModule.config(['$urlRouterProvider', '$stateProvider',
    function ($urlRouterProvider, $stateProvider) {
        $stateProvider.state('report', {
            url: '/report',
            templateUrl: 'views/project/report.html',
            controller: reportController,
            controllerAs: 'report',
            data: {
                auth: true
            }
        });
    }
]);

reportModule.directive('tooltipLoader', function () {
    return function (scope, element, attrs) {
        element.tooltip({
            trigger: "hover",
            placement: "top",
            delay: {show: 100, hide: 0}
        });
    };
});

var reportController = ['$scope', '$rootScope', '$filter', 'DefectService',
    function ($scope, $rootScope, $filter, DefectService) {
        var report = this;
        report.project = {};
        report.releaseDateFormat = "dd/MM/yyyy";
        report.project.releaseDate = new Date();
        report.dateFilter = $filter('date');
        report.teamsList = [];
        var savedDefectList = [];
        var loggedUser = $rootScope.user;
        report.teamsList = $rootScope.teamsList;
        report.teamSelectDesable = false;
        report.retrospectionList = ['No', 'Yes'];
        report.errorMessage = "";
        report.savedProjects = [];
        report.projectViewDateOptions = {
            showWeeks: false
        };
        report.reportDatePicker = {
            open: false
        };
        report.reportDatePickerOpen = function () {
            report.reportDatePicker.opened = true;
        };
        if (loggedUser.teamName !== "") {
            report.project.teamName = report.teamsList[findSelectedTeam(loggedUser.teamName, report.teamsList)]._id;
            report.teamSelectDesable = true;
        }
        var build = 0;
        var design = 0;
        var requirements = 0;
        var dit = 0;
        var qat = 0;
        var postProduction = 0;

        report.addProjectDetails = function () {
            report.errorMessage = "";
            var project = report.project;
            if (isFormValid(project, report.teamName)) {
                if (loggedUser.teamName !== "") {
                    project.teamName = loggedUser.teamName;
                }
                else {
                    project.teamName = report.teamsList[report.teamName - 1].team;
                }
                DefectService.addProjectInfo(project).success(function (data) {
                    report.project = {};
                    report.savedProjects.push(data);
                })
            }
            else {
                report.errorMessage = errorMessageString;
            }
        };

        report.refreshForm = function () {
            report.project = {};
        };

        DefectService.getProjects().success(function (data) {
            report.savedProjects = data;
        });

        report.updateProjectDetails = function (project) {

        };

        report.loadSavedDefects = function () {
            DefectService.getSavedDefectsList().success(function (data) {
                report.data = [];
                data.forEach(function (defect) {
                    if (defect.injectedStage === 'Build') {
                        build++;
                        report.data.push(build);
                        if (build === 1)
                            report.labels.push('Build');
                    }
                    else if (defect.injectedStage === 'Requirements') {
                        requirements++;
                        report.data.push(requirements);
                        if (requirements === 1)
                            report.labels.push('Requirements');
                    }
                    else if (defect.injectedStage === 'Design') {
                        design++;
                        report.data.push(design);
                        if (design === 1)
                            report.labels.push('Design');
                    }
                    else if (defect.injectedStage === 'QAT') {
                        qat++;
                        report.data.push(qat);
                        if (qat === 1)
                            report.labels.push('QAT');
                    }
                    else if (defect.injectedStage === 'Post Production') {
                        postProduction++;
                        report.data.push(postProduction);
                        if (postProduction === 1)
                            report.labels.push('Post Production');
                    }
                });
                console.log(report.data);
            })
        };

        report.labels = ['Requirements', 'Design', 'Build', 'DIT', 'QAT', 'Post Production'];
        report.series = ['Defect'];
        //report.data = savedDefectList;
    }
];

/*projectReport.config(['ChartJsProvider', function (ChartJsProvider) {
 // Configure all charts
 ChartJsProvider.setOptions({
 colours: ['#FF5252', '#FF8A80'],
 responsive: false
 });
 }]);*/
function isFormValid(form, teamName) {
    if (form.releaseDate === undefined || form.releaseDate === null) {
        errorMessageString = "Please select release date";
        return false;
    }
    else if (form.devMonth === undefined || form.devMonth === null) {
        errorMessageString = "Please select project developed month";
        return false;
    }
    else if (form.projectName === undefined || form.projectName === "") {
        errorMessageString = "Please enter project name";
        return false;
    }
    else if (teamName === undefined || teamName === null) {
        errorMessageString = "Please select team";
        return false;
    }
    else if (form.artifacts === undefined || form.artifacts === "") {
        errorMessageString = "Please enter artifacts";
        return false;
    }
    else if (form.risks === undefined || form.risks === "") {
        errorMessageString = "Please enter risks";
        return false;
    }
    else if (form.achievements === undefined || form.achievements === "") {
        errorMessageString = "Please enter achievements";
        return false;
    }
    else {
        errorMessageString = "";
        return true;
    }
}
function findSelectedTeam(name, list) {
    for (var i = 0; i < list.length; i++) {
        if (name == list[i].team) {
            return i;
        }
    }
}