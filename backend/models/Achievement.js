const { all } = require('../app');
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
        let current_achievement;
        
 

        const allAchievements = await Achievement.getAll()
       

        for (let i = 0; i < allAchievements.length; i ++){
            current_achievement = allAchievements[i]


            let thing = await alreadyThere(user_id, current_achievement.achievement_id);
            //console.log(thing);
            if (!thing){

                //console.log(current_achievement.achievement_id);

                let description = current_achievement.achievement_description;
                // determine type of achievement
                if (description.includes('family')){
                    // this is a family based achievement!
                    let splitText = description.split('the ');
                    let familySplit = splitText[splitText.length - 1].split(" family")[0]
   
                    splitText = description.split(" ")
                    let numberOf = parseInt(splitText[1])

                    let family_response = await db.query("SELECT family_id FROM families WHERE UPPER(common_name) = UPPER($1);", [familySplit])
                    let family_id = family_response.rows[0].family_id

                    let response = await db.query("SELECT * FROM spottings WHERE username IN (SELECT username FROM users WHERE user_id = $1) AND animal_name IN (SELECT name FROM animals WHERE family_id = $2);", [user_id, family_id])

                    if (response.rows.length >= numberOf){
                        newResponse = await db.query("INSERT INTO achievement_user_complete (user_id, achievement_id) VALUES ($1, $2) RETURNING user_id;", [user_id, current_achievement.achievement_id])
                    }
                }
            }

        }
        
        return parseInt(user_id);
    }
}

async function alreadyThere(user_id, achievement_id) {
    const response = await db.query("SELECT * FROM achievement_user_complete WHERE user_id = $1 AND achievement_id = $2;", [user_id, achievement_id]);
    //console.log(response.rows.length);
    if (response.rows.length !== 1) {
        return false;
    } else {
        return true;
    }
}

module.exports = Achievement;