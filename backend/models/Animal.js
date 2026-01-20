const db = require('../database/connection');

class Animal{
    constructor({animal_id, name, type, group_behaviour, population_in_uk, capture_poins, pack_bonus_mult, description, fun_fact, profile_picture}){
        this.animal_id = animal_id;
        this.name = name;
        this.type = type;
        this.group_behaviour = group_behaviour;
        this.population_in_uk = population_in_uk;
        this.capture_poins = capture_poins;
        this.pack_bonus_mult = pack_bonus_mult;
        this.description = description;
        this.fun_fact = fun_fact || '';
        this.profile_picture = profile_picture || '';
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
        const { animal_id, name, type, group_behaviour, population_in_uk, capture_poins, pack_bonus_mult, description, fun_fact, profile_picture } = data;
        const alreadyExists = await db.query("SELECT * FROM animals WHERE name = $1", [name]);
        if (alreadyExists.rows.length !== 0) {
            throw new Error('Animal already exists.')
        }
        let response = await db.query("INSERT INTO animals (name, type, group_behaviour, population_in_uk, capture_poins, pack_bonus_mult, description, fun_fact, profile_picture) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING animal_id;", [name, type, group_behaviour, population_in_uk, capture_poins, pack_bonus_mult, description, fun_fact, profile_picture]);
        const new_id = response.rows[0].animal_id;
        const new_animal = await Animal.getOneByID(new_id);
        return new_animal;
    }
}

module.exports = Animal;