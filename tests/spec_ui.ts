import { movieDB_base } from "../po/po";
// const { setPage } = require("../helpers/helper")
const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures')



let page
let currentPage

test('Click on TV series', async({basePage}) => {
    //page = new movieDB_base(await setPage(), "https://www.themoviedb.org/");
    await basePage.openPage();
   });

