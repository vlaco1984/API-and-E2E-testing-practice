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

test('The language should change automatically after authentication', async ({pageAuth}) => {
    await test.step('The language should should change to HU', async () => {
    let actualLang = await pageAuth.setLang()
    expect(actualLang).toBe('hu')
    })
})