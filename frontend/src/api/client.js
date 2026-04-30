function normalizeApiUrl(value) {
    const fallbackUrl = 'http://localhost:5000';

    if (!value) {
        return fallbackUrl;
    }

    const trimmedValue = value.trim().replace(/\/$/, '');

    if (/^https?:\/\//i.test(trimmedValue)) {
        return trimmedValue;
    }

    return `https://${trimmedValue}`;
}

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

async function apiRequest(path, options = {}, token = null) {
    const requestUrl = new URL(path.replace(/^\/+/, '/'), `${API_URL}/`).toString();

    const response = await fetch(requestUrl, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }

    return data;
}

export { apiRequest, API_URL };
