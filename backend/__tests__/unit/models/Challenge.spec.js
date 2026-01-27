const Challenge = require('../../../models/Challenge')
const db = require('../../../database/connection')

describe('Challenge Model', () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe('getAll', () => {
        it('Returns all challenges', async () => {
            mockChallenges = [
                {id: 1, challenge_name: 'a', challenge_description: 'b', points: 1},
                {id: 2, challenge_name: 'a', challenge_description: 'b', points: 1},
                {id: 3, challenge_name: 'a', challenge_description: 'b', points: 1},
                {id: 4, challenge_name: 'a', challenge_description: 'b', points: 1}
            ]

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockChallenges })

            const response = await Challenge.getAll()

            expect(response).toHaveLength(4);
            expect(response[0]).toHaveProperty('challenge_description')
            expect(response[0].challenge_name).toBe('a')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM challenges;")
        })
    })
}) 