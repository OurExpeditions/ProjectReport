var mongoose = require('mongoose'), Schema = mongoose.Schema;
mongoose.set('debug', true);

var SeveritySchema = new Schema({
    _id: Number,
    type: String
});

var InjectedStageSchema = new Schema({
    _id: Number,
    type: String
});

var RootCauseSchema = new Schema({
    _id: Number,
    type: String
});

var DefectSummarySchema = new Schema({
    _id: Number,
    appName: String,
    team: String,
    description: String,
    projectName: String,
    severity: String,
    injectedStage: String,
    identifiedStage: String,
    rootCause: String,
    solutionToFix: String,
    comments: String,
    createdDate: Date,
    createdBy: String,
    updatedDate: Date,
    updatedBy: String
});

var ProjectDetailsSchema = new Schema({
    team: String,
    releaseDate: Date,
    devMonth: String,
    projectName: String,
    storyPoints: String,
    artifacts: String,
    risks: String,
    achievements: String,
    valueAdds: String,
    retrospectionDone: Boolean
});

var TeamSchema = new Schema({
    _id: Number,
    team: String,
    appName: String
});

var severityModel = mongoose.model('Severity', SeveritySchema);
var injectedStageModel = mongoose.model('InjectedStage', InjectedStageSchema);
var rootCauseModel = mongoose.model('RootCause', RootCauseSchema);
var defectSummaryModel = mongoose.model('DefectSummary', DefectSummarySchema);
var teamModel = mongoose.model('Teams', TeamSchema);
var projectModel = mongoose.model('ProjectDetails', ProjectDetailsSchema);
module.exports = {
    Severity: severityModel,
    InjectedStage: injectedStageModel,
    RootCause: rootCauseModel,
    DefectSummary: defectSummaryModel,
    Teams: teamModel,
    ProjectDetails: projectModel
};