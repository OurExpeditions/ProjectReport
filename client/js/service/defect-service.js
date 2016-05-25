var defectService = angular.module('defect-service', []);

defectService.factory('DefectService', ['$http',
    function ($http) {
        return {
            getSeverityList: function () {
                return $http.get('/defect/severities');
            },
            addSeverityList: function (severity) {
                return $http.post('/defect/severity', severity);
            },
            getInjectAndIdentifyList: function () {
                return $http.get('/defect/identifiedInjectedStages');
            },
            addInjectAndIdentifyList: function (stage) {
                return $http.post('/defect/addIdentifiedInjectedStages', stage);
            },
            getRootCauseList: function(){
                return $http.get('/defect/getRootCauses');
            },
            addRootCause: function(rootCause){
                return $http.post('/defect/addRootCause', rootCause);
            },
            addDefectSummary: function(defect){
                return $http.post('/defect/saveDefect', defect);
            },
            getSavedDefectsList: function(){
                return $http.get('/defect/getDefects');
            },
            deleteDefect: function (defectId) {
                return $http.delete('defect/deleteDefect', {params: {itemId: defectId}})
            },
            updateDefect: function (updateDefect) {
                return $http.post('/defect/updateDefect', updateDefect);
            },
            getTeams: function(appName){
                return $http.get('/defect/teamsInfo', {params: {app: appName}});
            },
            addTeam: function(team){
                return $http.post('/defect/addTeam', team);
            },
            addProjectInfo:function(project){
                return $http.post('/defect/addProjectDetails', project);
            },
            getProjects: function(){
                return $http.get('/defect/getProjectDetails');
            },
            updateProjectInfo: function(project){
                return $http.post('/defect/updateProject', project)
            },
            deleteProject: function (projectId) {
                return $http.delete('/defect/deleteProject', {params: {prId: projectId}})
            }
        };
    }
]);