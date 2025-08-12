export interface Log {
  angle: number;
  shoulder_y_diff: number;
  shoulder_y_avg: number;
  logged_at: Date;
}

export interface Logs {
  logs: Log[];
}