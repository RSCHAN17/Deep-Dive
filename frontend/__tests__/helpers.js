const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const renderDOM = async (url) => {
  const response = await fetch(url);
  const html = await response.text();


  const dom = new JSDOM(html, {
    url,
    runScripts: 'dangerously',
    resources: 'usable'

  });

  return new Promise((resolve, _) => {
    dom.window.document.addEventListener('DOMContentLoaded', () => {
      resolve(dom);
    });
  });
};

module.exports = { renderDOM };