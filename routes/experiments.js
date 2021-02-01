const express = require('express');
const router = express.Router();
let Experiment = require('../models/experiment');


router.post('/add', (req, res, next) => {
    let experiment = new Experiment(req.body);
    Experiment.addExperiment(experiment, (err) => {
        if (err)
            return res.status(500).send("Server error!");
        return res.status(201).send("Experiment saved!");
    });
});

router.get('/all', (req, res, next) => {
    Experiment.getAllExperiments((err, experiments) => {
        if (err)
            return res.status(500).send("Server error!");
        return res.status(200).json(experiments);
    });
});

router.delete('/delete/:id', (req, res, next) => {
    Experiment.removeExperiment(req.params.id.toString(), (err) => {
        if (err)
            return res.status(500).send("Server error!");
        return res.status(204).send("Experiment removed!");
    });
});

module.exports = router;
