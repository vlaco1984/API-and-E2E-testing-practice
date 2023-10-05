import { expect, type Locator, type Page } from '@playwright/test';

export class movieDB_base {
  URL: string;
  readonly page: Page;
  readonly searchInputField: Locator;
  readonly dropdownTV: Locator;
 

  constructor(page: Page, URL: string ) {
    this.page = page;
    this.URL = URL;
    this.searchInputField = page.locator('#inner_search_v4');
    this.dropdownTV = page.locator('a.no_click.k-link.k-menu-link.k-state-active.k-state-border-down', { hasText: 'Tévéműsorok' });
    
  }

  async openPage () {
    await this.page.goto(this.URL);
    //await expect(this.page).toHaveURL(this.URL)
    };

}