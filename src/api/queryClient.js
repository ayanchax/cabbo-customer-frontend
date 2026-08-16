import { QueryClient } from "@tanstack/react-query";

// Shared React Query client used by the app provider and non-React modules
// such as API interceptors/logout helpers that cannot call useQueryClient() hook.
const queryClient = new QueryClient();

export { queryClient };
