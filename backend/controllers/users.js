const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res) {
    try {
        const data = req.body;

        if (!data.username || !data.password || !data.email_address){
            throw new Error('Invalid user details');
        }

        // generate salt with specific cost
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));

        // hash password
        data["password"] = await bcrypt.hash(data.password, salt);
        const result = await User.create(data);

        res.status(201).send(result);
    } catch (err) {
        if (err.message.includes('already taken')) {
            return res.status(409).json({ error: err.message });
        }
        res.status(500).json({ error: 'Registration failed:' + err.message });
    }
}

async function login(req, res) {
    try {
        const data = req.body;

        if (!data.username || !data.password) {
            throw new Error('Please provide username and password')
        }

        const user = await User.getOneByUsername(data.username);

        const match = await bcrypt.compare(data.password, user.password)
        if (!match) {
            throw new Error('Invalid credentials')
        }

        const payload = {
            user_id: user.user_id,
            username: user.username
        }

        const sendToken = (err, token) => {
            if(err) { 
                throw new Error('Error in token generation')
            }
            res.status(200).json({
                success: true,
                token: token,
                user: {username: user.username, email_address: user.email_address}
            });
        }

        jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 3600 }, sendToken);

    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

async function index(req, res) {
    try {
        const users = await User.getAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function show (req, res) {
    try {
        let id = req.params.id;
        const user = await User.updatePointsByID(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

async function getPFP(req, res) {
    try {
        let id = req.params.id;
        const user = await User.updatePointsByID(id);
        let profiles_available = user.getAvailablePFPs();
        res.status(200).send(profiles_available);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function setPFP(req, res){
    try {
        let id = req.params.id;
        let animal_id = req.body;
        const user = await User.updatePointsByID(id);
        new_face = user.setPFP(animal_id);
        res.status(202).json(new_face);
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function getTitle(req, res) {
    try {
        let id = req.params.id;
        const user = await User.getOneByID(id);
        let titles_available = user.getAvailableTitles();
        res.status(200).send(titles_available);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function setTitle(req, res){
    try {
        let id = req.params.id;
        let achievement_id = req.body;
        const user = await User.updatePointsByID(id);
        new_title = user.setTitle(achievement_id);
        res.status(202).json(new_title);
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

module.exports = { 
    register,
    login,
    index, 
    show,
    getPFP,
    setPFP,
    getTitle,
    setTitle }