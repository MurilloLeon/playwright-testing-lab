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
    this.roomTypeSelect = page.getByTestId('type');
    this.accessibleSelect = page.getByTestId('accessible');
    this.priceInput = page.getByTestId('roomPrice');
    this.roomNumberInput = page.getByTestId('roomName');
    this.createRoomButton = page.getByTestId('createRoom');
    this.roomList = page.locator('.room-listing');
  }

  async goto(): Promise<void> {
    await super.goto('/#/admin/rooms');
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
    const rooms = this.page.locator('.room-listing > .row');
    return rooms.count();
  }

  async isRoomVisible(roomName: string): Promise<boolean> {
    const roomRow = this.page.locator(`.room-listing .row:has-text("${roomName}")`);
    return roomRow.isVisible();
  }
}
