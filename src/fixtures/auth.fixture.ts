import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AdminPage } from '../pages/AdminPage';

type AuthFixtures = {
  loginPage: LoginPage;
  adminPage: AdminPage;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  adminPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsAdmin();
    const adminPage = new AdminPage(page);
    await adminPage.logoutButton.waitFor({ state: 'visible' });
    await use(adminPage);
  },
});

export { expect } from '@playwright/test';
