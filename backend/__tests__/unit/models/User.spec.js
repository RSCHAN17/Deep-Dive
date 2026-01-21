const User = require('../../../models/User');
const db = require('../../../database/connection');

describe('User', () => {
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())

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

})