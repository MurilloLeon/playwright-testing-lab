import { test as base, expect } from '@playwright/test';
import { BookingPage } from '../../../src/pages/BookingPage';
import { NavBar } from '../../../src/pages/components/NavBar';
import { RoomCard } from '../../../src/pages/components/RoomCard';
import { createBookingDetails } from '../../../src/helpers/test-data';

const test = base;

test.describe('Booking Flow', () => {
  test('should display rooms available for booking on the homepage', async ({ page }) => {
    const bookingPage = new BookingPage(page);
    await bookingPage.goto();
    const roomCard = new RoomCard(page, 0);
    await expect(roomCard.bookButton).toBeVisible();
  });

  test('should show the booking panel when clicking "Book this room"', async ({ page }) => {
    const bookingPage = new BookingPage(page);
    await bookingPage.goto();
    await bookingPage.openFirstRoomBookingPanel();
    await expect(bookingPage.firstNameInput).toBeVisible();
    await expect(bookingPage.lastNameInput).toBeVisible();
    await expect(bookingPage.emailInput).toBeVisible();
    await expect(bookingPage.phoneInput).toBeVisible();
  });

  test('should show validation errors when submitting empty booking form', async ({ page }) => {
    const bookingPage = new BookingPage(page);
    await bookingPage.goto();
    await bookingPage.openFirstRoomBookingPanel();
    await bookingPage.submitBooking();
    const errors = await bookingPage.getValidationErrors();
    expect(errors.length).toBeGreaterThan(0);
  });

  test('should display the navbar with admin link on the homepage', async ({ page }) => {
    const bookingPage = new BookingPage(page);
    await bookingPage.goto();
    const navBar = new NavBar(page);
    await expect(navBar.adminLink).toBeVisible();
  });
});
