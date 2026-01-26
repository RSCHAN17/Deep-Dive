const Achievement = require('../models/Achievement');

async function index(req, res) { 
    try {
        const achievements = await Achievement.getAll();
        res.status(200).json(achievements);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function show(req, res) { 
    try {
        let id = req.params.id;
        const ach = await Achievement.getOneByID(id);
        res.status(200).json(ach)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function checkGet(req, res) {
    try {
        let id = req.params.id;
        const result = await Achievement.checkGet(id)
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = { index, show, checkGet }
