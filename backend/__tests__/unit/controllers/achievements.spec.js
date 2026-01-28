const Achievement = require('../../../models/Achievement')
const achievementController = require('../../../controllers/achievements')
const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

const mockStatus = jest.fn(() => ({
    json: mockSend
}))

const mockRes = { status: mockStatus }

describe('Achievement Controller', () => {
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())

    describe('index', () => {
        it('Returns all achievements with status code 200', async () => {
            const testCharacters = ['a', 'b']
            jest.spyOn(Achievement, 'getAll').mockResolvedValue(testCharacters)

            await achievementController.index(null, mockRes);

            expect(Achievement.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(testCharacters)
        })

        it('Returns error upon failure', async () => {
            jest.spyOn(Achievement, 'getAll').mockRejectedValue(new Error('Something happened to your db'))

            await achievementController.index(null, mockRes)

            expect(Achievement.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({ error: 'Something happened to your db' })

        })
    })

    describe('show', () => {
        beforeEach(() => {
            testAnimal = {achievement_id: 1, achievement_name: 'a', achievement_description: 'a', value: 1, title: 'a'}
            mockReq = { params: {id: 1} }
        })

        it('Returns an achievement with status code 200', async () => {
            jest.spyOn(Achievement, 'getOneByID').mockResolvedValue(new Achievement(testAnimal))

            await achievementController.show(mockReq, mockRes)
            expect(Achievement.getOneByID).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockSend).toHaveBeenCalledWith(new Achievement(testAnimal))
            
        })

        it('Returns error 404 if achievement is not found', async () => {
            jest.spyOn(Achievement, 'getOneByID').mockRejectedValue(new Error('error'))
            await achievementController.show(mockReq, mockRes)

            expect(Achievement.getOneByID).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockSend).toHaveBeenCalledWith({ error: 'error' })
        
        })
    })

    describe('checkGet', () => {
        beforeEach(() => {
            mockReq = { params: {id: 1} }
        })

        it('Returns the user id with status code 200', async () => {
            jest.spyOn(Achievement, 'checkGet').mockResolvedValue(1)

            await achievementController.checkGet(mockReq, mockRes)
            expect(Achievement.checkGet).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockSend).toHaveBeenCalledWith(1)
            
        })

        it('Returns error 500 upon failure', async () => {
            jest.spyOn(Achievement, 'checkGet').mockRejectedValue(new Error('error'))
            await achievementController.checkGet(mockReq, mockRes)

            expect(Achievement.checkGet).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({ error: 'error' })
        
        })
    })
})