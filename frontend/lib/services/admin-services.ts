// utils/api.js or directly inside your component
export async function fetchOneUser(userId : string) {
    try {
        const res = await fetch(`/api/v1/admin/users/${userId}`, {
            credentials : 'include',
        });
        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}
// utils/api.js
export async function fetchAllUsers(verified = false) {
    try {
        const response = await fetch(`/api/v1/admin/users?verified=${verified}`, {
            credentials : 'include',
        });

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const users = await response.json();
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

// utils/api.js
export async function revokeUser(userId : string) {
    try {
        const response = await fetch(`/api/v1/admin/users/${userId}/revoke`, {
            method: 'POST',
            credentials : 'include',
        });

        if (!response.ok) {
            throw new Error(`Failed to revoke user with ID ${userId}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error revoking user:", error);
        return null;
    }
}


// utils/api.js
export async function enrollUser(userId : string) {
    try {
        const response = await fetch(`/api/v1/admin/users/${userId}/enroll`, {
            method: 'POST',
            credentials : 'include',
        });

        if (!response.ok) {
            throw new Error(`Failed to enroll user with ID ${userId}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error enrolling user:", error);
        return null;
    }
}
