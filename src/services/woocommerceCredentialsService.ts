import { authService } from '@/lib/auth';

export interface WooCredentials {
  siteUrl: string;
  consumerKey: string;
  consumerSecret: string;
}

export class WooCommerceCredentialsService {
  static async fetchCredentials(): Promise<WooCredentials | null> {
    const token = authService.getToken();
    if (!token) return null;
    const response = await fetch('/api/v1/woocommerce-credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) return null;
    return await response.json();
  }

  static async saveCredentials(creds: WooCredentials): Promise<boolean> {
    const token = authService.getToken();
    if (!token) return false;
    const response = await fetch('/api/v1/woocommerce-credentials', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creds),
    });
    return response.ok;
  }
} 