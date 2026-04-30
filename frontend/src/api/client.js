const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function apiRequest(path, options = {}, token = null) {
    const response = await fetch(`${API_URL}${path}`, {
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
