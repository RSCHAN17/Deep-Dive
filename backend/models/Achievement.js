const db = require('../database/connection');

class Achievement{
    constructor({achievement_id, achievement_name, achievement_description, value, title}){
        this.achievement_id = achievement_id;
        this.achievement_name = achievement_name;
        this.achievement_description = achievement_description;
        this.value = value;
        this.title = title;
    }

    static async getAll(){
        const response = await db.query("SELECT * FROM achievements;");
        return response.rows.map(p => new Achievement(p));
    }

    static async getOneByID(id){
        const response = await db.query("SELECT * FROM achievements WHERE achievement_id = $1;", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate achievement")
        }
        return new Achievement(response.rows[0]);
    }
}

module.exports = Achievement;