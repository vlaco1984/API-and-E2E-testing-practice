import { expect, type Locator, type Page } from '@playwright/test';
import { menu } from '../test-data/data.json'
 

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
  }



  
  async openPage () {
    await this.page.goto(this.URL);
    //await expect(this.page).toHaveURL(this.URL)
    };
  
  async checkMenuItems () {
    console.log(menu)
    menu.forEach(async menuItem => {
      //this.itemText = menuItem;
      //console.log(this.itemText);
    // await this.menu.click()
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