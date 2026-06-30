export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getAdminToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || '';
};

import supabase from './supabase';
export { supabase };

export const currencySymbol = (currency: string) => {
  return currency === 'INR' ? '₹' : '$';
};

export const adminFetch = async (url: string, options: RequestInit = {}) => {
  const token = await getAdminToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
};

export const uploadFile = async (file: File): Promise<string> => {
  const token = await getAdminToken();
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileName: file.name, fileBase64: base64, contentType: file.type }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        resolve(data.url);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsDataURL(file);
  });
};
