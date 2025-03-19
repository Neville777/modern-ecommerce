// lib/fetch-api.ts
'use server';

export async function fetchApi(url: string, config: RequestInit = {}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...config,
  });

  return response;
}
