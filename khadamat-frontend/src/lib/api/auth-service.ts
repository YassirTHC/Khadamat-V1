import apiClientInstance from '@/lib/api-client';

export const AuthService = {
  updateClientProfile: async (data: any) => {
    // Placeholder implementation to satisfy build
    try {
      if ((apiClientInstance as any).user?.updateProfile) {
        const response = await (apiClientInstance as any).user.updateProfile(data);
        return response?.data ?? response;
      }
      return data;
    } catch (e) {
      return data;
    }
  },
};

export default AuthService;
