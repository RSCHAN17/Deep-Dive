const Family = require('../../../models/Family')
const db = require('../../../database/connection')

describe('Family Model', () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe('getAll', () => {
        it('Returns all families', async () => {
            const mockFamilies = [
                {family_id: 1, family_name: 'd', common_name: 'd', profile_picture: 'd'},
                {family_id: 2, family_name: 'c', common_name: 'c', profile_picture: 'c'},
                {family_id: 3, family_name: 'b', common_name: 'b', profile_picture: 'b'},
                {family_id: 4, family_name: 'a', common_name: 'a', profile_picture: 'a'}
            ]

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockFamilies})

            const results = await Family.getAll()

            expect(results).toHaveLength(4)
            expect(results[0]).toHaveProperty('family_name')
            expect(results[0].common_name).toBe('d')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM families;")
        })
    })

    describe('getOneByID', () => {
        it('Returns family on successful db query', async () => {
            const mockFamily = {family_id: 1, family_name: 'd', common_name: 'd', profile_picture: 'd'}

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockFamily] })
            const result = await Family.getOneByID(1)

            expect(result).toBeInstanceOf(Family)
            expect(result.family_id).toBe(1)
            expect(result.profile_picture).toBe('d')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM family WHERE family_id = $1;", [1])
        })

        it('Throws error when family not found', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })

            await expect(Family.getOneByID(9999)).rejects.toThrow("Unable to locate family.")
        })
    })
})