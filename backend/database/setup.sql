DROP TABLE IF EXISTS challenges;
DROP TABLE IF EXISTS achievement_user_complete;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS animals cascade;
DROP TABLE IF EXISTS users cascade;
DROP TABLE IF EXISTS spottings;

CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    email_address VARCHAR(75) UNIQUE NOT NULL,
    spotting_points FLOAT,
    achievement_points INT,
    total_points INT,
    current_pfp VARCHAR(255),
    current_title VARCHAR(80),
    daily_streak INT,
    PRIMARY KEY (user_id)
);

CREATE TABLE animals (
    animal_id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    group_behaviour VARCHAR(50) NOT NULL,
    population_in_uk INT NOT NULL,
    capture_points INT NOT NULL,
    pack_bonus_mult FLOAT NOT NULL,
    description VARCHAR(255) NOT NULL,
    fun_fact VARCHAR(255),
    profile_picture VARCHAR(255),
    PRIMARY KEY (animal_id)
);

CREATE TABLE spottings (
    spot_id INT GENERATED ALWAYS AS IDENTITY,
    date_time TIMESTAMP NOT NULL,
    user_id INT NOT NULL,
    animal_id INT NOT NULL,
    animal_count INT NOT NULL,
    location POINT NOT NULL,
    spot_points FLOAT,
    image_url VARCHAR(255) NOT NULL,
    PRIMARY KEY (spot_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (animal_id) REFERENCES animals(animal_id)
);

CREATE TABLE achievements (
    achievement_id INT GENERATED ALWAYS AS IDENTITY,
    achievement_name VARCHAR(50) UNIQUE NOT NULL,
    achievement_description VARCHAR(255) NOT NULL,
    value INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    PRIMARY KEY (achievement_id)
);

CREATE TABLE achievement_user_complete (
    id INT GENERATED ALWAYS AS IDENTITY,
    achievement_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE challenges (
    id INT GENERATED ALWAYS AS IDENTITY,
    challenge_name VARCHAR(50) NOT NULL,
    challenge_description VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);