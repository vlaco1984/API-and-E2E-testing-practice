import { movieDB_base } from "../po/po";
// const { setPage } = require("../helpers/helper")
const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures')
const { menuItems } = require('../test-data/data.json')



let page
let currentPage

test('All menu items should be visible', async({pageAuth}) => {
    await test.step('Click on TV series', async () => {
    await pageAuth.checkMenuItems();
   });
})


