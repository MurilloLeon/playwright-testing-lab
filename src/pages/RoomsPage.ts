import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { type RoomInput } from '../types/room';

export class RoomsPage extends BasePage {
  readonly roomTypeSelect: Locator;
  readonly accessibleSelect: Locator;
  readonly priceInput: Locator;
  readonly roomNumberInput: Locator;
  readonly createRoomButton: Locator;
  readonly roomList: Locator;

  constructor(page: Page) {
    super(page);
    this.roomTypeSelect = page.locator('#type');
    this.accessibleSelect = page.locator('#accessible');
    this.priceInput = page.locator('#roomPrice');
    this.roomNumberInput = page.getByTestId('roomName');
    this.createRoomButton = page.locator('#createRoom');
    this.roomList = page.locator('.row.detail');
  }

  async goto(): Promise<void> {
    await super.goto('/admin/rooms');
    await this.waitForPageLoad();
  }

  async createRoom(room: RoomInput): Promise<void> {
    await this.roomNumberInput.fill(room.roomName);
    await this.roomTypeSelect.selectOption(room.type);
    await this.accessibleSelect.selectOption(String(room.accessible));
    await this.priceInput.fill(String(room.roomPrice));
    await this.createRoomButton.click();
  }

  async getRoomCount(): Promise<number> {
    await this.page.locator('.row.detail').first().waitFor({ state: 'visible' });
    return this.page.locator('.row.detail').count();
  }

  async isRoomVisible(roomName: string): Promise<boolean> {
    const roomRow = this.page.locator(`.row.detail:has-text("${roomName}")`);
    return roomRow.isVisible();
  }
}
