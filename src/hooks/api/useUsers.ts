/**
 * @file useUsers.ts
 * @description React Query hooks for users API
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/OWNER.md - Owner journey for user management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService, User, CreateUserRequest, UpdateUserRequest, ChangePasswordRequest, ResetPasswordRequest } from '@/api/services/usersService';
import { useErrorHandler } from '../useErrorHandler';

/**
 * Hook to fetch all users for the current tenant
 * @returns Query result with users data
 */
export const useUsers = () => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getUsers(),
    staleTime: 60000, // 1 minute
    onError: (error) => {
      handleError(error, 'Failed to fetch users.');
    },
  });
};

/**
 * Hook to fetch a user by ID
 * @param userId User ID
 * @returns Query result with user data
 */
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersService.getUser(userId),
    enabled: !!userId,
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook to create a user
 * @returns Mutation result for creating a user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      handleError(error, 'Failed to create user.');
    },
  });
};

/**
 * Hook to update a user
 * @returns Mutation result for updating a user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequest }) => 
      usersService.updateUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
    },
    onError: (error) => {
      handleError(error, 'Failed to update user.');
    },
  });
};

/**
 * Hook to delete a user
 * @returns Mutation result for deleting a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (userId: string) => usersService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      handleError(error, 'Failed to delete user.');
    },
  });
};

/**
 * Hook to change user password
 * @returns Mutation result for changing password
 */
export const useChangePassword = () => {
  const { handleError } = useErrorHandler();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: ChangePasswordRequest }) => 
      usersService.changePassword(userId, data),
    onError: (error) => {
      handleError(error, 'Failed to change password.');
    },
  });
};

/**
 * Hook to reset user password
 * @returns Mutation result for resetting password
 */
export const useResetPassword = () => {
  const { handleError } = useErrorHandler();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: ResetPasswordRequest }) => 
      usersService.resetPassword(userId, data),
    onError: (error) => {
      handleError(error, 'Failed to reset password.');
    },
  });
};