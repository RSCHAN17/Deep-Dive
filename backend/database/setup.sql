DROP TABLE IF EXISTS families cascade;
DROP TABLE IF EXISTS challenges cascade;
DROP TABLE IF EXISTS challenge_user_complete cascade;
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
    spotting_points FLOAT DEFAULT 0.0,
    achievement_points INT DEFAULT 0,
    challenge_points INT DEFAULT 0,
    total_points INT DEFAULT 0,
    current_pfp TEXT,
    current_title VARCHAR(80),
    daily_streak INT,
    PRIMARY KEY (user_id)
);

CREATE TABLE families (
    family_id INT GENERATED ALWAYS AS IDENTITY,
    family_name VARCHAR(50),
    common_name VARCHAR(50),
    profile_picture TEXT,
    PRIMARY KEY (family_id)
);

CREATE TABLE animals (
    animal_id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    capture_points INT NOT NULL,
    pack_bonus_mult FLOAT NOT NULL,
    description VARCHAR(255) NOT NULL,
    fun_fact VARCHAR(255),
    zoo_image TEXT,
    species VARCHAR(255) UNIQUE NOT NULL,
    family_id INT NOT NULL,
    PRIMARY KEY (animal_id),
    FOREIGN KEY (family_id) REFERENCES families(family_id)
);



CREATE TABLE spottings (
    spot_id INT GENERATED ALWAYS AS IDENTITY,
    date_time TIMESTAMP NOT NULL,
    username VARCHAR(255) NOT NULL,
    animal_name VARCHAR(50) NOT NULL,
    animal_count INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    spot_points FLOAT,
    image_url TEXT NOT NULL,
    PRIMARY KEY (spot_id),
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (animal_name) REFERENCES animals(name)
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
    points INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE challenge_user_complete (
    id INT GENERATED ALWAYS AS IDENTITY, 
    user_id INT NOT NULL,
    challenge_id INT NOT NULL,
    challenge_score INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (challenge_id) REFERENCES challenges(id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);