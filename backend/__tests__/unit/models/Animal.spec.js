const Animal = require('../../../models/Animal')
const db = require('../../../database/connection')


describe('Animal Model', () => {
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())

    describe('getAll', () => {
        it('Returns all animals', async () => {
            const mockAnimals = [
                {animal_id: 1, name: 'a', type: 'a', capture_points: 10, pack_bonus_mult: 1.1, description: 'a', fun_fact: 'x', zoo_image: 'a', species: 'a', family_id:1},
                {animal_id: 2, name: 'b', type: 'a', capture_points: 5, pack_bonus_mult: 1.35, description: 'b', fun_fact: 'y', zoo_image: 'b', species: 'b', family_id:2},
                {animal_id: 3, name: 'c', type: 'b', capture_points: 12, pack_bonus_mult: 1.1, description: 'c', fun_fact: 'z', zoo_image: 'c', species: 'c', family_id:2}
            ]

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockAnimals })

            const results = await Animal.getAll()

            expect(results).toHaveLength(3)
            expect(results[0]).toHaveProperty('name')
            expect(results[0].capture_points).toBe(10)
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM animals;")
        })
    })

    describe('getOneByID', () => {
        it('Returns animal on successful db query', async () => {
            const mockAnimal = {animal_id: 1, name: 'a', type: 'a', capture_points: 10, pack_bonus_mult: 1.1, description: 'a', fun_fact: 'x', zoo_image: 'a', species: 'a', family_id:1}

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockAnimal] })
            const result = await Animal.getOneByID(1)
        })
    })
})