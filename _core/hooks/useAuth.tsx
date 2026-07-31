import { trpc } from "../../trpc";

export function useAuth() {
  const utils = trpc.useUtils();
  const { data: user, isLoading: loading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false
  });
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      window.location.href = "/";
    }
  });

  return {
    user,
    loading,
    logout: () => logoutMutation.mutate()
  };
}
