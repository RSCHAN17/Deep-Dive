const Challenge = require('../models/Challenge')

async function index(req, res) { 
    try {
        const challenges = await Challenge.getAll();
        res.status(200).json(challenges);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = { index }