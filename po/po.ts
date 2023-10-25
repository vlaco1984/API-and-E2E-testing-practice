import { expect, type Locator, type Page } from '@playwright/test';

export class movieDB_base {
  URL: string;
  readonly page: Page;
  readonly login: Locator;
  readonly searchInputField: Locator;
  readonly dropdownTV: Locator;
  readonly glass: Locator;
  readonly menuItems: Locator;
  readonly itemText: string
 

  constructor(page: Page, URL: string ) {
    this.page = page;
    this.URL = URL;
    this.searchInputField = page.locator('#inner_search_v4');
    this.dropdownTV = page.locator('a.no_click.k-link.k-menu-link', { hasText: "Tévéműsorok" });
    this.menuItems = page.locator('a.no_click.k-link.k-menu-link', { hasText: this.itemText  })
    this.glass = page.locator('span.glyphicons_v2.search.blue')
    
  }



  
  async openPage () {
    await this.page.goto(this.URL);
    //await expect(this.page).toHaveURL(this.URL)
    };

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