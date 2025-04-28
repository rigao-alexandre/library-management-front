export const fetcher = (url: string | URL, options?: RequestInit) => {
  const { headers, ...restInitOptions } = options ?? {};

  return fetch(url, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...restInitOptions,
  });
};
