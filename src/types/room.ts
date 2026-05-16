export type RoomType = 'Single' | 'Double' | 'Twin' | 'Family' | 'Suite';

export interface RoomInput {
  roomNumber: number;
  type: RoomType;
  accessible: boolean;
  price: number;
  description?: string;
  features?: RoomFeature[];
}

export interface Room extends RoomInput {
  roomid: number;
  image?: string;
}

export type RoomFeature = 'WiFi' | 'TV' | 'Radio' | 'Refreshments' | 'Safe' | 'Views';
