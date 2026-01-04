import apiClientInstance, { type CommunicationEventPayload } from '@/lib/api-client';

export const communicationApi = {
  create: async (payload: CommunicationEventPayload) => {
    return apiClientInstance.communication.create(payload);
  },
};
