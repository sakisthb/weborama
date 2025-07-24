import { authService } from '@/lib/auth';

export interface WooCommerceStore {
  id: string;
  name: string;
  siteUrl: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreData {
  name: string;
  siteUrl: string;
  consumerKey: string;
  consumerSecret: string;
  isDefault?: boolean;
}

export interface UpdateStoreData {
  name?: string;
  siteUrl?: string;
  consumerKey?: string;
  consumerSecret?: string;
  isActive?: boolean;
  isDefault?: boolean;
}

export class WooCommerceStoresService {
  static async getStores(): Promise<WooCommerceStore[]> {
    const token = authService.getToken();
    if (!token) throw new Error('No authentication token');
    
    const response = await fetch('/api/v1/woocommerce-stores', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stores: ${response.statusText}`);
    }
    
    return await response.json();
  }

  static async getStore(storeId: string): Promise<WooCommerceStore> {
    const token = authService.getToken();
    if (!token) throw new Error('No authentication token');
    
    const response = await fetch(`/api/v1/woocommerce-stores/${storeId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch store: ${response.statusText}`);
    }
    
    return await response.json();
  }

  static async createStore(storeData: CreateStoreData): Promise<{ success: boolean; storeId: string; message: string }> {
    const token = authService.getToken();
    if (!token) throw new Error('No authentication token');
    
    const response = await fetch('/api/v1/woocommerce-stores', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(storeData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to create store: ${response.statusText}`);
    }
    
    return await response.json();
  }

  static async updateStore(storeId: string, updateData: UpdateStoreData): Promise<{ success: boolean; message: string }> {
    const token = authService.getToken();
    if (!token) throw new Error('No authentication token');
    
    const response = await fetch(`/api/v1/woocommerce-stores/${storeId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update store: ${response.statusText}`);
    }
    
    return await response.json();
  }

  static async deleteStore(storeId: string): Promise<{ success: boolean; message: string }> {
    const token = authService.getToken();
    if (!token) throw new Error('No authentication token');
    
    const response = await fetch(`/api/v1/woocommerce-stores/${storeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete store: ${response.statusText}`);
    }
    
    return await response.json();
  }

  static async getStoreCredentials(storeId: string): Promise<{ siteUrl: string; consumerKey: string; consumerSecret: string }> {
    const token = authService.getToken();
    if (!token) throw new Error('No authentication token');
    
    const response = await fetch(`/api/v1/woocommerce-stores/${storeId}/credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch store credentials: ${response.statusText}`);
    }
    
    return await response.json();
  }

  static async getDefaultStore(): Promise<WooCommerceStore | null> {
    try {
      const stores = await this.getStores();
      return stores.find(store => store.isDefault) || null;
    } catch (error) {
      console.error('Failed to get default store:', error);
      return null;
    }
  }
} 