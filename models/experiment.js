const mongoose = require('mongoose');

//Tabela, odnosno atributi, tip podataka i ostale gluposti
const ExperimentSchema = mongoose.Schema({
	
	pol: { type: String, required: true },
	starosnoDoba: { type: String, required: true },
	godineIskustva: { type: Number, required: true },
    satiDnevno: { type: Number, required: true },
    profesija: { type: Boolean, required: true },
    iskustvoKatastar: { type: Boolean, required: true },
	
	redosled: { type: Number, required: true },

    firstLokUlicaIBroj: { type: String, required: true },
    firstLokMesto: { type: String, required: true },
    firstLokBrKatParcele: { type: String, required: true },
    firstLokPovKatParcele: { type: String, required: true },
    firstLokBrObjekataNaParceli: { type: String, required: true },
    firstPodnosiocImePrez: { type: String, required: true },
    firstPodnosiocAdresa: { type: String, required: true },
    firstPodnosiocJmbg: { type: String, required: true },
    firstDostavaEmail: { type: String, required: true },
    firstDostavaMobilni: { type: String, required: true },
    firstLayoutTime: { type: Number, required: true },

    secondLokUlicaIBroj: { type: String, required: true },
    secondLokMesto: { type: String, required: true },
    secondLokBrKatParcele: { type: String, required: true },
    secondLokPovKatParcele: { type: String, required: true },
    secondLokBrObjekataNaParceli: { type: String, required: true },
    secondPodnosiocImePrez: { type: String, required: true },
    secondPodnosiocAdresa: { type: String, required: true },
    secondPodnosiocJmbg: { type: String, required: true },
    secondDostavaEmail: { type: String, required: true },
    secondDostavaMobilni: { type: String, required: true },
    secondLayoutTime: { type: Number, required: true },

    subjekatPreferira: { type: String, required: true },
    subjekatMisljenje: { type: String, required: false }
});



//OVO USER pod navodnicima je pod kojim ce se imenom ta tabela cuvat u bazi, plus eksoprtujemo sve
const Experiment = module.exports = mongoose.model('Experiment', ExperimentSchema);


//Krud operacije nad Tabelom pomocu biblioteke koju smo ucitali mongoose
module.exports.addExperiment = function (experiment, callback) {
    experiment.save(callback);
}

module.exports.saveExperiment = function (experiment, callback) {
    var query = {
        _id: experiment._id
    };
    Experiment.findOneAndUpdate(query, experiment, callback);
}

module.exports.getExperimentById = function (id, callback) {
    Experiment.findById(id, callback);
}

module.exports.getAllExperiments = function (callback) {
    Experiment.find({}, callback);
}

module.exports.removeExperiment = function (id, callback) {
    Experiment.findById(id, (err, experiment) => {
        experiment.remove(callback);
    });
}
