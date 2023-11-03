import { movieDB_base } from "../po/po";
// const { setPage } = require("../helpers/helper")
const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures')
const { menuItems } = require('../test-data/data.json')



let page
let currentPage


test('All menu items are correct', async({pageUnauth}) => {
    await test.step('Menuitems should be visible', async () => {
    await pageUnauth.checkMenuItems();
   });
})

test('The language switcher should work properly', async ({pageAuth}) => {
    
    await test.step('The language should should be English', async () => {
    let actualLang = await pageAuth.getLang()
    expect(actualLang).toBe('en')
    })

    await test.step('Menu items should be in English', async () => {
    await pageAuth.checkMenuItems()
    })

    await test.step('Click on lang switcher and select English as default lang', async () => {
    await pageAuth.langSel().click()      // methodba kimozgatni
    await pageAuth.defaultLang.click()
    await pageAuth.defaultLangInput.fill('Hungarian')
    await pageAuth.pressButton('Enter')
    })

    await test.step('Reload page', async () => {
    await pageAuth.pageRefresh.click()
    })

    await test.step('The language should be Hungarian', async () => {
    let actualLang = await pageAuth.setLang();
    expect(actualLang).toBe('hu')
    })

    await test.step('The menu items should be in Hungarian', async () => {
    await pageAuth.checkMenuItems()
    })




})