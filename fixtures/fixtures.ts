import { test as base, APIRequestContext, request } from '@playwright/test';


type MyFixtures = {
    contextAuth: APIRequestContext,
    contextUnauth: APIRequestContext    
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
    }
   
})


export {expect} from '@playwright/test';
module.exports = { test }