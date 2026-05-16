import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByRole('alert');
  }

  async goto(): Promise<void> {
    await super.goto('/admin');
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAsAdmin(): Promise<void> {
    const username = process.env.ADMIN_USERNAME ?? 'admin';
    const password = process.env.ADMIN_PASSWORD ?? 'password';
    await this.login(username, password);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }
}
