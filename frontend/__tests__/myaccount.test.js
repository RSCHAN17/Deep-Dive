const { renderDOM } = require('./helpers');
let dom;
let document;

describe('index.html', () => {


    beforeEach(async () => {
        dom = await renderDOM('http://127.0.0.1:5500/frontend/myaccount/index.html');
        document = await dom.window.document;
        



    })

    it('renders main elements', async () => {
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
    it('signout button redirects', async () => {

        const signoutBtn = document.getElementById('signout')

        expect(signoutBtn).not.toBeNull()
        console.log(signoutBtn);
        signoutBtn.click()

        expect(dom.window.location.href).toContain('/loginpage/index.html');
    })
}
)
