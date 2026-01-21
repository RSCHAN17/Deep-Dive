const Spotting = require('../models/Spotting');

async function index(req, res) { 
    try {
        const spots = await Spotting.getAll();
        res.status(200).json(spots);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function show(req, res) { 
    try {
        let id = req.params.id;
        const spot = await Spotting.getOneByID(id);
        res.status(200).json(spot)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function filterByUser(req, res) {
    try {
        let id = req.params.id;
        const spots = await Spotting.filterByUser(id);
        res.status(200).json(spots)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function create(req, res) {
    try {
        const data = req.body;
        const result = await Spotting.create(data);
        res.status(201).send(result);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = { index, show, filterByUser, create }