const Animal = require('../models/Animal');

async function index(req, res) { 
    try {
        const animals = await Animal.getAll();
        res.status(200).json(animals);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function show(req, res) { 
    try {
        let id = req.params.id;
        const animal = await Animal.getOneByID(id);
        res.status(200).json(animal)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function create(req, res) {
    try {
        const data = req.body;
        const result = await Animal.create(data);
        res.status(201).send(result);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function uploadPhoto(req, res){
    try {
        let id = req.params.id
        let photo = req.body.photo
        const response = await Animal.addPic(photo, id)
        res.status(201).json(response)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

module.exports = { index, show, create, uploadPhoto }