const { renderDOM } = require('./helpers');
const fs = require('fs');
const path = require('path');
require('jest-fetch-mock').enableMocks();


global.fetch = require('jest-fetch-mock');

global.localStorage = {
    store: {},
    getItem(key) {
        return this.store[key] || null;
    },
    setItem(key, value) {
        this.store[key] = value.toString();
    },
    removeItem(key) {
        delete this.store[key];
    },
    clear() {
        this.store = {};
    }
};


describe('Profile Page', () => {
    beforeEach(async () => {
        fetch.resetMocks();
        const storageMock = {
            store: {},
            getItem(key) { return this.store[key] || null; },
            setItem(key, value) { this.store[key] = value.toString(); },
            removeItem(key) { delete this.store[key]; },
            clear() { this.store = {}; }
        };

        global.localStorage = storageMock;
        dom = await renderDOM('./myaccount/index.html');
        
        
    });
    it('renders main elements', async () => {


        const document = dom.window.document;

        expect(document.querySelector('#signout')).not.toBeNull();
        expect(document.querySelector('.username')).not.toBeNull();
        expect(document.querySelector('.usertitle')).not.toBeNull();
        expect(document.querySelector('.edit-profile')).not.toBeNull();
        expect(document.querySelector('.sightinglist')).not.toBeNull();
        expect(document.querySelector('.myzoo')).not.toBeNull();
        expect(document.querySelector('.achlist')).not.toBeNull();
    });
    it('getUsernameFromToken decodes token correctly', () => {

        const { getUsernameFromToken } = dom.window;
        const payload = { username: 'testuser' };
        const token = `header.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`;

        const username = dom.window.getUsernameFromToken(token);
        expect(username).toBe('testuser');
    });
    it('signout button clears localStorage and redirects', async () => {

        const window = dom.window;
        const document = window.document;

        localStorage.setItem('token', '123');
        localStorage.setItem('user_id', 'abc');

        // Mock window.location.assign
        delete window.location;
        window.location = { assign: jest.fn() };

        const signoutBtn = document.querySelector('#signout')
        expect(signoutBtn).not.toBeNull()
        signoutBtn.click()

        expect(localStorage.getItem('token')).toBeNull();
        expect(window.location.assign).toHaveBeenCalledWith('./../loginpage/index.html');
    })
})