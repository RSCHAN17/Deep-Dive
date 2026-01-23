const db = require('../database/connection');

class Spotting{
    constructor({spot_id, date_time, username, animal_name, animal_count, location, spot_points, image_url}){
        this.spot_id = spot_id;
        this.date_time = date_time;
        this.userna = username;
        this.animal_name = animal_name;
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

    static async filterByUser(username){
        const response = await db.query("SELECT * FROM spottings WHERE username = $1;", [username]);
        if (response.rows.length == 0) {
            throw new Error("No animal spottings from this user!")
        }
        return response.rows.map(p => new Spotting(p));
    }

    static async create(data){
        const {date_time, username, animal_name, animal_count, location, image_url} = data;
        const point_response = await db.query("SELECT capture_points FROM animals WHERE animal_name = $1;", [animal_name]);
        const mult_response = await db.query("SELECT pack_bonus_mult FROM animals WHERE animal_name = $1;", [animal_name]);
        if (point_response.rows.length != 1 || mult_response.rows.length != 1) {
            throw new Error("Unable to locate animal.")
        }
        const spot_score = point_response.rows[0].capture_points * Math.pow(mult_response.rows[0].pack_bonus_mult, animal_count-1);
        let response = await db.query("INSERT INTO spottings (date_time, username, animal_name, animal_count, location, spot_points, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING spot_id;", [date_time, username, animal_name, animal_count, location, spot_score, image_url]);
        const new_id = response.rows[0].spot_id;
        const new_spot = await Spotting.getOneByID(new_id);
        return new_spot;
    }

    static async filterByType(type){
        const response = await db.query("SELECT * FROM spottings WHERE animal_name IN (SELECT animal_name FROM animals WHERE type = $1);", [type]);
        if (response.rows.length == 0) {
            throw new Error("No animal spottings of this type!")
        }
        return response.rows.map(p => new Spotting(p));
    }
}

module.exports = Spotting;