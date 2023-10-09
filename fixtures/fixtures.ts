import { test as base, APIRequestContext, request, chromium } from '@playwright/test';
import { movieDB_base } from '../po/po';
import { setPage } from '../helpers/helper'



type MyFixtures = {
    contextAuth: APIRequestContext,
    contextUnauth: APIRequestContext
    basePage: movieDB_base  
}


const test = base.extend<MyFixtures>({

    
    contextAuth: async ({baseURL}, use) => {
        const contextAuth = await request.newContext({baseURL, extraHTTPHeaders: {
            'Authorization': `Bearer ${process.env.MOVIEDB_ACCESS}`    
    }});
        await use(contextAuth)
    },
    contextUnauth: async({baseURL}, use) => {
        const contextUnauth = await request.newContext({baseURL});
        await use(contextUnauth)   
    },
    basePage: async({page}, use) => {
        const basePage = new movieDB_base(await setPage(), 'https://api.themoviedb.org');
        await use(basePage)
    }
   
})


export {expect} from '@playwright/test';
module.exports = { test }