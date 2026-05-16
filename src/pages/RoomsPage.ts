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
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.roomTypeSelect = page.getByTestId('type');
    this.accessibleSelect = page.getByTestId('accessible');
    this.priceInput = page.getByTestId('roomPrice');
    this.roomNumberInput = page.getByTestId('roomName');
    this.createRoomButton = page.getByTestId('createRoom');
    this.roomList = page.locator('.room-listing');
    this.successMessage = page.getByRole('alert');
  }

  async goto(): Promise<void> {
    await super.goto('/#/admin/rooms');
    await this.waitForPageLoad();
  }

  async createRoom(room: RoomInput): Promise<void> {
    await this.roomNumberInput.fill(String(room.roomNumber));
    await this.roomTypeSelect.selectOption(room.type);
    await this.accessibleSelect.selectOption(String(room.accessible));
    await this.priceInput.fill(String(room.price));
    await this.createRoomButton.click();
  }

  async getRoomCount(): Promise<number> {
    const rooms = this.page.locator('.room-listing > .row');
    return rooms.count();
  }

  async deleteRoomByNumber(roomNumber: number): Promise<void> {
    const roomRow = this.page.locator(`.room-listing .row:has-text("${roomNumber}")`);
    const deleteButton = roomRow.getByRole('button', { name: /delete/i });
    await deleteButton.click();
  }

  async isRoomVisible(roomNumber: number): Promise<boolean> {
    const roomRow = this.page.locator(`.room-listing .row:has-text("${roomNumber}")`);
    return roomRow.isVisible();
  }
}
