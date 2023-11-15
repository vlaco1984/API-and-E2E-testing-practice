import { APIRequest, APIResponse, APIRequestContext, expect, type Page, request } from '@playwright/test';
const { test } = require('../fixtures/fixtures')
const { listData, userName, emptyRatedBody, invalidGuestID, seriesID, ratingValue, accountID, watchlistData, movieID, invalidData } = require('../test-data/data.json')




test.describe("Genre list, list", () => {


            
test("All genre items should be correct", async ({contextAuth}) => {
    let listBody;
    
    console.log(process.env.MOVIEDB_APIKEY)

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

    await test.step("All genre IDs should be number", async () => {
        listBody.genres.forEach(genreItem => {
        expect(typeof genreItem.id).toBe("number");
        })
    })
})

    

test("Lists work properly", async ({contextAuth}) => {
let listID: number;

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
            data: movieID
        });
        expect(res.status()).toBe(201);
    })
    
    await test.step("New item is added to the item array of the list", async () => {
        let res:APIResponse = await contextAuth.get(`3/list/${listID}`);
        let resBody = await res.json();
        console.log(resBody.items);
        expect(res).toBeOK;
        expect(resBody.items.length).toBe(1);
        expect(resBody.items[0].id).toBe(movieID.media_id);
    })

    await test.step("Remove added movie item from the list", async () => {
        let res:APIResponse = await contextAuth.post(`3/list/${listID}/remove_item`, {
            data: movieID
        });
        expect(res).toBeOK;
    })

    await test.step("Array of items should be empty", async () => {
        let res:APIResponse = await contextAuth.get(`3/list/${listID}`);
        let resBody = await res.json();
        expect(res).toBeOK;
        expect(resBody.items.length).toBe(0);
    })

})



test("List should not be created with invalid data", async ({contextAuth}) => {
  
    let res:APIResponse

    await test.step("Send invalid data", async () => {
        res = await contextAuth.post(`3/list`, {
            data: invalidData
            })
        })

    await test.step("Should be get unsuccessfully response code", async () => {
        console.log(res.status());
        expect(res).not.toBeOK;
        })   
    
})

})



test.describe("Rating", () => {

test ("Empty rated movie list should be empty by default in guest session", async ({contextAuth}) => {
    let guestID;
    let rateBody;
    
    await test.step("Get guest ID", async () => {
        let res:APIResponse = await contextAuth.get('3/authentication/guest_session/new');
        let resBody = await res.json();
        guestID = await resBody.guest_session_id;
        expect(res).toBeOK;
    })

    await test.step("GET Rated Movies succesfully", async () => {
        let res:APIResponse = await contextAuth.get(`3/guest_session/${guestID}/rated/movies`);
        expect(res).toBeOK;
        rateBody = await res.json();
    })

    await test.step("The Rated Movies body should be match with expected data", async () => {
      expect(rateBody).toStrictEqual(emptyRatedBody);  
    })
})

test ("Rate list should not be got by Invalid guest ID", async ({contextAuth}) => {
    let resBody;

    await test.step("Get rate list", async () => {
        let res:APIResponse = await contextAuth.get(`3/guest_session/${invalidGuestID}/rated/movies`);
        expect(res).toBeOK;
        resBody = await res.json();
        console.log(resBody);
        });
    await test.step("Getting rate list should be unsuccesully", async () => {
        expect(resBody.success).toBeFalsy;
    })   
})

test("Rate list should not be got unauthenticated", async ({contextUnauth}) => {
    let guestID;
    let rateBody;
    
    await test.step("Get guest ID", async () => {
        let res:APIResponse = await contextUnauth.get('3/authentication/guest_session/new');
        let resBody = await res.json();
        guestID = await resBody.guest_session_id;
        expect(guestID);
        expect(res).not.toBeOK();
    })

    await test.step("GET Rated Movies by ID not succesfully", async () => {
        let res:APIResponse = await contextUnauth.get(`3/guest_session/${guestID}/rated/movies`);
        expect(res).not.toBeOK();
        console.log(res.status())
        rateBody = await res.json();
        expect(rateBody.success).toBe(false)
    })
})

test("Rated movie should be got in the response", async ({contextAuth}) => {
    let rateBody;

    await test.step("Add movie to rated list successfully", async () => {
        let res:APIResponse = await contextAuth.post(`3/tv/${seriesID}/rating`, {
            data: ratingValue
        });
        let resBody = await res.json();
        expect(resBody.success).toBe(true)
        console.log(resBody)
    })

    await test.step("GET Rated Movies successfully", async () => {
        let res:APIResponse = await contextAuth.get(`3/account/${accountID}/rated/tv`)
        expect(res).toBeOK();
        rateBody = await res.json();
        console.log(rateBody);
        expect(rateBody.results[0].id).toBe(seriesID);
        expect(rateBody.results[0].rating).toBe(ratingValue.value);
    })
    
})

test("Rating should not be successfull by sending invalid data", async ({contextAuth}) => {
    let res:APIResponse;
   
    await test.step("Sent movie to rated list", async () => {
        res = await contextAuth.post(`3/tv/${seriesID}/rating`, {
        data: invalidData
        });
    })

    await test.step("Movie should not be rated", async () => {
        expect(res).not.toBeOK();
        let resBody = await res.json();
        expect(resBody.success).toBe(false);
        console.log(resBody);
    })
        
})




})

test.describe("Watch lists", () => {

    test("Series watch list should be empty by default", async ({contextAuth}) => {
        let resBody;

        await test.step("Get watchlist", async () => {
            let res:APIResponse = await contextAuth.get(`3/account/${accountID}/watchlist/tv`);
            expect(res).toBeOK;
            resBody = await res.json();
            console.log(resBody)
        });

        await test.step("Watchlist should be empty", async () => {
            expect(resBody.results.length).toBe(0)
        })
    })

    test("New watchlist item should be added properly", async ({contextAuth}) => {
        let resBody;

        await test.step("New movie item is added to watchlist", async () => {
           let res:APIResponse = await contextAuth.post(`3/account/${accountID}/watchlist`, {
            data: watchlistData
           });
           expect(res.status()).toBe(201)
           resBody = await res.json()
           expect(resBody.success).toBe(true)
        })

        await test.step("Get movies watchlist", async () => {
            let res:APIResponse = await contextAuth.get(`3/account/${accountID}/watchlist/movies`);
            expect(res).toBeOK;
            resBody = await res.json();
            console.log(resBody)
        });

        await test.step("Watchlist items should contain the previously requested ID", async () => {
            expect(resBody.results[0].id).toBe(watchlistData.media_id)
        })

        await test.step("Get TV series watchlist", async () => {
            let res:APIResponse = await contextAuth.get(`3/account/${accountID}/watchlist/tv`);
            expect(res).toBeOK;
            resBody = await res.json();
        })

        await test.step("TV series watchlist should be empty after adding movie to watchlist", () => {
            expect(resBody.results.length).toBe(0)
        })
    })

    test("Invalid watchlist data sent should result unsuccessfully response", async ({contextAuth}) => {

        let res:APIResponse

        await test.step("Send invalid data", async () => {
            res = await contextAuth.post(`3/account/${accountID}/watchlist/tv`, {
                data: invalidData
            })
        })

        await test.step("Should be get unsuccessfully response code", async () => {
            expect(res).not.toBeOK
        })
    })
})

test.describe("Movie details", () => {
    test("Configuration details should be got unauthenticated", async ({contextUnauth}) => {
        
        let res:APIResponse

        await test.step("Get Details", async () => {
            res = await contextUnauth.get(`3/movie/${movieID.media_id}`)
            console.log(await res.json())
        }) 
    })
})











