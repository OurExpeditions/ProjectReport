var projectReport = angular.module('report', []);

var reportController = ['$scope', '$rootScope', function ($scope, $rootScope) {
    var report = this;
    report.project = {};
    report.releaseDateFormat = "dd/MM/yyyy";
    report.project.releaseDate = new Date();
    report.teamsList = [];
    report.reportDatePicker = {
        open: false
    };
    report.reportDatePickerOpen = function () {
        report.reportDatePicker.opened = true;
    }
}];