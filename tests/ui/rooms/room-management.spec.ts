import { test, expect } from '../../../src/fixtures';
import { RoomsPage } from '../../../src/pages/RoomsPage';
import { createRoomData } from '../../../src/helpers/test-data';

test.describe('Room Management', () => {
  let roomsPage: RoomsPage;

  test.beforeEach(async ({ adminPage, page }) => {
    await adminPage.navigateToRooms();
    roomsPage = new RoomsPage(page);
  });

  test('should display the rooms list on admin panel', async ({ page }) => {
    await expect(page.locator('.room-listing')).toBeVisible();
  });

  test('should create a new room successfully', async () => {
    const roomData = createRoomData({ type: 'Double', roomPrice: 150 });

    const countBefore = await roomsPage.getRoomCount();
    await roomsPage.createRoom(roomData);

    await expect(roomsPage.page.locator('.room-listing .row')).toHaveCount(countBefore + 1);
  });

  test('should show the new room in the list after creation', async () => {
    const roomData = createRoomData({ type: 'Single', roomPrice: 100 });

    await roomsPage.createRoom(roomData);

    await expect(
      roomsPage.page.locator(`.room-listing .row:has-text("${roomData.roomName}")`)
    ).toBeVisible();
  });

  test('should display room details after creation', async () => {
    const roomData = createRoomData({ type: 'Suite', roomPrice: 300, accessible: true });

    await roomsPage.createRoom(roomData);

    const roomRow = roomsPage.page.locator(`.room-listing .row:has-text("${roomData.roomName}")`);
    await expect(roomRow).toContainText('Suite');
    await expect(roomRow).toContainText('300');
  });
});
