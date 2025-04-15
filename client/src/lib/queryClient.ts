import { QueryClient } from "@tanstack/react-query";

export async function apiRequest(
  method: string,
  url: string,
  body?: any
): Promise<Response> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(url, options);
}

// Default fetcher for react-query
type FetcherOptions = {
  on401?: "throw" | "returnNull";
};

export function getQueryFn(options: FetcherOptions = {}) {
  return async ({ queryKey }: { queryKey: string[] }) => {
    try {
      const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
      const response = await fetch(url, {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401 && options.on401 === "returnNull") {
          return undefined;
        }
        throw new Error(`API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  };
}

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      queryFn: getQueryFn(),
    },
  },
});