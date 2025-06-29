
/**
 * Contract-Aligned Authentication Hook
 * 
 * Uses contract-compliant auth service
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/api/contract/auth.service';
import { useToast } from '@/hooks/use-toast';
import type { LoginRequest, LoginResponse } from '@/api/api-contract';

export const useContractLogin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      credentials, 
      isAdminLogin = false 
    }: { 
      credentials: LoginRequest; 
      isAdminLogin?: boolean;
    }): Promise<LoginResponse> => {
      if (isAdminLogin) {
        return authService.adminLogin(credentials);
      } else {
        return authService.login(credentials);
      }
    },
    onSuccess: (data) => {
      // Store auth data
      localStorage.setItem('fuelsync_token', data.token);
      localStorage.setItem('fuelsync_user', JSON.stringify(data.user));
      
      // Invalidate all queries to refetch with new context
      queryClient.invalidateQueries();
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name}!`,
      });
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });
};

export const useContractLogout = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear local storage
      localStorage.removeItem('fuelsync_token');
      localStorage.removeItem('fuelsync_user');
      
      // Clear all cached data
      queryClient.clear();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    },
  });
};
