const Animal = require('../../../models/Animal')
const animalController = require('../../../controllers/animals')

const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

const mockStatus = jest.fn(() => ({
    json: mockSend
}))

const mockRes = { status: mockStatus }

describe('Animal Controller', () => {
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())

    describe('index', () => {
        it('Returns all animals with status code 200', async () => {
            const testCharacters = ['c1', 'c2']
            jest.spyOn(Animal, 'getAll').mockResolvedValue(testCharacters)

            await animalController.index(null, mockRes)

            expect(Animal.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(testCharacters)
        })

        it('Returns error upon failure', async () => {
            jest.spyOn(Animal, 'getAll').mockRejectedValue(new Error('Something happened to your db'))

            await animalController.index(null, mockRes)

            expect(Animal.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({ error: 'Something happened to your db' })

        })
    })

    describe('show', () => {
        beforeEach(() => {
            testAnimal = {animal_id: 1, name: 'a', type: 'b', capture_points: 1, pack_bonus_mult: 1.35, description: 'a', species: 'a', family_id: 1}
            mockReq = { params: {id: 1} }
        })

        it('Returns an animal with status code 200', async () => {
            jest.spyOn(Animal, 'getOneByID').mockResolvedValue(new Animal(testAnimal))

            await animalController.show(mockReq, mockRes)
            expect(Animal.getOneByID).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockSend).toHaveBeenCalledWith(new Animal(testAnimal))
            
        })

        it('Returns erorr 404 if spotting is not found', async () => {
            jest.spyOn(Animal, 'getOneByID').mockRejectedValue(new Error('error'))
            await animalController.show(mockReq, mockRes)

            expect(Animal.getOneByID).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockSend).toHaveBeenCalledWith({ error: 'error' })
        
        })
    })

    describe('create', () => {
        beforeEach(() => {
            testAnimal = {animal_id: 1, name: 'a', type: 'b', capture_points: 1, pack_bonus_mult: 1.35, description: 'a', species: 'a', family_id: 1}
            mockReq = { body: {name: 'a', type: 'b', capture_points: 1, pack_bonus_mult: 1.35, description: 'a', fun_fact: 'a', zoo_image: 'b', species: 'a', family_id: 1} }
        })

        it('Creates animal with status code 201', async () => {
            jest.spyOn(Animal, 'create').mockResolvedValue(new Animal(testAnimal))

            await animalController.create(mockReq, mockRes)
            expect(Animal.create).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(201);
            
        })

        it('Returns erorr 500 if animal already exists', async () => {
            jest.spyOn(Animal, 'create').mockRejectedValue(new Error('error'))
            await animalController.create(mockReq, mockRes)

            expect(Animal.create).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({ error: 'error' })
        
        })
    })

})