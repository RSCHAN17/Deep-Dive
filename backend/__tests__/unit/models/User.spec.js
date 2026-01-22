const User = require('../../../models/User');
const Family = require('../../../models/Family');
const db = require('../../../database/connection');
const { getOneByID } = require('../../../models/Family');
const Achievement = require('../../../models/Achievement');

describe('User Model', () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe('getAll', () => {
        it('Returns all user information sorted by total points', async () => {
            const mockUsers =[
                {user_id: 1, username: 'a', password: 'd', email_address: 'ab', spotting_points: 3, achievement_points: 44, challenge_points: 3, total_points: 50, current_pfp: 'a', current_title: 'a', daily_streak: 4},
                {user_id: 2, username: 'b', password: 'c', email_address: 'cd', spotting_points: 8, achievement_points: 30, challenge_points: 2, total_points: 40, current_pfp: 'a', current_title: 'a', daily_streak: 3},
                {user_id: 3, username: 'c', password: 'b', email_address: 'ef', spotting_points: 10, achievement_points: 6, challenge_points: 54, total_points: 70, current_pfp: 'a', current_title: 'a', daily_streak: 2},
                {user_id: 4, username: 'd', password: 'a', email_address: 'gh', spotting_points: 22, achievement_points: 46, challenge_points: 0, total_points: 68, current_pfp: 'a', current_title: 'a', daily_streak: 1}
            ]

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockUsers[2], mockUsers[3], mockUsers[0], mockUsers[1]]});

            const users = await User.getAll()

            expect(users).toHaveLength(4);
            expect(users[0]).toHaveProperty('user_id');
            expect(users[0].username).toBe('c');
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM users ORDER BY total_points DESC;");
        })
    })

    describe('getOneByID', () => {
        it('Returns user on successful db query', async () => {
            const mockUser = {user_id: 1, username: 'a', password: 'd', email_address: 'ab', spotting_points: 3, achievement_points: 44, challenge_points: 3, total_points: 50, current_pfp: 'a', current_title: 'a', daily_streak: 4};
            
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockUser] });

            const result = await User.getOneByID(1);

            expect(result).toBeInstanceOf(User);
            expect(result.username).toBe('a');
            expect(result.total_points).toBe(50);
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM users WHERE user_id = $1;", [1])
        })

        it('Throws error when user not found', async () =>{
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            await expect(User.getOneByID(9999)).rejects.toThrow("Unable to locate user.");
        })
    })

    describe('getOneByUsername', () =>{
        it('Returns user on successful db query', async () => {
            const mockUser = {user_id: 1, username: 'a', password: 'd', email_address: 'ab', spotting_points: 3, achievement_points: 44, challenge_points: 3, total_points: 50, current_pfp: 'a', current_title: 'a', daily_streak: 4};
            
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockUser] });

            const result = await User.getOneByUsername('a');

            expect(result).toBeInstanceOf(User);
            expect(result.username).toBe('a');
            expect(result.total_points).toBe(50);
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM users WHERE username = $1;", ['a'])
        })

        it('Throws error when user not found', async () =>{
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            await expect(User.getOneByUsername('b')).rejects.toThrow("Unable to locate user.");
        })
    })

    describe('create', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        it('Creates new user when username and email are valid', async () => {
            const data = { username: 'dev', password: 'test', email_address: 'test' }

            jest.spyOn(db, 'query')
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({ rows: [{ user_id: 1 }] })

            const mockUser = {
                user_id: 1, username: 'dev', password: 'test', email_address: 'test',  spotting_points: 0.0, achievement_points: 0, challenge_points: 0, total_points: 0, current_pfp: '', current_title: '', daily_streak: 0
            }
            jest.spyOn(User, 'getOneByID').mockResolvedValueOnce(mockUser)
            const result = await User.create(data)

            expect(db.query).toHaveBeenCalledTimes(3)
            expect(result).toEqual(mockUser)
            expect(db.query).toHaveBeenNthCalledWith(1, "SELECT * FROM users WHERE email_address = $1;", ['test'])
            expect(db.query).toHaveBeenNthCalledWith(2, "SELECT * FROM users WHERE username = $1;", ['dev'])
            expect(db.query).toHaveBeenNthCalledWith(3, "INSERT INTO users (username, password, email_address) VALUES ($1, $2, $3) RETURNING user_id;", ['dev', 'test', 'test'])
            expect(User.getOneByID).toHaveBeenCalledTimes(1)
        })

        it('Throws error if email is already taken', async () => {
            const data = { username: 'dev', password: 'test', email_address: 'test' }

            jest.spyOn(db, 'query')
            .mockResolvedValueOnce({rows: [1]})

            await expect(User.create(data)).rejects.toThrow('Email address is already taken.')
        })

        it('Throws error if username is already taken', async () => {
            const data = { username: 'dev', password: 'test', email_address: 'test' }

            jest.spyOn(db, 'query')
            .mockResolvedValueOnce({rows: [ ]})
            .mockResolvedValueOnce({rows: [1]})

            await expect(User.create(data)).rejects.toThrow('Username is already taken.')
        })
    })

    describe('getAvailablePFPs', () => {
        it('Returns all available profile pictures', async () => {
            const families = [{profile_picture: 'a'}, {profile_picture: 'b'}, {profile_picture: 'c'}]

            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: families})
            const mockUser = new User({user_id: 1, username: 'a', password: 'd', email_address: 'ab', spotting_points: 3, achievement_points: 44, challenge_points: 3, total_points: 50, current_pfp: 'a', current_title: 'a', daily_streak: 4})
            const result = await mockUser.getAvailablePFPs()

            expect(db.query).toHaveBeenCalledTimes(1)
            expect(result).toEqual(['a', 'b', 'c'])
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM families WHERE family_id IN (SELECT family_id FROM animals WHERE animal_id IN (SELECT animal_id FROM spottings WHERE user_id = $1));", [mockUser.user_id])
        })
    })

    describe('getAvailableTitles', () => {
        it('Returns all available titles', async () => {
            const titles = [{title: 'a'}, {title: 'b'}, {title: 'c'}]

            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: titles})
            const mockUser = new User({user_id: 1, username: 'a', password: 'd', email_address: 'ab', spotting_points: 3, achievement_points: 44, challenge_points: 3, total_points: 50, current_pfp: 'a', current_title: 'a', daily_streak: 4})
            const result = await mockUser.getAvailableTitles()

            expect(db.query).toHaveBeenCalledTimes(1)
            expect(result).toEqual(['a', 'b', 'c'])
            expect(db.query).toHaveBeenCalledWith("SELECT title FROM achievements WHERE achievement_id IN (SELECT achievement_id FROM achievement_user_complete WHERE user_id = $1);", [mockUser.user_id])
        })
    })

    describe('setPFP', () => {
        it('Updates new profile picture and returns the user', async () => {
            const family = { profile_picture: 'b' }
            const oldUser = new User({user_id: 1, username: 'a', password: 'd', email_address: 'ab', spotting_points: 3, achievement_points: 44, challenge_points: 3, total_points: 50, current_pfp: 'a', current_title: 'a', daily_streak: 4})
            const newUser = new User({user_id: 1, username: 'a', password: 'd', email_address: 'ab', spotting_points: 3, achievement_points: 44, challenge_points: 3, total_points: 50, current_pfp: 'b', current_title: 'a', daily_streak: 4})

            jest.spyOn(Family, 'getOneByID').mockResolvedValueOnce(family)
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: [{user_id: 1}]})
            jest.spyOn(User, 'getOneByID').mockResolvedValueOnce(newUser)

            const result = await oldUser.setPFP(family)

            expect(result.current_pfp).toEqual('b')
            expect(db.query).toHaveBeenCalledTimes(1)
            expect(db.query).toHaveBeenCalledWith("UPDATE users SET current_pfp = $1 WHERE user_id = $2 RETURNING user_id;", [family.profile_picture, oldUser.user_id])

        })
    })

    describe('setTitle', () => {
        it('Updates new title and returns the user', async () => {
            const newTitle = { title: 'w' }
            const oldUser = new User({user_id: 1, username: 'a', password: 'd', email_address: 'ab', spotting_points: 3, achievement_points: 44, challenge_points: 3, total_points: 50, current_pfp: 'b', current_title: 'a', daily_streak: 4})
            const newUser = new User({user_id: 1, username: 'a', password: 'd', email_address: 'ab', spotting_points: 3, achievement_points: 44, challenge_points: 3, total_points: 50, current_pfp: 'b', current_title: 'w', daily_streak: 4})

            jest.spyOn(Achievement, 'getOneByID').mockResolvedValueOnce(newTitle)
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: [{user_id: 1}]})
            jest.spyOn(User, 'getOneByID').mockResolvedValueOnce(newUser)

            const result = await oldUser.setTitle(newTitle)

            expect(result.current_title).toEqual('w')
            expect(db.query).toHaveBeenCalledTimes(1)
            expect(db.query).toHaveBeenCalledWith("UPDATE users SET current_title = $1 WHERE user_id = $2 RETURNING user_id;", [newTitle.title, oldUser.user_id])

        })
    })

    describe('changePassword', () => {
        it('Updates password and returns the user', async () => {
            const oldUser = new User({user_id: 1, username: 'a', password: 'd', email_address: 'ab', spotting_points: 3, achievement_points: 44, challenge_points: 3, total_points: 50, current_pfp: 'b', current_title: 'a', daily_streak: 4})
            const newUser = new User({user_id: 1, username: 'a', password: 'z', email_address: 'ab', spotting_points: 3, achievement_points: 44, challenge_points: 3, total_points: 50, current_pfp: 'b', current_title: 'a', daily_streak: 4})

            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: [{user_id: 1}]})
            jest.spyOn(User, 'getOneByID').mockResolvedValueOnce(newUser)

            const result = await oldUser.changePassword('z')

            expect(result.password).toEqual('z')
            expect(db.query).toHaveBeenCalledTimes(1)
            expect(db.query).toHaveBeenCalledWith("UPDATE users SET password = $1 WHERE user_id = $2 RETURNING user_id;", ['z', oldUser.user_id])
        })
    })
})