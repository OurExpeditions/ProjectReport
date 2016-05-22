var projectReport = angular.module('report', []);

var reportController = ['$scope', '$rootScope', 'DefectService',
    function ($scope, $rootScope, DefectService) {
        var report = this;
        report.project = {};
        report.retrospectionList = retrospectionAllList();
        report.releaseDateFormat = "dd/MM/yyyy";
        report.project.releaseDate = new Date();
        report.teamsList = [];
        var savedDefectList = [];
        report.reportDatePicker = {
            open: false
        };
        report.reportDatePickerOpen = function () {
            report.reportDatePicker.opened = true;
        };

        var build = 0;
        var design = 0;
        var requirements = 0;
        var dit = 0;
        var qat = 0;
        var postProduction = 0;

        $scope.loadSavedDefects = function () {
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

function retrospectionAllList() {
    return [
        {
            id: 0,
            value: 'No'
        },
        {
            id: 1,
            value: 'Yes'
        }
    ]
}