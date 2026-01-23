const Spotting = require('../../../models/Spotting')
const db = require('../../../database/connection')

describe('Spotting Model', () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe('getAll', () => {
        it('Returns all Spottings', async () =>{
            const testSpottings = [
                {spot_id: 1, date_time: 1, username: 'b', animal_name: 'c', animal_count: 1, location: 'a', spot_points: 3, image_url: 'c'},
                {spot_id: 2, date_time: 2, username: 'b', animal_name: 'e', animal_count: 1, location: 'a', spot_points: 3, image_url: 'a'},
                {spot_id: 3, date_time: 3, username: 'a', animal_name: 'c', animal_count: 2, location: 'a', spot_points: 4, image_url: 'a'}
            ]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: testSpottings })

            const results = await Spotting.getAll()

            expect(results).toHaveLength(3)
            expect(results[0]).toHaveProperty('date_time')
            expect(results[0].animal_count).toEqual(1)
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM spottings;")
        })
    })

    describe('getOneByID', () => {
        it('Returns spotting on successful db query', async () => {
            const testSpotting = {spot_id: 1, date_time: 1, username: 'b', animal_name: 'c', animal_count: 1, location: 'a', spot_points: 3, image_url: 'c'}

            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: [testSpotting]})

            const result = await Spotting.getOneByID(1)
            expect(result).toBeInstanceOf(Spotting)
            expect(result.animal_name).toEqual('c')
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
            const mockSpots = [
                {spot_id: 1, date_time: 1, username: 'b', animal_name: 'c', animal_count: 1, location: 'a', spot_points: 3, image_url: 'c'},
                {spot_id: 2, date_time: 1, username: 'a', animal_name: 'c', animal_count: 1, location: 'a', spot_points: 3, image_url: 'c'},
                {spot_id: 3, date_time: 1, username: 'a', animal_name: 'c', animal_count: 1, location: 'a', spot_points: 3, image_url: 'c'}
            ]

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockSpots[1], mockSpots[2]] })
            const result = await Spotting.filterByUser('a')

            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('animal_count')
            expect(result[1].animal_name).toBe('c')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM spottings WHERE username = $1;", ['a'])
        })

        it('Throws error when no spottings from that user', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            await expect(Spotting.filterByUser('z')).rejects.toThrow("No animal spottings from this user!")
        })
    })

    describe('filterByType', () => {
        it('Returns spottings of animals of the same type', async () => {
            const mockSpots = [
                {spot_id: 1, date_time: 1, username: 'b', animal_name: 'c', animal_count: 1, location: 'a', spot_points: 3, image_url: 'c'},
                {spot_id: 2, date_time: 1, username: 'a', animal_id: 'z', animal_count: 1, location: 'a', spot_points: 3, image_url: 'c'},
                {spot_id: 3, date_time: 1, username: 'a', animal_id: 'a', animal_count: 1, location: 'a', spot_points: 3, image_url: 'c'}
            ]

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockSpots[0], mockSpots[2]] })
            const result = await Spotting.filterByType('rabbit')

            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('location')
            expect(result[0].animal_name).toBe('c')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM spottings WHERE animal_name IN (SELECT name FROM animals WHERE type = $1);", ['rabbit'])
        })

        it('Throws error when no spottings of that type', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            await expect(Spotting.filterByType('Sponge')).rejects.toThrow("No animal spottings of this type!")
        })
    })

    describe('create', () => {
        beforeEach(() =>{
            jest.clearAllMocks()
        })

        it('Creates spot if animal is found and calculates score', async () => {
            const data = {
                date_time: '2026-01-21 15:03:21',
                username: 'a',
                animal_name: 'a', 
                animal_count: 2, 
                location: (2,54), 
                image_url: 'a'
            }

            jest.spyOn(db, 'query')
            .mockResolvedValueOnce({rows: [{capture_points: 1}]})
            .mockResolvedValueOnce({rows: [{pack_bonus_mult: 2}]})
            .mockResolvedValueOnce({rows: [{spot_id: 1}]})

            const mockSpot = {
                spot_id: 1,
                date_time: '2026-01-21 15:03:21',
                username: 'a',
                animal_name: 'a', 
                animal_count: 2, 
                location: (2,54), 
                spot_points: 2,
                image_url: 'a'
            }
            jest.spyOn(Spotting, 'getOneByID').mockResolvedValueOnce(mockSpot)
            const result = await Spotting.create(data)

            expect(db.query).toHaveBeenCalledTimes(3)
            expect(result).toEqual(mockSpot)
            expect(db.query).toHaveBeenNthCalledWith(1, "SELECT capture_points FROM animals WHERE name = $1;", ['a'])
            expect(db.query).toHaveBeenNthCalledWith(2, "SELECT pack_bonus_mult FROM animals WHERE name = $1;", ['a'])
            expect(db.query).toHaveBeenNthCalledWith(3, "INSERT INTO spottings (date_time, username, animal_name, animal_count, location, spot_points, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING spot_id;", ['2026-01-21 15:03:21', 'a', 'a', 2, (2,54), 2, 'a'])
            expect(Spotting.getOneByID).toHaveBeenCalledTimes(1)
        })

        it('Throws error if animal cannot be identified', async () => {
            const data = {
                date_time: '2026-01-21 15:03:21',
                user_id: 1,
                animal_id: 1, 
                animal_count: 2, 
                location: (2,54), 
                image_url: 'a'
            }

            jest.spyOn(db, 'query')
            .mockResolvedValueOnce({rows: []})
            .mockResolvedValueOnce({rows: []})

            await expect(Spotting.create(data)).rejects.toThrow("Unable to locate animal.")
        })
    })
})