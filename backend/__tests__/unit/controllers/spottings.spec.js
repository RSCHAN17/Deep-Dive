const spottingController = require('../../../controllers/spottings')
const Spotting = require('../../../models/Spotting')

const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

const mockStatus = jest.fn(() => ({
    json: mockSend
}));

const mockRes = { status: mockStatus }

describe('Spotting controller', () => {
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())

    describe('index', () => {
        it('Returns all spottings with status code 200', async () => {
            const testCharacters = ['c1', 'c2']
            jest.spyOn(Spotting, 'getAll').mockResolvedValue(testCharacters)

            await spottingController.index(null, mockRes)

            expect(Spotting.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(testCharacters)
        })

        it('Returns error upon failure', async () => {
            jest.spyOn(Spotting, 'getAll').mockRejectedValue(new Error('Something happened to your db'))

            await spottingController.index(null, mockRes)

            expect(Spotting.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({ error: 'Something happened to your db' })



        })
    })

    describe('show', () => {
        beforeEach(() => {
            testSpot = {id:1, date_time: '2026-01-27 15:00:00', username: 'dev', animal_name: 'fox', animal_count: 2, location: '20,3', spot_points: 11, image_url: 'a'}
            mockReq = { params: {id: 1} }
        })

        it('Returns a spotting with status code 200', async () => {
            jest.spyOn(Spotting, 'getOneByID').mockResolvedValue(new Spotting(testSpot))

            await spottingController.show(mockReq, mockRes)
            expect(Spotting.getOneByID).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockSend).toHaveBeenCalledWith(new Spotting(testSpot))
            
        })

        it('Returns erorr 404 if spotting is not found', async () => {
            jest.spyOn(Spotting, 'getOneByID').mockRejectedValue(new Error('error'))
            await spottingController.show(mockReq, mockRes)

            expect(Spotting.getOneByID).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockSend).toHaveBeenCalledWith({ error: 'error' })
        
        })
    })

    describe('filterByUser', () => {
        it('Returns all spottings of a certain user with status code 200', async () => {
            const testCharacters = ['c1', 'c2']
            const mockReq = { params: {id:1} }
            jest.spyOn(Spotting, 'filterByUser').mockResolvedValue(testCharacters)

            await spottingController.filterByUser(mockReq, mockRes)

            expect(Spotting.filterByUser).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(testCharacters)
        
        })
        it('Returns error upon failure', async () => {
            jest.spyOn(Spotting, 'filterByUser').mockRejectedValue(new Error('Something happened to your db'))

            await spottingController.filterByUser({params: {id: 4445} }, mockRes)

            expect(Spotting.filterByUser).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockSend).toHaveBeenCalledWith({ error: 'Something happened to your db' })



        })
    })

    describe('filterByType', () => {
        it('Returns all spottings of a certain type with status code 200', async () => {
            const testCharacters = ['c1', 'c2']
            const mockReq = { params: {type: 'a'} }
            jest.spyOn(Spotting, 'filterByType').mockResolvedValue(testCharacters)

            await spottingController.filterByType(mockReq, mockRes)

            expect(Spotting.filterByType).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(testCharacters)
        
        })
        it('Returns error upon failure', async () => {
            jest.spyOn(Spotting, 'filterByType').mockRejectedValue(new Error('Something happened to your db'))

            await spottingController.filterByType({params: {type: 'z'} }, mockRes)

            expect(Spotting.filterByType).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockSend).toHaveBeenCalledWith({ error: 'Something happened to your db' })



        })
    })
})