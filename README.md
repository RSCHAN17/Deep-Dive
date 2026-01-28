# Deep-Dive
Week 8-9 Project Beta Overview

# Spotted Application
Spotted is a web based application built to encourage people of all ages and backgrounds to explore the natural world around them. 

This application represents the middle ground between an association of professional and avid animal watchers and a fun, interactive game designed to ease people into this hobby.

The game relies on rewards for finding specific animals and certain unique species, allowing them to gain points based on animal rarity and completing achievements.
## 1. How To Use
When opening the application for the first time, users are invited to create a new profile. With the addition of a username, password and email address, they gain full access into every part of the game.
### 1.1 The Homepage & Navigation Overview
After logging in, you will be shown two main buttons:
-  __Sumbit Sightings__ will take the user to a page allowing them to upload photos of animals they have seen in the wild.
- __View the Map__ redirects the user to the map page.

Underneath these two buttons is a section detailing the daily and weekly challenges for the user. This is currently under construction and may not be readily available at time of reading this.

The __Navigation Bar__ located at the top right of the screen drops down giving the user three more locations to go to:
- __My account__ is the page dedicated to the user's profile, where they can edit their details and look at their most recent sightings.
- __About us__ leads to a short introduction of the four developers of this project and what our goals are.
- __Leaderboards__ will display the top users based on earned xp from their photographs and recently earned achievements.

### 1.2 Submitting Spottings
When entering the page to submit your spots, an external application will wake up and ask you to enter a photo. This pulls up a standard file selector so that you are able to load any pictures stored on your device.

After the picture is uploaded, the ML Chatbot will compare the image to every animal in our database and determine which one you have photographed. Alongside this, it will tell you how many of the animal is in the picture before requiring your username as confirmation that you would like to submit the image; and a pair of coordinates entered for the location at which you spotted the animal(s) in order for the map to work correctly.

Once the image is successfully stored in the database, you will then be redirected to your account page and will be able to see how many points you have earned.

### 1.3 How The Points System Work
Your total points will originate from one of three locations:
1. Firstly, completing daily and weekly challenges will earn you points once the construction of this element is complete. Though in the meantime you will not be able to gain points this way.

2. Every time you upload a photo, you are given points based on a variety of factors:
- To begin, each animal in the database has a points value ranging from 1 to 50.
    - Common animals will be worth few points; for example _rabbits_ and _woodpigeons_ are worth only one point. Rarer animals are worth more points; the _capercaillie_ and _alcathoe bat_ will both reward the player 50 points each.
- When a picture contains multiple of a single animal you will receive a __pack bonus multiplier__ which is either 1.1 for animals commonly seen in groups, 1.35 for animals sometimes seen in groups and 2 for solitary animals.
- The pack bonus is raised to the power of however many more animals there are than the expected one. 
    - One European Badger will award 18 points, finding two will reward 24.3 points, and getting a photograph of three will grant you 32.805 points because the multiplier for badgers is 1.35.
- This multiplier allows balance in the game, since rarer animals should not immediately be superceded by large groups of common animals.
    - e.g. Finding 20 pigeons will only award the player 6.73 points as to not disrupt the rewards of finding rarer animals.
3. The final way the user will gain points is through achievements.
- One set of achievements rewards points based off of the total number of spottings a user makes.
- Another set rewards points for finding a certain number of rare animals.
- The most extensive set of achievements are based on the family of the animals that the user can photograph, rewarding points by how many spottings of certain groups (such as deer, weasels or owls) the user has.

### 1.4 The Account Page

### 1.5 View The Map

### 1.6 Leaderboard