const db = require('../database/connection');

class Animal{
    constructor({animal_id, name, type, capture_points, pack_bonus_mult, description, fun_fact, zoo_image, species, family_id}){
        this.animal_id = animal_id;
        this.name = name;
        this.type = type;
        this.capture_points = capture_points;
        this.pack_bonus_mult = pack_bonus_mult;
        this.description = description;
        this.fun_fact = fun_fact || '';
        this.zoo_image = zoo_image;
        this.species = species;
        this.family_id = family_id;
    }

    static async getAll(){
        const response = await db.query("SELECT * FROM animals;")
        return response.rows.map(a => new Animal(a));
    }

    static async getOneByID(id){
        const response = await db.query("SELECT * FROM animals WHERE animal_id = $1;", [id]);
        if (response.rows.length != 1){
            throw new Error("Unable to locate animal.");
        }
        return new Animal(response.rows[0]);
    }

    static async getOneByName(name){
        const response = await db.query("SELECT * FROM animals WHERE name = $1;", [name]);
        if (response.rows.length != 1){
            throw new Error("Unable to locate animal.");
        }
        return new Animal(response.rows[0]);
    }

    static async create(data) {
        const {name, type, capture_points, pack_bonus_mult, description, fun_fact, zoo_image, species, family_id } = data;
        const alreadyExists = await db.query("SELECT * FROM animals WHERE name = $1", [name]);
        if (alreadyExists.rows.length !== 0) {
            throw new Error('Animal already exists.')
        }
        let response = await db.query("INSERT INTO animals (name, type, capture_points, pack_bonus_mult, description, fun_fact, zoo_image, species, family_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING animal_id;", [name, type, capture_points, pack_bonus_mult, description, fun_fact, zoo_image, species, family_id]);
        const new_id = response.rows[0].animal_id;
        const new_animal = await Animal.getOneByID(new_id);
        return new_animal;
    }

    static async addPic(photo, id){ 
        const response = await db.query("UPDATE animals SET zoo_image = $1 WHERE animal_id = $2 returning animal_id;", [photo, id]);
        return response.rows[0].animal_id;
    }
}

module.exports = Animal;