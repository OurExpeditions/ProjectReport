var express = require('express');
var router = express.Router();

var defectInfo = require('./models/defect-model');

// api ---------------------------------------------------------------------
// get all maintenance
// ------------------ GET ALL METHODS -----------------
router.get('/defect/severities', function (req, res) {
    defectInfo.Severity.find(function (err, severities) {
        if (err)
            res.send(err);
        res.send(severities);
    })
});

router.get('/defect/identifiedInjectedStages', function (req, res) {
    defectInfo.InjectedStage.find(function (err, stages) {
        if (err) {
            res.send(err);
        }
        res.send(stages);
    })
});

router.get('/defect/getDefects', function (req, res) {
    defectInfo.DefectSummary.find(function (err, defects) {
        if (err) {
            res.send(err);
        }
        res.send(defects);
    })
});

router.get('/defect/getRootCauses', function (req, res) {
    defectInfo.RootCause.find(function (err, rootCauses) {
        if (err) {
            res.send(err);
        }
        res.send(rootCauses);
    })
});

router.get('/defect/teamsInfo', function (req, res) {
    //console.log('App Name Getting ASSSS   ', req.query['app']);
    var query;
    if (req.query['app'] === undefined || req.query['app'] == null) {
        query = defectInfo.Teams.find();
    }
    else {
        query = defectInfo.Teams.find({appName: req.query['app']});
    }
    query.exec(function (err, teams) {
        if (err) {
            res.send(err);
        }
        res.send(teams);
    });
});
router.get('/defect/getProjectDetails', function (req, res) {
    defectInfo.ProjectDetails.find(function (err, projects) {
        if (err) {
            res.send(err);
        }
        res.send(projects);
    })
});
// -------------- END GET METHODS -------------
// -------------- START POST METHODS ----------
router.post('/defect/saveDefect', function (req, res) {
    defectInfo.DefectSummary.create({
        _id: req.body.defectId,
        severity: req.body.severity,
        appName: req.body.appName,
        team: req.body.teamName,
        projectName: req.body.projectName,
        injectedStage: req.body.injectedStage,
        identifiedStage: req.body.identifiedStage,
        rootCause: req.body.rootCause,
        solutionToFix: req.body.solutionToFix,
        comments: req.body.comments,
        description: req.body.description,
        createdDate: req.body.createdDate,
        createdBy: req.body.createdBy
    }, function (err, defect) {
        if (err) {
            res.send(err);
        }
        res.send(defect);
    })
});

router.post('/defect/severity', function (req, res) {
    //console.log("Getting Asss...", req.body);
    defectInfo.Severity.create({
        _id: req.body.id,
        type: req.body.type
    }, function (err, severity) {
        if (err) {
            res.send(err);
        }
        //console.log(" asfj asdf  ", severity);
        res.send(severity);
    })
});

router.post('/defect/addIdentifiedInjectedStages', function (req, res) {
    defectInfo.InjectedStage.create({
        _id: req.body.id,
        type: req.body.type
    }, function (err, stage) {
        if (err) {
            res.send(err);
        }
        res.send(stage);
    })
});

router.post('/defect/addRootCause', function (req, res) {
    defectInfo.RootCause.create({
        _id: req.body.id,
        type: req.body.type
    }, function (err, rootCause) {
        if (err) {
            res.send(err);
        }
        res.send(rootCause);
    })
});
router.post('/defect/addTeam', function (req, res) {
    defectInfo.Teams.create({
        _id: req.body.id,
        appName: req.body.appName,
        team: req.body.team
    }, function (err, team) {
        if (err) {
            res.send(err);
        }
        res.send(team);
    })
});
router.post('/defect/addProjectDetails', function (req, res) {
    console.log(" getting body As    ", req.body);
    defectInfo.ProjectDetails.create({
        team: req.body.teamName,
        releaseDate: req.body.releaseDate,
        devMonth: req.body.devMonth,
        projectName: req.body.projectName,
        storyPoints: req.body.storyPoints,
        artifacts: req.body.artifacts,
        risks: req.body.risks,
        achievements: req.body.achievements,
        valueAdds: req.body.valueAdds,
        retrospectionDone: req.body.retrospectionDone === "Yes"
    }, function (err, project) {
        if (err) {
            res.send(err);
        }
        res.send(project);
    });
});
// -------------- END POST METHODS -------------
// -------------- Update Defect ----------------
router.post('/defect/updateDefect', function (req, res) {
    //console.log(" Defect Update ASSSSS ", req.body);
    defectInfo.DefectSummary.findByIdAndUpdate({_id: req.body._id},
        req.body,
        function (err, defect) {
            if (err) {
                res.send(err);
            }
            //console.log(' afkjfka Update Result     ', defect);
            res.send(defect);
        }
    )
});
router.post('/defect/updateProject', function (req, res) {
    defectInfo.ProjectDetails.findAndModify({_id: req.body._id},
        req.body,
        function (err, project) {
            if (err) {
                res.send(err);
            }
            res.send(project);
        }
    )
});

// -------------- End of Update ---------------------
// -------------- Delete Defect ---------------------
router.delete('/defect/deleteDefect', function (req, res) {
    var query = defectInfo.DefectSummary.findByIdAndRemove({_id: req.query['itemId']});
    query.exec(function (err, defect) {
        if (err) {
            res.send(err);
        }
        res.send(defect);
    })
});

router.delete('/defect/deleteProject', function (req, res) {
    var query = defectInfo.ProjectDetails.findByIdAndRemove({_id: req.query['prId']});
    query.exec(function (err, project) {
        if (err) {
            res.send(err);
        }
        res.send(project);
    })
});
/*------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.

module.exports = router;