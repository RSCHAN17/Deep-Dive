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

    static async checkGet(user_id){

        let newResponse;
        
        const allAchievements = await Achievement.getAll()
        for (let i = 0; i < allAchievements.length; i ++){
            // determine which type of achievement it is
            if (allAchievements[i].achievement_description.includes('family')){
                // family related achievement:::
                let splitText = allAchievements[i].achievement_description.split("the ")
                let family = splitText[splitText.length - 1].split(" family")[0]
                let numberOf = parseInt(splitText[0].split(" ")[1])

                let family_id = await db.query("SELECT family_id FROM families WHERE UPPER(common_name) = UPPER($1);", [family])

                let response = await db.query("SELECT * FROM spottings WHERE animal_name IN (SELECT name FROM animals WHERE family_id = $1);", [family_id])

                if (response.rows.length >= numberOf){
                    if (!alreadyThere(user_id, allAchievements[i])){
                        newResponse = await db.query("INSERT INTO achievement_user_complete (user_id, achievement_id) VALUES ($1, $2) RETURNING user_id);", [user_id,achievement_id]);
                        
                    }
                }
            }
        }
        
        return user_id;
    }
}

async function alreadyThere(user_id, achievement_id) {
    const response = await db.query("SELECT * FROM achievement_user_complete WHERE user_id = $1 AND achievement_id = $2;", [user_id, achievement_id])
    if (response.rows.length != 1) {
        return false;
    } else {
        return true;
    }
}

module.exports = Achievement;