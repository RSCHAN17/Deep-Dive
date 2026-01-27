const Challenge = require('../../../models/Challenge')
const challengeController = require('../../../controllers/challenges')

const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

const mockStatus = jest.fn(() => ({
    json: mockSend
}))

const mockRes = { status: mockStatus }

describe('Challenge Controller', () => {
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())

    describe('index', () => {
        it('Returns all challenges with status code 200', async () => {
            const testCharacters = ['c1', 'c2']
            jest.spyOn(Challenge, 'getAll').mockResolvedValue(testCharacters)

            await challengeController.index(null, mockRes)

            expect(Challenge.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(testCharacters)
        })

        it('Returns error upon failure', async () => {
            jest.spyOn(Challenge, 'getAll').mockRejectedValue(new Error('Something happened to your db'))

            await challengeController.index(null, mockRes)

            expect(Challenge.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({ error: 'Something happened to your db' })

        })
    })
})