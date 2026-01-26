const db = require('../database/connection');

class Family{
    constructor({family_id, family_name, common_name, profile_picture}){
        this.family_id = family_id
        this.family_name = family_name
        this.common_name = common_name
        this.profile_picture = profile_picture
    }

    static async getAll(){
        const response = await db.query("SELECT * FROM families;")
        return response.rows.map(a => new Family(a));
    }

    static async getOneByID(id){
        const response = await db.query("SELECT * FROM families WHERE family_id = $1;", [id]);
        if (response.rows.length != 1){
            throw new Error("Unable to locate family.");
        }
        return new Family(response.rows[0]);
    }
}

module.exports = Family;