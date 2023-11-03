import { expect, type Locator, type Page, type Keyboard } from '@playwright/test';
import data from '../test-data/data.json'
 

export class movieDB_base {
  URL: string;
  readonly page: Page;
  readonly login: Locator;
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
  langDropdownItem: any
  
 

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
    }
    this.defaultLang = page.locator('label#default_language_popup_label')
    this.defaultLangInput = page.locator('input.k-textbox[aria-owns=default_language_popup_listbox]')
    this.pageRefresh = page.locator('a.no_click.button.rounded.upcase')
    this.langDropdownItem  = (itemText: string): Locator => {
      return page.locator('li.k-item.k-state-selected.k-state-focused', { hasText: itemText})
    }
  }

  async pressButton(key) {
    await this.page.keyboard.press(key)
  }
 
  
  async openPage () {
    await this.page.goto(this.URL);
    //await expect(this.page).toHaveURL(this.URL)
    };
  
  
  async getLang ():Promise<string> {
    let langRaw = await this.langSel().textContent()
    return await langRaw.trim()
  }
  
  async checkMenuItems () {
    let lang = data[await this.getLang()]
    let menu = lang.menuData
    menu.forEach(async menuItem => {
    await expect(this.menuItems(menuItem)).toBeVisible();
    });
  }

}

export class loginPage extends movieDB_base {
  readonly inputName: Locator;
  readonly inputPass: Locator;
  readonly loginButton: Locator;
  
  constructor (page: Page, URL: string) {
    super (page, URL)
    this.URL = URL
    this.inputName = page.locator('input#username')
    this.inputPass = page.locator('input#password')
    this.loginButton = page.locator('input#login_button')
  }
}