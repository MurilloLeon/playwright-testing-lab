import { test, expect } from '../../../src/fixtures';
import { LoginPage } from '../../../src/pages/LoginPage';

test.describe('Admin Logout', () => {
  test('should logout successfully and redirect to login page', async ({ adminPage, page }) => {
    await expect(adminPage.logoutButton).toBeVisible();

    await adminPage.logout();

    await expect(page.getByTestId('username')).toBeVisible();
    await expect(page.getByTestId('password')).toBeVisible();
  });

  test('should not be able to access admin panel after logout', async ({ adminPage, page }) => {
    await adminPage.logout();

    await page.goto('/#/admin/rooms');

    const loginPage = new LoginPage(page);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
