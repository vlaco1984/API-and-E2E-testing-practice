import { movieDB_base } from "../po/po";
// const { setPage } = require("../helpers/helper")
const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures')
const { menuItems } = require('../test-data/data.json')



let page
let currentPage

test('Test of the test', async({pageUnauth}) => {
    await test.step('Click on TV series', async () => {
    let locator = await pageUnauth.menuItems
    menuItems.forEach(menuItem => {
        pageUnauth.itemText = menuItem;
        console.log(pageUnauth.itemText)
        console.log(pageUnauth.menuItems)
        console.log(pageUnauth.dropdownTV)
        expect(pageUnauth.menuItems).toBeVisible()
    });
   });
})
