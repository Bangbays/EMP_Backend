export interface IPoint {
  id: string;
  points: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface IPointResult {
  balance: number;
  history: IPoint[];
}
