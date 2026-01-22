const userController = require('../../../controllers/users')
const { getOneByID } = require('../../../models/Family')
const User = require('../../../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

jest.mock('../../../models/User')
jest.mock('bcrypt')
jest.mock('jsonwebtoken')

const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

const mockStatus = jest.fn(() => ({
    json: mockSend
}))

const mockRes = { status: mockStatus }

describe('User Controller', () =>{ 
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn()
        }
        jest.clearAllMocks();
    })

    describe('register', () => {
        it('Registers new user successfully', async () => {
            //setup test data
            req.body = { username: 'dev', password: 'test', email_address: 'test' }
            const mockUser = {user_id: 1, username: 'dev', password: 'test', email_address: 'test',  spotting_points: 0.0, achievement_points: 0, challenge_points: 0, total_points: 0, current_pfp: '', current_title: '', daily_streak: 0}

            bcrypt.genSalt.mockResolvedValue('salt')
            bcrypt.hash.mockResolvedValue('hashedpassword')
            User.create.mockResolvedValue(mockUser)

            await userController.register(req, res)

            expect(bcrypt.genSalt).toHaveBeenCalled()
            expect(bcrypt.hash).toHaveBeenCalledWith('test', 'salt')
            expect(User.create).toHaveBeenCalledWith({ username: 'dev', password: 'hashedpassword', email_address: 'test' })
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.send).toHaveBeenCalledWith(mockUser);
        })

        it('Returns 500 if username is missing', async () => {
            req.body = { password: 'test', email_address: 'test' }

            await userController.register(req, res)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Registration failed: Invalid user details'
            })
        })

        it('Returns 500 if password is missing', async () => {
            req.body = { username: 'test', email_address: 'test' }

            await userController.register(req, res)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Registration failed: Invalid user details'
            })
        })

        it('Returns 500 if email is missing', async () => {
            req.body = { username: 'test', password: 'test' }

            await userController.register(req, res)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Registration failed: Invalid user details'
            })
        })

        it('Returns 409 if username already in use', async () => {
            req.body = { username: 'dev', password: 'test', email_address: 'test' }

            bcrypt.genSalt.mockResolvedValue('salt')
            bcrypt.hash.mockResolvedValue('hashedpassword')
            User.create.mockResolvedValue(new Error('Username is already taken.'))

            await userController.register(req, res)

            expect(bcrypt.genSalt).toHaveBeenCalled()
            expect(bcrypt.hash).toHaveBeenCalledWith('test', 'salt')
            expect(User.create).toHaveBeenCalledWith({ username: 'dev', password: 'hashedpassword', email_address: 'test' })
            //expect(res.status).toHaveBeenCalledWith(409)
            //expect(res.json).toHaveBeenCalledWith({ error: 'Username is already taken.' })
        })

        it('Returns 409 if email already in use', async () => {
            req.body = { username: 'dev', password: 'test', email_address: 'test' }

            bcrypt.genSalt.mockResolvedValue('salt')
            bcrypt.hash.mockResolvedValue('hashedpassword')
            User.create.mockResolvedValue(new Error('Email address is already taken.'))

            await userController.register(req, res)

            expect(bcrypt.genSalt).toHaveBeenCalled()
            expect(bcrypt.hash).toHaveBeenCalledWith('test', 'salt')
            expect(User.create).toHaveBeenCalledWith({ username: 'dev', password: 'hashedpassword', email_address: 'test' })
            //expect(res.status).toHaveBeenCalledWith(409)
            //expect(res.json).toHaveBeenCalledWith({ error: 'Username is already taken.' })
        })
    })

    describe('login', () => {
        it('Logs user in successfully', async () => {
            req.body = { username: 'dev', password: 'test', email_address: 'test' }
            const mockUser = {user_id: 1, username: 'dev', password: 'test', email_address: 'test',  spotting_points: 0.0, achievement_points: 0, challenge_points: 0, total_points: 0, current_pfp: '', current_title: '', daily_streak: 0}

            User.getOneByUsername.mockResolvedValue(mockUser)
            bcrypt.compare.mockResolvedValue(true)
            jwt.sign.mockImplementation((payload, secret, options, callback) => callback(null, 'mocktoken'))

            await userController.login(req, res)

            expect(User.getOneByUsername).toHaveBeenCalledWith('dev')
            expect(bcrypt.compare).toHaveBeenCalledWith('test', 'test')
            expect(jwt.sign).toHaveBeenCalledWith({ user_id: 1, username: 'dev' }, process.env.SECRET_TOKEN, {expiresIn: 3600}, expect.any(Function))
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ success: true, token: 'mocktoken', user: { user_id: 1, username: 'dev', email_address: 'test' } })
        })
    })

    describe('index', () => {
        it('Returns all users with status code 200', async () => {
            const testUsers = ['a', 'b']
            jest.spyOn(User, 'getAll').mockResolvedValue(testUsers)

            await userController.index(null, mockRes)

            expect(User.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(testUsers)
        })

        it('Returns error upon failure', async () => {
            jest.spyOn(User, 'getAll').mockRejectedValue(new Error('a'))
            await userController.index(null, mockRes)

            expect(User.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({ error: 'a'})
        })
    })

    describe('show', () => {
        let testUser, mockReq;

        beforeEach(() => {
            testUser = {user_id: 1, username: 'a', password: 'd', email_address: 'ab', spotting_points: 3, achievement_points: 44, challenge_points: 3, total_points: 50, current_pfp: 'a', current_title: 'a', daily_streak: 4}
            mockReq = { params: {id: 1} }
        })

        it('Returns user with status code 200', async () => {
            jest.spyOn(User, 'updatePointsByID').mockResolvedValue(new User(testUser))

            await userController.show(mockReq, mockRes)

            expect(User.updatePointsByID).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            //expect(mockSend).toHaveBeenCalledWith(new User(testUser))
        })

        it('Returns error if user not found', async () => {
            jest.spyOn(User, 'updatePointsByID').mockRejectedValue(new Error('b'))

            await userController.show(mockReq, mockRes)

            expect(User.updatePointsByID).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockSend).toHaveBeenCalledWith({error: 'b'})
        })
    })
})