const mongoose = require('mongoose');

//Tabela, odnosno atributi, tip podataka i ostale gluposti
const UsersSchema = mongoose.Schema({
    name: { type: String, default: "noname", required: true },
});



//OVO USER pod navodnicima je pod kojim ce se imenom ta tabela cuvat u bazi, plus eksoprtujemo sve
const User = module.exports = mongoose.model('User', UsersSchema);


//Krud operacije nad Tabelom pomocu biblioteke koju smo ucitali mongoose
module.exports.addUser = function (user, callback) {
    user.save(callback);
}

module.exports.saveUser = function (user, callback) {
    var query = {
        _id: user._id
    };
    User.findOneAndUpdate(query, user, callback);
}

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}

module.exports.geAll = function (callback) {
    User.find({}, callback);
}

module.exports.removeUser = function (id, callback) {
    User.findById(id, (err, user) => {
        user.remove(callback);
    });
}
