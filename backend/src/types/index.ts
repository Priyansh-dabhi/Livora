export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  timestamp: string;
}

export interface HealthCheckData {
  status: 'UP' | 'DOWN';
  uptime: number;
  timestamp: string;
  environment: string;
  version: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string | null;
        phone?: string | null;
        address?: string | null;
        businessName?: string | null;
      };
    }
  }
}

