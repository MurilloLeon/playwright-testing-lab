import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { type BookingInput } from '../types/booking';

export class BookingPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly bookButton: Locator;
  readonly successMessage: Locator;
  readonly calendarNextButton: Locator;
  readonly errorMessages: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByPlaceholder('Firstname');
    this.lastNameInput = page.getByPlaceholder('Lastname');
    this.emailInput = page.getByPlaceholder('Email');
    this.phoneInput = page.getByPlaceholder('Phone');
    this.bookButton = page.getByRole('button', { name: 'Reserve Now' });
    this.successMessage = page.locator('.booking-confirmation');
    this.calendarNextButton = page.locator('.rbc-btn-group button').last();
    this.errorMessages = page.locator('.alert-danger li');
  }

  async goto(): Promise<void> {
    await super.goto('/');
    await this.waitForPageLoad();
  }

  async openFirstRoomBookingPanel(): Promise<void> {
    const bookNowLink = this.page.getByRole('link', { name: 'Book now', exact: true }).first();
    const href = await bookNowLink.getAttribute('href');
    await this.page.goto(href!);
    const reserveButton = this.page.getByRole('button', { name: 'Reserve Now' });
    await reserveButton.waitFor({ state: 'visible' });
    await reserveButton.scrollIntoViewIfNeeded();
    await reserveButton.click();
    await this.firstNameInput.waitFor({ state: 'visible' });
  }

  async fillBookingDetails(details: Omit<BookingInput, 'roomId' | 'checkin' | 'checkout'>): Promise<void> {
    await this.firstNameInput.fill(details.firstname);
    await this.lastNameInput.fill(details.lastname);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
  }

  async selectDateRange(): Promise<void> {
    const days = this.page.locator('.rbc-date-cell:not(.rbc-off-range)');
    const count = await days.count();
    if (count >= 2) {
      await days.nth(1).click();
      await days.nth(3).click();
    }
  }

  async submitBooking(): Promise<void> {
    await this.bookButton.click();
  }

  async isBookingConfirmed(): Promise<boolean> {
    return this.successMessage.isVisible();
  }

  async getValidationErrors(): Promise<string[]> {
    await this.errorMessages.first().waitFor({ state: 'visible' });
    return this.errorMessages.allTextContents();
  }
}
