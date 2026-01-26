const db = require('../database/connection');
const Family = require('./Family');
const Achievement = require('./Achievement');
const Animal = require('./Animal');

class User{
    constructor({user_id, username, password, email_address, spotting_points, achievement_points, challenge_points, total_points, current_pfp, current_title, daily_streak}) {
        this.user_id = user_id;
        this.username = username;
        this.password = password;
        this.email_address = email_address;
        this.spotting_points = spotting_points || 0.0;
        this.achievement_points = achievement_points || 0;
        this.challenge_points = challenge_points || 0;
        this.total_points = Math.ceil(this.spotting_points) + this.achievement_points + this.challenge_points;
        this.current_pfp = current_pfp || '';
        this.current_title = current_title || '';
        this.daily_streak = daily_streak || 0;
    }

    static async getAll(){
        const response = await db.query("SELECT * FROM users ORDER BY total_points DESC;");
        return response.rows.map(p => new User(p));
    }

    static async getOneByID(id){
        const response = await db.query("SELECT * FROM users WHERE user_id = $1;", [id]);
        if (response.rows.length != 1){
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async getOneByUsername(name){
        const response = await db.query("SELECT * FROM users WHERE username = $1;", [name]);
        if (response.rows.length != 1){
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async create(data){
        const { username, password, email_address } = data;
        const emailTaken = await db.query("SELECT * FROM users WHERE email_address = $1;", [email_address]);
        if (emailTaken.rows.length !== 0) {
            throw new Error('Email address is already taken.');
        }
        const usernameTaken = await db.query("SELECT * FROM users WHERE username = $1;", [username]);
        if (usernameTaken.rows.length !== 0){
            throw new Error('Username is already taken.');
        }
        let response = await db.query("INSERT INTO users (username, password, email_address) VALUES ($1, $2, $3) RETURNING user_id;", [username, password, email_address]);
        const new_id = response.rows[0].user_id;
        const new_user = await User.getOneByID(new_id);
        return new_user;
    }

    static async updatePointsByID(id){
        console.log('step 2');
        const user_id = await Achievement.checkGet(id);
        console.log('step 4');
        const user = await User.getOneByID(parseInt(user_id));
        console.log('step 5');
        // previously ^^ This just got by id, but we want to check achievements are got
        const spot_response = await db.query("SELECT COALESCE(SUM(spot_points),0) FROM spottings WHERE username = $1;", [user.username]);
        const spot_score = spot_response.rows[0].coalesce;

        const achievement_response = await db.query("SELECT COALESCE(SUM(value),0) FROM achievements WHERE achievement_id IN (SELECT achievement_id FROM achievement_user_complete WHERE user_id = $1);", [id]);
        const achievement_score = achievement_response.rows[0].coalesce;

        const challenge_response = await db.query("SELECT COALESCE(SUM(challenge_score),0) FROM challenge_user_complete WHERE user_id = $1;", [id]);
        const challenge_score = challenge_response.rows[0].coalesce;

        const total_points = Math.ceil(spot_score) + achievement_score + challenge_score;
        console.log(total_points);
        const response = await db.query("UPDATE users SET spotting_points = $1, achievement_points = $2, total_points = $3 WHERE user_id = $4 RETURNING user_id;", [spot_score, achievement_score, total_points, id]);
        const player_id = response.rows[0].user_id;
        const player = await User.getOneByID(player_id);
        return player;
    } 


    async getAvailablePFPs(){
        let response = [];
        if (this.username === 'dev'){
            response = await db.query('SELECT * FROM families;');
        } else {
            response = await db.query("SELECT * FROM families WHERE family_id IN (SELECT family_id FROM animals WHERE animal_id IN (SELECT animal_id FROM spottings WHERE username = $1));", [this.username]);
        }
        return response.rows;
        
        
    }

    async setPFP(family){
        const response = await db.query("UPDATE users SET current_pfp = $1 WHERE user_id = $2 RETURNING user_id;", [family, this.user_id]);
        const fresh_pic = response.rows[0].user_id;
        return await User.getOneByID(fresh_pic);
    }

    async getAvailableTitles() {
        let response = []
        if (this.username === 'dev') {
            response = await db.query("SELECT title FROM achievements;");
        } else {
            response = await db.query("SELECT title FROM achievements WHERE achievement_id IN (SELECT achievement_id FROM achievement_user_complete WHERE user_id = $1);", [this.user_id]);
        }
        return response.rows.map(r => r.title);
    }

    async setTitle(title) {
        const response = await db.query("UPDATE users SET current_title = $1 WHERE user_id = $2 RETURNING user_id;", [title, this.user_id]);
        const fresh_title = response.rows[0].user_id;
        return await User.getOneByID(fresh_title);
    }

    async updatePassword(newPassword){
        const response = await db.query("UPDATE users SET password = $1 WHERE user_id = $2 RETURNING user_id;", [newPassword, this.user_id]);
        const ID = response.rows[0].user_id;
        return await User.getOneByID(ID);
    }

    async getZoo() {
        const response = await db.query("SELECT * FROM animals WHERE name IN (SELECT animal_name FROM spottings WHERE username = $1);", [this.username])
        return response.rows.map(r => new Animal(r))
    }
}

module.exports = User;