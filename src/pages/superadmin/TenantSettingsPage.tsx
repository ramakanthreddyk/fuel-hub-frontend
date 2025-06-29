
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Search, Copy, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { tenantSettingsApi } from '@/api/tenant-settings';

interface TenantSetting {
  key: string;
  value: string;
  updatedAt: string;
}

interface GroupedSettings {
  [namespace: string]: TenantSetting[];
}

const TenantSettingsPage: React.FC = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});

  // Fetch tenant settings
  const { data: settings = [], isLoading, error } = useQuery({
    queryKey: ['tenant-settings', tenantId],
    queryFn: () => tenantSettingsApi.getTenantSettings(tenantId!),
    enabled: !!tenantId,
  });

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      tenantSettingsApi.updateTenantSetting(tenantId!, key, value),
    onSuccess: (_, { key }) => {
      toast({
        title: 'Setting Updated',
        description: `Successfully updated ${key}`,
      });
      
      // Check for export warning
      if (key === 'features.allow_export' && editingValues[key] === 'false') {
        toast({
          title: 'Warning',
          description: '⚠️ Export is disabled for this tenant',
          variant: 'destructive',
        });
      }
      
      // Clear editing state and refetch
      setEditingValues(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
      
      queryClient.invalidateQueries({ queryKey: ['tenant-settings', tenantId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update setting',
        variant: 'destructive',
      });
    },
  });

  // Group settings by namespace
  const groupedSettings: GroupedSettings = settings.reduce((acc, setting) => {
    const namespace = setting.key.includes('.') 
      ? setting.key.split('.')[0] 
      : 'general';
    
    if (!acc[namespace]) {
      acc[namespace] = [];
    }
    acc[namespace].push(setting);
    return acc;
  }, {} as GroupedSettings);

  // Filter settings based on search
  const filteredGroupedSettings = Object.entries(groupedSettings).reduce((acc, [namespace, settingsArray]) => {
    const filtered = settingsArray.filter(setting =>
      setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filtered.length > 0) {
      acc[namespace] = filtered;
    }
    return acc;
  }, {} as GroupedSettings);

  const handleValueChange = (key: string, value: string) => {
    setEditingValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (key: string) => {
    const value = editingValues[key];
    if (value !== undefined) {
      updateSettingMutation.mutate({ key, value });
    }
  };

  const handleCancel = (key: string) => {
    setEditingValues(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Value copied to clipboard',
    });
  };

  const renderValueInput = (setting: TenantSetting) => {
    const currentValue = editingValues[setting.key] ?? setting.value;
    const isEditing = setting.key in editingValues;
    const hasChanged = editingValues[setting.key] !== undefined && editingValues[setting.key] !== setting.value;

    // Boolean toggle
    if (setting.value === 'true' || setting.value === 'false') {
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={currentValue === 'true'}
            onCheckedChange={(checked) => handleValueChange(setting.key, checked ? 'true' : 'false')}
          />
          <span className="text-sm text-muted-foreground">
            {currentValue === 'true' ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      );
    }

    // Color picker for hex values
    if (/^#[0-9A-F]{6}$/i.test(setting.value)) {
      return (
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={currentValue}
            onChange={(e) => handleValueChange(setting.key, e.target.value)}
            className="w-12 h-8 rounded border cursor-pointer"
          />
          <Input
            value={currentValue}
            onChange={(e) => handleValueChange(setting.key, e.target.value)}
            className="flex-1"
            placeholder="Enter hex color"
          />
        </div>
      );
    }

    // Regular text input
    return (
      <Input
        value={currentValue}
        onChange={(e) => handleValueChange(setting.key, e.target.value)}
        className="flex-1"
        placeholder="Enter value"
      />
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Failed to load tenant settings</p>
              <Button onClick={() => navigate('/superadmin/tenants')} className="mt-4">
                Back to Tenants
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/superadmin/tenants')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Tenants</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Tenant Settings</h1>
            <p className="text-muted-foreground">Manage settings for tenant {tenantId}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Settings Groups */}
      <div className="space-y-6">
        {Object.entries(filteredGroupedSettings).map(([namespace, settingsArray]) => (
          <Card key={namespace}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="capitalize">{namespace}</span>
                <Badge variant="secondary">{settingsArray.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settingsArray.map((setting) => {
                  const isEditing = setting.key in editingValues;
                  const hasChanged = editingValues[setting.key] !== undefined && editingValues[setting.key] !== setting.value;

                  return (
                    <div key={setting.key} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                      {/* Setting Key */}
                      <div className="font-medium">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {setting.key}
                        </code>
                      </div>

                      {/* Value Input */}
                      <div className="md:col-span-2">
                        {renderValueInput(setting)}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(setting.value)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>

                        {hasChanged && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancel(setting.key)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSave(setting.key)}
                              disabled={updateSettingMutation.isPending}
                              className="h-8"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                          </>
                        )}

                        <div className="text-xs text-muted-foreground min-w-0">
                          {new Date(setting.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(filteredGroupedSettings).length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>No settings found matching your search.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TenantSettingsPage;
