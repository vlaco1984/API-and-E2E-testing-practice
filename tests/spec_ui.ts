import { movieDB_base } from "../po/po";
const { setPage } = require("../helpers/helper")
const { test, expect } = require('@playwright/test');



let page
let currentPage

test('Click on TV series', async() => {
    page = new movieDB_base(await setPage(), "https://www.themoviedb.org/");
    await page.openPage();
   });

