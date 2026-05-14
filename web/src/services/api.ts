import axios, { type AxiosInstance } from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api: AxiosInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: false,
});

const TOKEN_KEY = 'shopai.token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string | null) => {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
};

api.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) setToken(null);
    return Promise.reject(err);
  },
);

// Unwrap standard {success,data} envelope
export async function unwrap<T>(p: Promise<{ data: { data: T } }>): Promise<T> {
  const res = await p;
  return res.data.data;
}
