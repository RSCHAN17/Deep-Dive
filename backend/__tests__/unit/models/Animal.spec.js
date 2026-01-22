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

            expect(result).toBeInstanceOf(Animal)
            expect(result.name).toBe('a')
            expect(result.family_id).toBe(1)
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM animals WHERE animal_id = $1;", [1])
        })

        it('Throws error when animal not found', async () =>{
             jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            await expect(Animal.getOneByID(9999)).rejects.toThrow("Unable to locate animal.");
        
        })
    })

    describe('getOneByName', () => {
        it('Returns animal on successful db query', async () => {
            const mockAnimal = {animal_id: 1, name: 'a', type: 'a', capture_points: 10, pack_bonus_mult: 1.1, description: 'a', fun_fact: 'x', zoo_image: 'a', species: 'a', family_id:1}

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockAnimal] })
            const result = await Animal.getOneByName('a')

            expect(result).toBeInstanceOf(Animal)
            expect(result.name).toBe('a')
            expect(result.family_id).toBe(1)
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM animals WHERE name = $1;", ['a'])
        })

        it('Throws error when animal not found', async () =>{
             jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            await expect(Animal.getOneByName('b')).rejects.toThrow("Unable to locate animal.");
        
        })
    })

    describe('create', () => {
        beforeEach(() =>{
            jest.clearAllMocks()
        })

        it('Creates new animal when name not in use', async () => {
            const data = {name: 'a', type: 'a', capture_points: 1, pack_bonus_mult: 2, description: 'a', fun_fact: 'a', zoo_image: 'a', species: 'a', family_id: 1 }

            jest.spyOn(db, 'query')
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({ rows: [{ animal_id: 1 }] })

            const mockAnimal = {animal_id: 1, name: 'a', type: 'a', capture_points: 1, pack_bonus_mult: 2, description: 'a', fun_fact: 'a', zoo_image: 'a', species: 'a', family_id: 1 }

            jest.spyOn(Animal, 'getOneByID').mockResolvedValueOnce(mockAnimal)
            const result = await Animal.create(data);

            expect(db.query).toHaveBeenCalledTimes(2)
            expect(result).toEqual(mockAnimal)
            expect(db.query).toHaveBeenNthCalledWith(1, "SELECT * FROM animals WHERE name = $1", ['a'])
            expect(db.query).toHaveBeenNthCalledWith(2, "INSERT INTO animals (name, type, capture_points, pack_bonus_mult, description, fun_fact, zoo_image, species, family_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING animal_id;", ['a', 'a', 1, 2, 'a', 'a', 'a', 'a', 1])
            expect(Animal.getOneByID).toHaveBeenCalledTimes(1)
        })

        it('Throws error if name already taken', async () => {
            const data = {name: 'a', type: 'a', capture_points: 1, pack_bonus_mult: 2, description: 'a', fun_fact: 'a', zoo_image: 'a', species: 'a', family_id: 1 }
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [1] })

            await expect(Animal.create(data)).rejects.toThrow('Animal already exists.')
        })
    })
})