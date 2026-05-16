import { test, expect } from '../../../src/fixtures';
import { LoginPage } from '../../../src/pages/LoginPage';

test.describe('Admin Logout', () => {
  test('should logout successfully and redirect to login page', async ({ adminPage, page }) => {
    await expect(adminPage.logoutButton).toBeVisible();
    await adminPage.logout();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

});
