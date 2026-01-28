const { renderDOM } = require('./helpers');
let dom;
let document;

describe('index.html', () => {

    beforeEach(async () => {
        dom = await renderDOM('http://127.0.0.1:5500/frontend/spottedmap/index.html');
        document = await dom.window.document;


    })
    it('has 4 navigations buttons', () => {
        const dd1 = document.querySelector('#dd1')
        expect(dd1).toBeTruthy()
        const dd2 = document.querySelector('#dd2')
        expect(dd2).toBeTruthy()
        const dd3 = document.querySelector('#dd3')
        expect(dd3).toBeTruthy()
        const dd4 = document.querySelector('#dd4')
        expect(dd4).toBeTruthy()
    })
})