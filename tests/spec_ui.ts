import { movieDB_base } from "../po/po";
const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures')
const { menuItems } = require('../test-data/data.json')
import data from '../test-data/data.json'


test.describe('Language switcher', async () => {
    
test('The language switcher should work properly', async ({pageAuth}) => {
    
    await test.step('The language should should be English', async () => {
        await expect(await pageAuth.langSel('en')).toBeVisible();
        })

    await test.step('Menu items should be in English', async () => {
        let menu = await pageAuth.getMenuData();
        menu.forEach(async menuItem => {
            await expect(await pageAuth.menuItems(menuItem)).toBeVisible();
            });
        });

    await test.step('Click on lang switcher and select Hungarian as default lang', async () => {
        await pageAuth.setLang("Hungarian (hu-HU)");
        })

    await test.step('Reload page', async () => {
        await pageAuth.pageRefresh.click();
        })

    await test.step('The language should be Hungarian', async () => {
        await expect(await pageAuth.langSel()).toHaveText('hu')
        })

    await test.step('The menu items should be in Hungarian', async () => {
        let menu = await pageAuth.getMenuData();
        menu.forEach(async menuItem => {
            await expect(await pageAuth.menuItems(menuItem)).toBeVisible();
            });
        })
    })
})


test.describe('Search', async () => {

test('Autocomplete should work properly with valid search term', async ({pageUnauth}) => {
    
    await test.step('Clicking on the search icon to open search bar', async () => {
        await pageUnauth.glass.click();
        })

    await test.step('Type search term into search input field', async () => {
        await pageUnauth.searchBar.click();
        await pageUnauth.searchBar.fill(data.searchTerm);
        await expect(pageUnauth.searchSugList(data.searchTerm)).toBeVisible();
    })

    await test.step('Search suggestions should include the given term', async () => {
        let list = await pageUnauth.getSearchSuggestions ();
        list.forEach(listItem => {
          expect(listItem.toLowerCase()).toContain(data.searchTerm.toLowerCase())
        });
    })
})

test('Autocomplete has no result in case of search term containing special characters', async ({pageUnauth}) => {
    await test.step('Clicking on the search icon to open search bar', async () => {
        await pageUnauth.glass.click()
        })

    await test.step('Type search term into search input field', async () => {
        await pageUnauth.searchBar.click();
        await pageUnauth.searchBar.fill(data.searchTermSpecialChar);
    })

    await test.step('No result text should be visible', async () => {
        await expect(await pageUnauth.noSuggestion(await pageUnauth.getNoResData())).toBeVisible()
    })
})

test('Search should work properly with valid search term', async ({pageSearch}) => {

    await test.step('Execute search with given term', async () => {
        await pageSearch.executeSearch(data.searchTerm)
    });

    await test.step('Search result items should include the given term', async () => {
        let list = await pageSearch.getSearchResults();
        list.forEach(listItem => {
        expect(listItem).toContain(data.searchTerm.toLowerCase())
        })
    });

})

})


