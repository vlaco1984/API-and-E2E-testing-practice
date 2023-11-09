const { chromium, defineConfig } = require('@playwright/test');
const { movieDB_base } = require('../po/po.ts')


let browser;


export async function setPage () {
    browser = await chromium.launch();
    const context = await browser.newContext();
    let page = await context.newPage();
    return page;
  };

export async function closePage () {
    await browser.close();
};

