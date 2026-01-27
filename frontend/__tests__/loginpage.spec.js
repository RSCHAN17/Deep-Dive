const { renderDOM } = require('./helpers');
let dom;
let document;

describe('index.html', () => {

    beforeEach(async () => {
        dom = await renderDOM('http://127.0.0.1:5500/frontend/loginpage/index.html');
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
    it('has a form which you can enter username and password', () => {
        const username = document.querySelector('#username')
        const password = document.querySelector('#password')
        const submitBtn = document.querySelector('#submit')
        const errorMessage = document.querySelector('#error')
        expect(username).toBeTruthy()
        expect(password).toBeTruthy()
        expect(submitBtn).toBeTruthy()
        expect(submitBtn.innerHTML).toBe('Submit')
        expect(errorMessage).toBeTruthy()

        username.value = ''
        password.value = ''

        submitBtn.click()
        expect(errorMessage.innerHTML).toBe("Please enter username and password")

    })
    // it('stores a token with username, userid in local storage', async () => {
    //     const localStorageMock = {
    //         getItem: jest.fn(),
    //         setItem: jest.fn(),
    //         clear: jest.fn()
    //     };
    //     global.localStorage = localStorageMock;


    //     const mockSetItem = jest.spyOn(Storage.prototype, 'setItem')

    //     await submitBtn.click()
    //     expect(mockSetItem).toHaveBeenCalledTimes(4)





    // })
    it('has a sign-up button', () => {
        const signupBtn = document.querySelector('#signupbtn')
        expect(signupBtn).toBeTruthy()
        expect(signupBtn.innerHTML).toBe('Sign up')
    })










    // it('sends you to the right location when you click the button', () =>{
    //     const dd2 = document.querySelector('#dd2')
    //     dd2.click()
    //     console.log(dom.window.location.href)
    // })
})