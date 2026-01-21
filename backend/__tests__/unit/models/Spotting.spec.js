const Spotting = require('../../../models/Spotting')
const db = require('../../../database/connection')

describe('Spotting', () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe('getAll', () => {
        it('Returns all Spottings', async () =>{
            const testSpottings = [
                {spot_id: 1, date_time: 1, user_id: 2, animal_id: 3, animal_count: 1, location: 'a', spot_points: 3, image_url: 'c'},
                {spot_id: 2, date_time: 2, user_id: 2, animal_id: 5, animal_count: 1, location: 'a', spot_points: 3, image_url: 'a'},
                {spot_id: 3, date_time: 3, user_id: 1, animal_id: 3, animal_count: 2, location: 'a', spot_points: 4, image_url: 'a'}
            ]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: testSpottings })

            const results = await Spotting.getAll()

            expect(results).toHaveLength(3)
            expect(results[0]).toHaveProperty('date_time')
            expect(results[0].user_id).toBe(2)
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM spottings;")
        })
    })

    describe('getOneByID', () => {
        it('Returns spotting on successful db query', async () => {
            const testSpotting = {spot_id: 1, date_time: 1, user_id: 2, animal_id: 3, animal_count: 1, location: 'a', spot_points: 3, image_url: 'c'}

            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: [testSpotting]})

            const result = await Spotting.getOneByID(1)
            expect(result).toBeInstanceOf(Spotting)
            expect(result.animal_id).toBe(3)
            expect(result.image_url).toBe('c')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM spottings WHERE spot_id = $1;", [1])
        })

        it('Throws error when achievement not found', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            await expect(Spotting.getOneByID(999)).rejects.toThrow("Unable to locate animal spotting.")
        })
    })

    describe('filterByUser', () => {
        it('Returns spottings from specific user on successful db query', async () => {
            
        })
    })
})