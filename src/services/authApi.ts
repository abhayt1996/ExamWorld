/**
 * Authentication and Student Management API Service for Exam WORLD
 * Connects the React/TypeScript frontend to the FastAPI / unified backend.
 * Endpoints:
 * - GET  /api/admin/students
 * - POST /api/admin/students
 * - PUT  /api/admin/students/{id}
 * - DELETE /api/admin/students/{id}
 * - POST /api/auth/login
 */

// If VITE_API_URL is configured (e.g. http://127.0.0.1:8000), requests will target that base;
// otherwise empty string targets the current host / proxy.
export const API_BASE_URL =
  import.meta.env?.VITE_API_URL !== undefined && import.meta.env?.VITE_API_URL !== ''
    ? import.meta.env.VITE_API_URL
    : '';

export interface UserResponse {
  id: string;
  name: string;
  username: string;
  role: 'student' | 'admin';
  current_class?: string;
  currentClass?: string;
  created_at?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserResponse;
  isBackendConnected?: boolean;
}

export interface StudentData {
  id: string;
  name: string;
  username: string;
  mobile?: string;
  role: 'student';
  current_class: string;
  created_at?: string;
  tests_count?: number;
  average_score?: number;
}

export interface StudentCreatePayload {
  name: string;
  username: string;
  mobile?: string;
  current_class: string;
  password: string;
}

export interface StudentUpdatePayload {
  name?: string;
  username?: string;
  mobile?: string;
  current_class?: string;
  password?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * 1. Authenticates student by username and password
 * Endpoint: POST /api/auth/login
 */
export async function loginStudent(
  username: string,
  password: string
): Promise<LoginResponse> {
  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: cleanUsername,
        password: cleanPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Invalid username or password');
    }

    const user: UserResponse = {
      ...data.user,
      currentClass: data.user.current_class || data.user.currentClass || '10',
    };

    return {
      success: true,
      message: data.message || 'Authentication successful',
      token: data.token || `ew_token_${Date.now()}`,
      user,
      isBackendConnected: true,
    };
  } catch (error: any) {
    if (
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      error.name === 'TypeError'
    ) {
      console.warn(
        `[Exam WORLD Auth] Server at ${API_BASE_URL || 'localhost'} is offline or unreachable. Testing against fallback demo account.`
      );
      if (
        (cleanUsername === 'student1' || cleanUsername === 'abhay10') &&
        (cleanPassword === 'password123' || cleanPassword === '123456')
      ) {
        return {
          success: true,
          message: 'Authenticated in offline demo mode',
          token: `ew_sec_student_demo_${Date.now()}`,
          user: {
            id: 'usr-student-offline',
            name: 'Abhay Sharma',
            username: cleanUsername,
            role: 'student',
            currentClass: '10',
            current_class: '10',
          },
          isBackendConnected: false,
        };
      }
      throw new Error('Could not connect to authentication server. Please check your backend connection.');
    }

    throw error;
  }
}

/**
 * 2. Fetches all registered students for Admin Dashboard
 * Endpoint: GET /api/admin/students
 */
export async function getStudents(): Promise<StudentData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/students`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch students list');
    }

    return await response.json();
  } catch (error: any) {
    console.warn('[Exam WORLD] Error fetching students from backend:', error.message);
    throw error;
  }
}

// Backward-compatible alias
export const getAllStudents = getStudents;

/**
 * 3. Creates a new student in the database (Admin only)
 * Endpoint: POST /api/admin/students
 */
export async function createStudent(
  payload: StudentCreatePayload
): Promise<ApiResponse<StudentData>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to create new student');
    }

    return data;
  } catch (error: any) {
    console.error('[Exam WORLD] Error creating student:', error);
    throw error;
  }
}

/**
 * 4. Updates student details or resets password (Admin only)
 * Endpoint: PUT /api/admin/students/{id}
 */
export async function updateStudent(
  userId: string,
  payload: StudentUpdatePayload
): Promise<ApiResponse<StudentData>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/students/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to update student record');
    }

    return data;
  } catch (error: any) {
    console.error('[Exam WORLD] Error updating student:', error);
    throw error;
  }
}

/**
 * 5. Deletes student record permanently from database (Admin only)
 * Endpoint: DELETE /api/admin/students/{id}
 */
export async function deleteStudent(userId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/students/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to delete student');
    }

    return data;
  } catch (error: any) {
    console.error('[Exam WORLD] Error deleting student:', error);
    throw error;
  }
}

// Re-export curriculum & analytics API methods
export * from './curriculumApi';