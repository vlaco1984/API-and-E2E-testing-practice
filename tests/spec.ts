import { APIRequest, APIResponse, APIRequestContext, expect, type Page, request } from '@playwright/test';
const { test } = require('../fixtures/fixtures')
const { listData, userName, baseURL } = require('../test-data/data.json')




test.describe("Movie DB API Testing Practice", () => {

   // let context: APIRequestContext;
    


/*test.beforeAll(async () => {
context = await request.newContext({
    extraHTTPHeaders: {
        'Authorization': `Bearer ${process.env.MOVIEDB_ACCESS}`
    },
    baseURL: baseURL });


})                  */
            
test("All genre items need to be correct", async ({contextAuth}) => {
    let listBody;
    
    await test.step("Get genre list", async () => {
        let res = await contextAuth.get('3/genre/movie/list');
        listBody = await res.json();
        expect(res).toBeOK
    })

    await test.step("All genre names are string", async () => {
        listBody.genres.forEach(genreItem => {
        expect(typeof genreItem.name).toBe("string");
        })
    })

    await test.step("All genre names are string", async () => {
        listBody.genres.forEach(genreItem => {
        expect(typeof genreItem.id).toBe("number");
        })
    })
})

    

test("The username should be match", async ({contextAuth}) => {
    let res:APIResponse = await contextAuth.get('3/account/20403583');
    let resBody = await res.json();
    expect(resBody.username).toBe(userName)
    })

test("Lists work properly", async ({contextAuth}) => {
let listID: number;
let movieID: number = 24;

    await test.step("New list should be created", async () => {
        let res:APIResponse = await contextAuth.post('3/list', {
        data: listData
        })
        let resBody = await res.json();
        listID = await resBody.list_id
        expect(res.status()).toBe(201)
        })

    await test.step("Data should be match by generated listID", async () => {
        console.log(listID)
        let res:APIResponse = await contextAuth.get(`3/list/${listID}`);
        let resBody = await res.json();
        console.log(resBody);
        let dataArray = Object.keys(listData);
        console.log(dataArray);
        dataArray.forEach(key => {
            expect(listData [key]).toEqual(resBody [key])
            });

    await test.step("New item is added", async () => {
    let res: APIResponse = await contextAuth.post(`3/list/${listID}/add_item`, {
        data: {
            "media_id": movieID
        }
    });
    expect(res.status()).toBe(201);
    })
    
    await test.step("New item is added to the item array of the list", async () => {
        let res:APIResponse = await contextAuth.get(`3/list/${listID}`);
        let resBody = await res.json();
        console.log(resBody.items);
        expect(res).toBeOK
        expect(resBody.items.length).toBeGreaterThan(0);
        expect(resBody.items[0].id).toBe(movieID);
    })

    await test.step("Remove added movie item from the list", async () => {
    let res:APIResponse = await contextAuth.post(`3/list/${listID}/remove_item`, {
        data: {
            "media_id": movieID
        }
    });
    expect(res).toBeOK
    })

    await test.step("Array of items should be empty", async () => {
    let res:APIResponse = await contextAuth.get(`3/list/${listID}`);
    let resBody = await res.json();
    expect(res).toBeOK
    expect(resBody.items.length).toBe(0)
    })

})

})




})

test.describe("Unauthenticated cases", async () => {
    test("getting list status code should be not OK", async ({contextUnauth}) => {
    let list = await contextUnauth.get('3/genre/movie/list');
    expect(list).not.toBeOK
    })
})
