import { test as base, APIRequestContext, request, chromium } from '@playwright/test';
import { loginPage, movieDB_base } from '../po/po';
import { setPage } from '../helpers/helper'



type MyFixtures = {
    contextAuth: APIRequestContext;
    contextUnauth: APIRequestContext;
    pageAuth: loginPage;
    pageUnauth: movieDB_base;  
}


const test = base.extend<MyFixtures>({

    
    contextAuth: async ({baseURL}, use) => {
        const contextAuth = await request.newContext({baseURL, extraHTTPHeaders: {
            'Authorization': `Bearer ${process.env.MOVIEDB_ACCESS}`    
    }});
        await use(contextAuth)
    },
    contextUnauth: async({baseURL}, use) => {
        const contextUnauth = await request.newContext({baseURL, extraHTTPHeaders: {
            'Authorization': `Bearer ${process.env.MOVIEDB_APIKEY}`,
            'accept': 'application/json'
        }});
        await use(contextUnauth)   
    },
    pageAuth: async({page}, use) => {
        const pageAuth = new loginPage(await setPage(), "login");
        await pageAuth.openPage();
        await pageAuth.inputName.fill(`${process.env.MOVIEDB_USER}`);
        await pageAuth.inputPass.fill(`${process.env.MOVIEDB_PASS}`);
        await pageAuth.loginButton.click();
        await pageAuth.cookieAccept.click();
        await use (pageAuth);
    },
    pageUnauth: async ({page}, use) => {
        const pageUnauth = new movieDB_base(await setPage(), "");
        await pageUnauth.openPage();
        await use (pageUnauth);
    }
      
})


export {expect} from '@playwright/test';
module.exports = { test }