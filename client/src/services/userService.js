import { api } from './api';

const API_URL = import.meta.env.VITE_API_URL;

export const createUser = async (fullName, email, password, login) => {
    try {
        const response = await api.post(`${API_URL}/auth/register`, {
            fullName,
            email,
            password,
            login,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const createFullUser = async (fullName, email, password, login, profilePicture, isEmailConfirmed) => {
    try {
        const response = await api.post(`${API_URL}/users`, {
            fullName,
            email,
            password,
            login,
            profilePicture,
            isEmailConfirmed
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUser = async (email, password, login) => {
    try {
        const response = await api.post(`${API_URL}/auth/login`, {
            email,
            password,
            login,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserById = async userId => {
    try {
        const response = await api.get(`${API_URL}/users/${encodeURIComponent(userId)}`);
        return response.data;
    } catch (error) {
        console.error('Error when receiving user data:', error);
        throw error;
    }
};

export const requestPasswordReset = async email => {
    try {
        const response = await api.post(`${API_URL}/auth/password-reset`, { email });
        return response.data;
    } catch (error) {
        console.error('Password reset request failed:', error);
        throw error;
    }
};

export const resetPassword = async (token, newPassword) => {
    try {
        const response = await api.post(`${API_URL}/auth/password-reset/${token}`, {
            newPassword,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (userId, updatedData) => {
    try {
        const response = await api.patch(`${API_URL}/users/${encodeURIComponent(userId)}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Failed to update user:', error);
        throw error;
    }
};

export const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const response = await api.post(`${API_URL}/auth/me`, { token });
        return response.data.user;
    } catch (error) {
        if (error.response?.status === 401) {
            return null; // Token is invalid/expired, return null
        }
        throw error; // Rethrow other errors
    }
};

export const confirmEmail = async token => {
    try {
        const response = await api.get(`${API_URL}/auth/confirm-email/${token}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserProjects = async userId => {
	try {
		const response = await api.get(`${API_URL}/users/${encodeURIComponent(userId)}/projects`);
		return response.data;
	} catch (error) {
		console.error('Error fetching user projects:', error);
		throw error;
	}
};

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};
