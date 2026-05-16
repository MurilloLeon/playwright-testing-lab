import { test, expect } from '../../../src/fixtures';

test.describe('Admin Login', () => {
  test('should login successfully with valid admin credentials', async ({ loginPage, page }) => {
    await loginPage.loginAsAdmin();
    await expect(page).toHaveURL(/.*admin/);
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });

  test('should display error with invalid credentials', async ({ loginPage }) => {
    await loginPage.login('invalid_user', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should display error with empty credentials', async ({ loginPage }) => {
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should keep login form visible after failed attempt', async ({ loginPage }) => {
    await loginPage.login('bad_user', 'bad_pass');
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
