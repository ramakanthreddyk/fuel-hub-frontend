import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import type { CreateUserRequest, UpdateUserRequest, ChangePasswordRequest, ResetPasswordRequest, CreateSuperAdminRequest } from '../api/users';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getUser(userId),
    enabled: !!userId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequest }) => usersApi.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: ChangePasswordRequest }) => usersApi.changePassword(userId, data),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: ResetPasswordRequest }) => usersApi.resetPassword(userId, data),
  });
};

export const useSuperAdminUsers = () => {
  return useQuery({
    queryKey: ['superadmin-users'],
    queryFn: usersApi.getSuperAdminUsers,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSuperAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSuperAdminRequest) => usersApi.createSuperAdminUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin-users'] });
    },
  });
};
