import { APIRequest, APIResponse, APIRequestContext, expect, type Page, request } from '@playwright/test';
const { test } = require('../fixtures/fixtures')
const { listData, userName, emptyRatedBody, invalidGuestID, seriesID, ratingValue } = require('../test-data/data.json')




test.describe("Movie DB API Testing Practice", () => {


            
test("All genre items should be correct", async ({contextAuth}) => {
    let listBody;
    
    await test.step("Get genre list", async () => {
        let res = await contextAuth.get('3/genre/movie/list');
        listBody = await res.json();
        expect(res).toBeOK
    })

    await test.step("All genre names should be string", async () => {
        listBody.genres.forEach(genreItem => {
        expect(typeof genreItem.name).toBe("string");
        })
    })

    await test.step("All genre IDs should be string", async () => {
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
        listID = await resBody.list_id;
        expect(res.status()).toBe(201);
        })

    await test.step("Data should be match by generated listID", async () => {
        console.log(listID);
        let res:APIResponse = await contextAuth.get(`3/list/${listID}`);
        let resBody = await res.json();
        console.log(resBody);
        let dataArray = Object.keys(listData);
        dataArray.forEach(key => {
            expect(listData [key]).toEqual(resBody [key])
        });
    })

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
        expect(res).toBeOK;
    })

    await test.step("Array of items should be empty", async () => {
        let res:APIResponse = await contextAuth.get(`3/list/${listID}`);
        let resBody = await res.json();
        expect(res).toBeOK
        expect(resBody.items.length).toBe(0)
    })

})

test.describe("Guest Session ID", () => {



test ("Empty rated movie list should be empty by default", async ({contextAuth}) => {
    let guestID;
    let rateBody;
    
    await test.step("Get guest ID", async () => {
        let res:APIResponse = await contextAuth.get('3/authentication/guest_session/new')
        let resBody = await res.json();
        guestID = await resBody.guest_session_id
        console.log("GESZTi" + guestID)
        expect(res).toBeOK
    })

    await test.step("GET Rated Movies by ID succesfully", async () => {
        let res:APIResponse = await contextAuth.get(`3/guest_session/${guestID}/rated/movies`)
        expect(res).toBeOK;
        rateBody = await res.json();
    })

    await test.step("The Rated Movies body should be match with expected data", async () => {
      expect(rateBody).toStrictEqual(emptyRatedBody)  
    })
})

test ("Rate list should not be got by Invalid guest ID", async ({contextAuth}) => {
    let resBody;

    await test.step("Get rate list", async () => {
        let res:APIResponse = await contextAuth.get(`3/guest_session/${invalidGuestID}/rated/movies`)
        expect(res).toBeOK;
        resBody = await res.json();
        console.log(resBody)
        });
    await test.step("Getting rate list should be unsuccesully", async () => {
        expect(resBody.success).toBeFalsy
    })
    
    
    //more step will be written here
})

test("Rate list should not be got unauthenticated", async ({contextUnauth}) => {
    let guestID;
    let rateBody;
    
    await test.step("Get guest ID", async () => {
        let res:APIResponse = await contextUnauth.get('3/authentication/guest_session/new');
        let resBody = await res.json();
        guestID = await resBody.guest_session_id;
        expect(guestID);
        expect(res).toBeOK;
    })

    await test.step("GET Rated Movies by ID succesfully", async () => {
        let res:APIResponse = await contextUnauth.get(`3/guest_session/${guestID}/rated/movies`);
        expect(res).toBeOK;
        rateBody = await res.json();
        expect(rateBody.success).toBeFalsy
    })
})

test("Rated movie should be got in the response", async ({contextAuth}) => {
    await test.step("Add movie to rated list", async () => {
        let res:APIResponse = await contextAuth.post(`3/tv/${seriesID}/rating`, {
            data: ratingValue
        })
        console.log(await res.json())
    })
})




})


})



test.describe("Unauthenticated test cases", async () => {
    test("getting list status code should be not OK", async ({contextUnauth}) => {
    let list = await contextUnauth.get('3/genre/movie/list');
    expect(list).not.toBeOK
    })
})
