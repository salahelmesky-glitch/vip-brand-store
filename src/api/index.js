const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Products API
export const productsApi = {
    getAll: async () => {
        const res = await fetch(`${API_BASE}/products`);
        return res.json();
    },

    getByCategory: async (category) => {
        const res = await fetch(`${API_BASE}/products/category/${category}`);
        return res.json();
    },

    getById: async (id) => {
        const res = await fetch(`${API_BASE}/products/${id}`);
        return res.json();
    },

    create: async (product, token) => {
        const res = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product)
        });
        return res.json();
    },

    update: async (id, product, token) => {
        const res = await fetch(`${API_BASE}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product)
        });
        return res.json();
    },

    delete: async (id, token) => {
        const res = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return res.json();
    }
};

// Orders API
export const ordersApi = {
    getAll: async (token) => {
        const res = await fetch(`${API_BASE}/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return res.json();
    },

    create: async (orderData, screenshotFile) => {
        const formData = new FormData();
        formData.append('customerName', orderData.customerName);
        formData.append('phone', orderData.phone);
        formData.append('address', orderData.address);
        formData.append('items', JSON.stringify(orderData.items));
        formData.append('total', orderData.total);
        if (screenshotFile) {
            formData.append('screenshot', screenshotFile);
        }

        const res = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            body: formData
        });
        return res.json();
    },

    updateStatus: async (id, status, token) => {
        const res = await fetch(`${API_BASE}/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        return res.json();
    },

    delete: async (id, token) => {
        const res = await fetch(`${API_BASE}/orders/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return res.json();
    }
};

// Auth API
export const authApi = {
    login: async (username, password) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        return res.json();
    },

    verify: async (token) => {
        const res = await fetch(`${API_BASE}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return res.json();
    }
};
