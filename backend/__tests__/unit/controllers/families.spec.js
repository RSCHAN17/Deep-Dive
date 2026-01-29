const Family = require('../../../models/Family')
const familyController = require('../../../controllers/families')
const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

const mockStatus = jest.fn(() => ({
    json: mockSend
}))

const mockRes = { status: mockStatus }

describe('Family Controller', () => {
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())

    describe('uploadPhoto', () => {
        it('Returns id and successfully uploads a photo', async () => {
            const testFam = {family_id: 1, profile_picture: 'a'}
            const mockReq = { params: {id: 1}, body: {photo: 'b'} }

            jest.spyOn(Family, 'addPic').mockResolvedValue(testFam.family_id);

            await familyController.uploadPhoto(mockReq, mockRes)

            expect(Family.addPic).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockSend).toHaveBeenCalledWith(1)
        })
    })
})