export interface IDashboard {
  from?: string;
  to?: string;
  groupBy: "day" | "month" | "year";
}

export interface DashboardStats {
  totalEvents: number;
  totalTransaction: number;
  revenue: { period: string; amount: number }[];
}
