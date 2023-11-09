import { expect, type Locator, type Page, type Keyboard } from '@playwright/test';
import data from '../test-data/data.json'
 

export class movieDB_base {
  URL: string;
  readonly page: Page;
  readonly searchInputField: Locator;
  readonly dropdownTV: Locator;
  readonly glass: Locator;
  readonly menu: Locator;
  readonly cookieAccept: Locator;
  menuItems: any;
  langSel: any;
  readonly defaultLang: Locator;
  readonly defaultLangInput: Locator;
  readonly pageRefresh: Locator;
  langDropdownItem: any;
  readonly cookieBar: Locator
  readonly searchBar: Locator
  searchSugList: any
  readonly searchSugListItem: Locator
  noSuggestion: any
  
 

  constructor(page: Page, URL: string ) {
    this.page = page;
    this.URL = URL;
    this.searchInputField = page.locator('#inner_search_v4');
    this.dropdownTV = page.locator('a.no_click.k-link.k-menu-link', { hasText: "Tévéműsorok" });
    this.menuItems = (itemText: string): Locator => {
      return page.locator('a.no_click.k-link.k-menu-link', { hasText: itemText }  )
    }
    this.glass = page.locator('span.glyphicons_v2.search.blue')
    this.cookieAccept = page.locator('button#onetrust-accept-btn-handler')
    this.menu = page.locator('a.no_click.k-link.k-menu-link')
    this.langSel = (itemText: string): Locator => {
      return page.locator('li.translate', { hasText: itemText})
    },
    this.defaultLang = page.locator('label#default_language_popup_label')
    this.defaultLangInput = page.locator('input.k-textbox[aria-owns=default_language_popup_listbox]')
    this.pageRefresh = page.locator('a.no_click.button.rounded.upcase')
    this.langDropdownItem  = (itemText: string): Locator => {
      return page.locator("#default_language_popup_listbox").getByRole('option', { name: itemText })
    },
    this.cookieBar = page.locator('#onetrust-policy'),
    this.searchBar = page.locator('input#search_v4.k-input')
    this.searchSugList = (itemText: string): Locator => {
      return page.locator('#search_v4_listbox', { hasText: itemText})
    },
    this.searchSugListItem = page.locator('#search_v4_listbox > li')
    this.noSuggestion = (itemText: string): Locator =>  {
      return page.locator('div.k-nodata', { hasText: itemText })
    }
  }

  async pressButton(key) {
    await this.page.keyboard.press(key)
  }
 

  async setLang (lang) {
    for (let i=0; i<Infinity; i++) {
      if (!await this.defaultLang.isVisible()) {
        await this.langSel().click()
      } else {
        break;
      }
    }     
    await this.defaultLang.click();
    await this.defaultLangInput.fill(lang);
    await this.langDropdownItem(lang).click();
    await this.pageRefresh.click()
  }


  
  async openPage () {
    await this.page.goto(this.URL);
    };
  
  
  async getLang ():Promise<string> {
    let langRaw = await this.langSel().textContent()
    return await langRaw.trim()
  }

  async setDefLang () {
    if (await this.getLang()!='en') {
      await this.setLang('angol (en-US)')
    };
  }
  
  async getMenuPath () {
    let lang = data[await this.getLang()]
    return lang.menuData
  }

  async getNoResPath () {
    let lang = data[await this.getLang()]
    return lang.noResultMessage
  }

  async checkMenuItems () {
    let menu = await this.getMenuPath()
    console.log(menu)
    menu.forEach(async menuItem => {
    await expect(await this.menuItems(menuItem)).toBeVisible();
    });
  }

  

async getSearchSuggestions () {
let list = await this.searchSugListItem.allTextContents();
return list
}

async checkSearchSuggestions (term) {
let list = await this.getSearchSuggestions ()
list.forEach(listItem => {
  expect(listItem.toLowerCase()).toContain(term.toLowerCase())
})
}

}

export class loginPage extends movieDB_base {
  readonly inputName: Locator;
  readonly inputPass: Locator;
  readonly loginButton: Locator;
  
  constructor (page: Page, URL: string) {
    super (page, URL);
    this.URL = URL;
    this.inputName = page.locator('input#username')
    this.inputPass = page.locator('input#password')
    this.loginButton = page.locator('input#login_button')
  }

  async login () {
  await this.openPage();
  await this.inputName.fill(`${process.env.MOVIEDB_USER}`);
  await this.inputPass.fill(`${process.env.MOVIEDB_PASS}`);
  await this.loginButton.click();
  await this.cookieAccept.click();
  await expect(this.cookieBar).not.toBeVisible()
  }

  

}

export class searchPage extends movieDB_base {
  readonly searchResultPanel: Locator
  searchResultItem: any
  searchResultList: Locator;
  
  constructor (page: Page, URL: string) {
    super (page, URL);
    this.URL = URL;
    this.searchResultPanel = page.locator('div#search_menu_scroller');
    this.searchResultList = page.locator('div.search_results movie')
    this.searchResultItem = (itemText: string):Locator => {
    return page.locator('div.title',{ hasText: itemText})
   }
  }

  async executeSearch (term) {
    await this.searchBar.fill(term);
    await this.page.keyboard.press('Enter');
    await expect(this.searchResultPanel).toBeVisible();
  }

  async getSearchResults () {
    let list = await this.searchResultItem().allTextContents();
    return await list
    }
  
  async checkSearchResults (term) {
    let list = await this.getSearchResults ()
    list.forEach(listItem => {
    expect(listItem.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '')).toContain(term.toLowerCase())
    })
  }

}


