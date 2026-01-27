const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const renderDOM = async (filename) => {
  const filePath = path.join(process.cwd(), filename);
  
  // This allows us to see console.logs and ERRORS from script.js in our terminal
  const virtualConsole = new jsdom.VirtualConsole();
  virtualConsole.sendTo(console);

  const dom = await JSDOM.fromFile(filePath, {
    runScripts: 'dangerously',
    resources: 'usable',
    virtualConsole
  });

  return new Promise((resolve) => {
    dom.window.document.addEventListener('load', () => {
      resolve(dom);
    });
  });
};

module.exports = { renderDOM };