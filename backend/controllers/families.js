const Family = require('../models/Family');

async function uploadPhoto(req, res){
    try {
        let id = req.params.id;
        let photo = req.body.photo;
        const response = await Family.addPic(photo, id);
        res.status(201).json(response);
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

module.exports = {uploadPhoto}