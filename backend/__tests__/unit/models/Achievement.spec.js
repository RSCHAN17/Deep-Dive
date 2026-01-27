const Achievement = require('../../../models/Achievement');
const db = require('../../../database/connection');

describe('Achievement Model', () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe('getAll', () => {
        it('Returns all achievements', async () => {
            const mockAchievements = [
                {achievement_id: 1, achievement_name: 'a', achievement_description: 'a', value: 1, title: 'c'},
                {achievement_id: 2, achievement_name: 'b', achievement_description: 'b', value: 2, title: 'b'},
                {achievement_id: 3, achievement_name: 'c', achievement_description: 'c', value: 3, title: 'a'}
            ]

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockAchievements});

            const achievements = await Achievement.getAll()

            expect(achievements).toHaveLength(3);
            expect(achievements[0]).toHaveProperty('achievement_id')
            expect(achievements[0].achievement_name).toBe('a')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM achievements;")
        })
    })

    describe('getOneByID', () => {
        it('Returns achievement on successful db query', async () => {
            const mockAchievement = {achievement_id: 1, achievement_name: 'a', achievement_description: 'a', value: 1, title: 'c'}

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockAchievement] })

            const result = await Achievement.getOneByID(1);

            expect(result).toBeInstanceOf(Achievement);
            expect(result.achievement_name).toBe('a');
            expect(result.value).toBe(1);
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM achievements WHERE achievement_id = $1;", [1])
        })

        it('Throws error when achievement not found', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            await expect(Achievement.getOneByID(999)).rejects.toThrow("Unable to locate achievement")
        })
    })

    describe('checkGet', () => {
        it('Awards achievements when not already given, doesn\'t if they have been', async () => {
            const achievements = [
                {achievement_id: 1, achievement_name: 'Deer', achievement_description: 'Upload 2 spottings within the deer family.', value: 1, title: 'c'},
                {achievement_id: 2, achievement_name: 'Spotter', achievement_description: 'Upload 5 spottings', value: 2, title: 'b'},
                {achievement_id: 3, achievement_name: 'Portfolio', achievement_description: 'Discover 10 unique animals.', value: 3, title: 'a'},
                {achievement_id: 4, achievement_name: 'Spotter', achievement_description: 'Upload your first spotting.', value: 3, title: 'a'},
                {achievement_id: 4, achievement_name: 'Portfolio', achievement_description: 'Discover 2 unique animals.', value: 3, title: 'a'}
            ]

            jest.spyOn(Achievement, 'getAll').mockResolvedValueOnce(achievements)
            jest.spyOn(db, 'query')
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({ rows: [{ family_id: 1 }]})
            .mockResolvedValueOnce({ rows: [1,2,3,4,5] })
            .mockResolvedValueOnce({ rows: [{ user_id: 1 }] })
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({ rows: [1,2,3,5,6,7,8,9,4] })
            .mockResolvedValueOnce({ rows: [{ user_id: 1 }] })
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({ rows: [1,2,3,4,5,6,7] })
            .mockResolvedValueOnce({ rows: [{ user_id: 1 }] })
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({ rows: [1,2,3,4,5,6,7] })
            .mockResolvedValueOnce({ rows: [{ user_id: 1 }] })
            .mockResolvedValueOnce({ rows: [1,2,3,4,5] })
            

            const result = await Achievement.checkGet(1);

            expect(db.query).toHaveBeenCalledTimes(13);
        })
    })
})