const db = require('../database/connection');

class Challenge{
    constructor({challenge_id, challenge_name, challenge_description ,points}){
        this.challenge_id = challenge_id;
        this.challenge_name = challenge_name;
        this.challenge_description = challenge_description;
        this.points = points;
    }
    static async getAll(){
        const response = await db.query("SELECT * FROM challenges;")
        return response.rows.map(a => new Challenge(a));
    }
}

module.exports = Challenge
