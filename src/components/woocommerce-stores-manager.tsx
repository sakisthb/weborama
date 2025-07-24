import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Settings, 
  Trash2, 
  Store, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  ExternalLink
} from "lucide-react";
import { WooCommerceStoresService, WooCommerceStore, CreateStoreData } from '@/services/woocommerceStoresService';
import { toast } from 'sonner';

interface WooCommerceStoresManagerProps {
  onStoreChange?: (storeId: string | null) => void;
}

export function WooCommerceStoresManager({ onStoreChange }: WooCommerceStoresManagerProps) {
  const [stores, setStores] = useState<WooCommerceStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedStore, setSelectedStore] = useState<WooCommerceStore | null>(null);
  const [formData, setFormData] = useState<CreateStoreData>({
    name: '',
    siteUrl: '',
    consumerKey: '',
    consumerSecret: '',
    isDefault: false
  });
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      const storesData = await WooCommerceStoresService.getStores();
      setStores(storesData);
      
      // Initialize credentials visibility
      const visibilityState: Record<string, boolean> = {};
      storesData.forEach(store => {
        visibilityState[store.id] = false; // Hide credentials by default
      });
      setShowCredentials(visibilityState);
    } catch (error) {
      console.error('Failed to load stores:', error);
      toast.error('Failed to load WooCommerce stores');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStore = async () => {
    try {
      if (!formData.name || !formData.siteUrl || !formData.consumerKey || !formData.consumerSecret) {
        toast.error('Please fill in all required fields');
        return;
      }

      const result = await WooCommerceStoresService.createStore(formData);
      toast.success(result.message);
      setShowAddDialog(false);
      setFormData({ name: '', siteUrl: '', consumerKey: '', consumerSecret: '', isDefault: false });
      await loadStores();
    } catch (error) {
      console.error('Failed to create store:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create store');
    }
  };

  const handleUpdateStore = async () => {
    if (!selectedStore) return;
    
    try {
      const result = await WooCommerceStoresService.updateStore(selectedStore.id, formData);
      toast.success(result.message);
      setShowEditDialog(false);
      setSelectedStore(null);
      setFormData({ name: '', siteUrl: '', consumerKey: '', consumerSecret: '', isDefault: false });
      await loadStores();
    } catch (error) {
      console.error('Failed to update store:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update store');
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    if (!confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await WooCommerceStoresService.deleteStore(storeId);
      toast.success(result.message);
      await loadStores();
    } catch (error) {
      console.error('Failed to delete store:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete store');
    }
  };

  const handleEditStore = (store: WooCommerceStore) => {
    setSelectedStore(store);
    setFormData({
      name: store.name,
      siteUrl: store.siteUrl,
      consumerKey: '',
      consumerSecret: '',
      isDefault: store.isDefault
    });
    setShowEditDialog(true);
  };

  const toggleCredentialsVisibility = (storeId: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [storeId]: !prev[storeId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getStatusBadge = (store: WooCommerceStore) => {
    if (!store.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (store.isDefault) {
      return <Badge variant="default">Default</Badge>;
    }
    return <Badge variant="outline">Active</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>WooCommerce Stores</CardTitle>
          <CardDescription>Loading stores...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">WooCommerce Stores</h2>
          <p className="text-muted-foreground">
            Manage your WooCommerce store connections
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Store
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add WooCommerce Store</DialogTitle>
              <DialogDescription>
                Connect a new WooCommerce store to your account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Store Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Online Store"
                />
              </div>
              <div>
                <Label htmlFor="siteUrl">Site URL *</Label>
                <Input
                  id="siteUrl"
                  value={formData.siteUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, siteUrl: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="consumerKey">Consumer Key *</Label>
                <Input
                  id="consumerKey"
                  type="password"
                  value={formData.consumerKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, consumerKey: e.target.value }))}
                  placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
              </div>
              <div>
                <Label htmlFor="consumerSecret">Consumer Secret *</Label>
                <Input
                  id="consumerSecret"
                  type="password"
                  value={formData.consumerSecret}
                  onChange={(e) => setFormData(prev => ({ ...prev, consumerSecret: e.target.value }))}
                  placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked }))}
                />
                <Label htmlFor="isDefault">Set as default store</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStore}>
                Add Store
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stores List */}
      {stores.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Store className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No stores connected</h3>
            <p className="text-muted-foreground text-center mb-4">
              Connect your first WooCommerce store to start syncing data
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Store
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {stores.map((store) => (
            <Card key={store.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Store className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">{store.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <ExternalLink className="w-3 h-3" />
                        <span>{store.siteUrl}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(store)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStore(store)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteStore(store.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <div className="flex items-center space-x-2">
                      {store.isActive ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {store.isActive ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Created</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(store.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Credentials</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCredentialsVisibility(store.id)}
                    >
                      {showCredentials[store.id] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  {showCredentials[store.id] && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Consumer Key:</span>
                            <div className="flex items-center space-x-1">
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                ck_••••••••••••••••••••••••••••••••••••••••
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard('Consumer key copied')}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Consumer Secret:</span>
                            <div className="flex items-center space-x-1">
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                cs_••••••••••••••••••••••••••••••••••••••••
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard('Consumer secret copied')}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit WooCommerce Store</DialogTitle>
            <DialogDescription>
              Update your store settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Store Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-siteUrl">Site URL</Label>
              <Input
                id="edit-siteUrl"
                value={formData.siteUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, siteUrl: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-consumerKey">Consumer Key (leave blank to keep current)</Label>
              <Input
                id="edit-consumerKey"
                type="password"
                value={formData.consumerKey}
                onChange={(e) => setFormData(prev => ({ ...prev, consumerKey: e.target.value }))}
                placeholder="Leave blank to keep current"
              />
            </div>
            <div>
              <Label htmlFor="edit-consumerSecret">Consumer Secret (leave blank to keep current)</Label>
              <Input
                id="edit-consumerSecret"
                type="password"
                value={formData.consumerSecret}
                onChange={(e) => setFormData(prev => ({ ...prev, consumerSecret: e.target.value }))}
                placeholder="Leave blank to keep current"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked }))}
              />
              <Label htmlFor="edit-isDefault">Set as default store</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStore}>
              Update Store
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 