const { chromium, defineConfig } = require('@playwright/test');
const { movieDB_base } = require('../po/po.ts')


let browser;


async function setPage () {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    let page = await context.newPage();
    return page;
  };

async function closePage () {
    await browser.close();
};

/*async function selectPage (actualPage) {
  let page;
  switch (actualPage) {
  case "base": page = new movieDB_base(await setPage()); break
  default: page = new basePage(await setPage());
  }
  return page;
}

*/

module.exports = { setPage, closePage }