import { type Page, type Locator } from '@playwright/test';

export class NavBar {
  private readonly page: Page;
  readonly adminLink: Locator;
  readonly logoLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminLink = page.getByRole('link', { name: /Admin/i });
    this.logoLink = page.getByRole('link', { name: /Restful Booker/i });
  }

  async clickAdmin(): Promise<void> {
    await this.adminLink.click();
  }

  async clickLogo(): Promise<void> {
    await this.logoLink.click();
  }

  async isVisible(): Promise<boolean> {
    return this.adminLink.isVisible();
  }
}
