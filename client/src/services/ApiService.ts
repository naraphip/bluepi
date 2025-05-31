'use strict';

class ApiService {
    private baseUrl: string;
    private API_KEY = process.env.API_KEY || 'naraphipdev_request_key';

    constructor() {
        this.baseUrl = this.getBaseUrl();
        this.getAuthToken();
    }

    private getBaseUrl(): string {
        // ตรวจสอบว่าอยู่ใน client-side หรือ server-side
        if (typeof window !== 'undefined') {
            // Client-side: ใช้ window.location.origin
            return `${window.location.origin}/api`;
        } else {
            // Server-side: สร้าง absolute URL
            if (process.env.NEXT_PUBLIC_API_URL) {
                return process.env.NEXT_PUBLIC_API_URL;
            }
            
            const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
            const host = process.env.VERCEL_URL || 
                        process.env.NEXT_PUBLIC_VERCEL_URL || 
                        'localhost:8080';
            return `${protocol}://${host}/api`;
        }
    }

    async getAuthToken(): Promise<string | null> {
        let token: string | null = null;

        // Check if running in the client-side and `localStorage` is available
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token');
        }

        if (token && token !== 'undefined') {
            try {
                // call validate token endpoint to check if the token is valid
                const isValid = await this.validateToken(token);
                if (isValid) {
                    return token; // Return the valid token
                }
                console.warn('Token is invalid or expired, fetching a new one');
            } catch (err) {
                console.error('Invalid token format', err);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                }
            }
        }

        try {
            // Fetch a new token from the server
            const url = `${this.baseUrl}/auth/token?request_key=${this.API_KEY}`;
            console.log('Fetching token from:', url); // Debug log
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching token: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.token) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', data.token);
                }
                return data.token;
            } else {
                console.error('No token returned from server');
                return null;
            }
        } catch (error) {
            console.error('Error in getAuthToken:', error);
            return null;
        }
    }

    async validateToken(token: string): Promise<boolean> {
        try {
            const url = `${this.baseUrl}/auth/validate`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error validating token: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error('Error validating token:', error);
            return false;
        }
    }

    // POST action
    async post<T>(url: string, data: T): Promise<T> {
        const token = await this.getAuthToken();
        if (!token) {
            throw new Error('Unable to get authentication token');
        }

        const fullUrl = `${this.baseUrl}/${url}`;
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return response.json();
    }

    // GET action
    async get<T>(url: string): Promise<T> {
        const token = await this.getAuthToken();
        if (!token) {
            throw new Error('Unable to get authentication token');
        }

        const fullUrl = `${this.baseUrl}/${url}`;
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return response.json();
    }

    // DELETE action
    async delete<T>(url: string): Promise<T> {
        const token = await this.getAuthToken();
        if (!token) {
            throw new Error('Unable to get authentication token');
        }

        const fullUrl = `${this.baseUrl}/${url}`;
        const response = await fetch(fullUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return response.json();
    }
}

export default ApiService;