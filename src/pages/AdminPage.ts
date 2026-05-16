import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminPage extends BasePage {
  readonly roomsLink: Locator;
  readonly reportLink: Locator;
  readonly brandingLink: Locator;
  readonly logoutButton: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.roomsLink = page.getByRole('link', { name: 'Rooms' });
    this.reportLink = page.getByRole('link', { name: 'Report' });
    this.brandingLink = page.getByRole('link', { name: 'Branding' });
    this.logoutButton = page.getByRole('link', { name: 'Logout' });
    this.pageHeading = page.getByRole('heading', { level: 1 });
  }

  async goto(): Promise<void> {
    await super.goto('/#/admin');
    await this.waitForPageLoad();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async isAdminPanelVisible(): Promise<boolean> {
    return this.logoutButton.isVisible();
  }

  async navigateToRooms(): Promise<void> {
    await this.roomsLink.click();
  }
}
