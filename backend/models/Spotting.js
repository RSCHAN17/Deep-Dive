const db = require('../database/connection');

class Spotting{
    constructor({spot_id, date_time, user_id, animal_id, animal_count, location, spot_points, image_url}){
        this.spot_id = spot_id;
        this.date_time = date_time;
        this.user_id = user_id;
        this.animal_id = animal_id;
        this.animal_count = animal_count;
        this.location = location;
        this.spot_points = spot_points || 0.0;
        this.image_url = image_url;
    }

    static async getAll(){
        const response = await db.query("SELECT * FROM spottings;");
        return response.rows.map(p => new Spotting(p));
    }

    static async getOneByID(id){
        const response = await db.query("SELECT * FROM spottings WHERE spot_id = $1;", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate animal spotting.")
        }
        return new Spotting(response.rows[0]);
    }

    static async filterByUser(user_id){
        const response = await db.query("SELECT * FROM spottings WHERE user_id = $1;", [user_id]);
        if (response.rows.length == 0) {
            throw new Error("No animal spottings from this user!")
        }
        return response.rows.map(p => new Spotting(p));
    }

    static async create(data){
        const {date_time, user_id, animal_id, animal_count, location, image_url} = data;
        const point_response = await db.query("SELECT capture_points FROM animals WHERE animal_id = $1;", [animal_id]);
        const mult_response = await db.query("SELECT pack_bonus_mult FROM animals WHERE animal_id = $1;", [animal_id]);
        if (point_response.rows.length != 1 || mult_response.rows.length != 1) {
            throw new Error("Unable to locate animal.")
        }
        const spot_score = point_response.rows[0] * Math.pow(mult_response.rows[0], animal_count);
        let response = await db.query("INSERT INTO spottings (date_time, user_id, animal_id, animal_count, location, spot_points, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING spot_id;", [date_time, user_id, animal_id, animal_count, location, spot_score, image_url]);
        const new_id = response.rows[0].spot_id;
        const new_spot = await Spotting.getOneByID(new_id);
        return new_spot;
    }

    static async filterByType(type){
        const response = await db.query("SELECT * FROM spottings WHERE animal_id IN (SELECT animal_id FROM animals WHERE type = $1);", [type]);
        if (response.rows.length == 0) {
            throw new Error("No animal spottings of this typw!")
        }
        return response.rows.map(p => new Spotting(p));
    }
}

module.exports = Spotting;