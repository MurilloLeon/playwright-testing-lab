import { type Page, type Locator } from '@playwright/test';

export class RoomCard {
  private readonly card: Locator;
  readonly bookButton: Locator;
  readonly roomName: Locator;
  readonly roomDescription: Locator;

  constructor(page: Page, index: number = 0) {
    this.card = page.locator('.room-card').nth(index);
    this.bookButton = this.card.getByRole('link', { name: 'Book now', exact: true });
    this.roomName = this.card.locator('.card-title');
    this.roomDescription = this.card.locator('.card-text').first();
  }

  async clickBook(): Promise<void> {
    await this.bookButton.click();
  }

  async getName(): Promise<string> {
    return this.roomName.innerText();
  }

  async isVisible(): Promise<boolean> {
    return this.card.isVisible();
  }
}
