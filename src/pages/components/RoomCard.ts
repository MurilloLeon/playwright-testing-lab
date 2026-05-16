import { type Page, type Locator } from '@playwright/test';

export class RoomCard {
  private readonly card: Locator;
  readonly bookButton: Locator;
  readonly roomName: Locator;
  readonly roomDescription: Locator;

  constructor(page: Page, index: number = 0) {
    this.card = page.locator('.hotel-room-info').nth(index);
    this.bookButton = this.card.getByRole('button', { name: /Book this room/i });
    this.roomName = this.card.locator('.room-header');
    this.roomDescription = this.card.locator('p.col-sm-9');
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
