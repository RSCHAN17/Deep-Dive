const db = require('../database/connection');

class Challenge{
    constructor({challenge_id,challenge_desc,challenge_reward}){
        this.challenge_id = challenge_id;
        this.challenge_desc = challenge_desc;
        this.challenge_reward = challenge_reward;
    }
    static async getAll(){
        const response = await db.query("SELECT * FROM challenges;")
        return response.rows.map(a => new Challenge(a));
    }
}

module.exports = Challenge
