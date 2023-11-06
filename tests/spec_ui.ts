import { movieDB_base } from "../po/po";
// const { setPage } = require("../helpers/helper")
const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures')
const { menuItems } = require('../test-data/data.json')



let page
let currentPage







test('The language switcher should work properly', async ({pageAuth}) => {
    
    await test.step('The language should should be English', async () => {
    let actualLang = await pageAuth.getLang()
    await expect(await pageAuth.langSel('en')).toBeVisible()
    console.log('angol'+await pageAuth.langSel().textContent())
    })

    await test.step('Menu items should be in English', async () => {
    await pageAuth.checkMenuItems()
    })

    await test.step('Click on lang switcher and select Hungarian as default lang', async () => {
    await pageAuth.setLang("Hungarian (hu-HU)")
    })

    await test.step('Reload page', async () => {
    await pageAuth.pageRefresh.click()
    })

    await test.step('The language should be Hungarian', async () => {
    let actualLang = await pageAuth.getLang();
    await expect(await pageAuth.langSel()).toHaveText('hu')
    console.log('magyar'+await pageAuth.langSel().textContent())
    })

    await test.step('The menu items should be in Hungarian', async () => {
    await pageAuth.checkMenuItems()
    })

})

test('Search', async ({pageUnauth}) => {
    
    await test.step('Clicking on the search icon', async () => {
    await pageUnauth.glass.click()
    })
})


