
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

//ovo ti je na localhost:8080/pdfs/NekiNazivPDFA
router.get('/:name', (req, res) => {
    //brisem ekstenziju ak je korisnik dodao i u svakom slucaju je ja dodajem
    let name=req.params.name.split(".pdf")[0]+".pdf";
    //ak ne pronadje fajl da vrati defaultni, ak pronadje da vrati taj fajl
    if (fs.existsSync(path.join(__dirname, '../pdfs/', name)))
        res.status(200).sendFile(path.resolve(path.join(__dirname, '../pdfs/',name)));
    else res.status(200).sendFile(path.resolve(path.join(__dirname, '../pdfs/', 'sample.pdf')));//default
});

module.exports = router;
