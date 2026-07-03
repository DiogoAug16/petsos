import { apiFetch } from '@/services/api';

const unwrapData = (response) => response?.data ?? response;

export async function getAppBootstrap() {
  const response = await apiFetch('/app/bootstrap');
  const data = unwrapData(response);

  return {
    user: data?.user ?? null,
    followedSummary: {
      total: Number(data?.followedSummary?.total ?? 0),
      resolved: Number(data?.followedSummary?.resolved ?? 0),
    },
    unreadNotifications: Number(data?.unreadNotifications ?? 0),
    config: data?.config ?? {},
  };
}
