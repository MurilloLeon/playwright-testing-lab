export type RoomType = 'Single' | 'Double' | 'Twin' | 'Family' | 'Suite';

export type RoomFeature = 'WiFi' | 'TV' | 'Radio' | 'Refreshments' | 'Safe' | 'Views';

export interface RoomInput {
  roomName: string;
  type: RoomType;
  accessible: boolean;
  roomPrice: number;
  description?: string;
  features?: RoomFeature[];
  image?: string;
}

export interface Room extends RoomInput {
  roomid: number;
}
