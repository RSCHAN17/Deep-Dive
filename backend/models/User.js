const db = require('../database/connection');

class User{
    constructor({user_id, username, password, email_address, spotting_points, achievement_points, total_points, current_pfp, current_title, daily_streak}) {
        this.user_id = user_id;
        this.username = username;
        this.password = password;
        this.email_address = email_address;
        this.spotting_points = spotting_points || 0.0;
        this.achievement_points = achievement_points || 0;
        this.total_points = Math.ceil(this.spotting_points) + this.achievement_points;
        this.current_pfp = current_pfp || '';
        this.current_title = current_title || '';
        this.daily_streak = daily_streak || 0;
    }

    static async getAll(){
        const response = await db.query("SELECT * FROM users;");
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
        const spot_response = await db.query("SELECT SUM(spot_points) FROM spottings WHERE user_id = $1;", [id]);
        const achievement_response = await db.query("SELECT SUM(value) FROM achievements WHERE achievement_id IN (SELECT achievement_id FROM achievement_user_complete WHERE user_id = $1);", [id]);
        const total_points = Math.ceil(spot_response) + achievement_response;
        const response = await db.query("UPDATE users SET spotting_points = $1, achievement_points = $2, total_points = $3 WHERE user_id = $4;", [spot_response, achievement_response, total_points, id]);
    } 
}

module.exports = User;