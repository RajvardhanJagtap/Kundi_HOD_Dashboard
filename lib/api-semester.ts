import axios from "axios";

// Use the API_URL from the main api.ts file which points to /api/proxy
const API_BASE_URL = "/api/proxy";

// Create axios instance with proper configuration
const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: false,
});

// Add request interceptor to include auth token
apiInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("API: Sending token with request");
    } else {
      console.log("API: No token found in localStorage");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fetch academic years - matches the real API response structure
export const fetchAcademicYears = async () => {
  try {
    console.log('API: Calling fetchAcademicYears')
    console.log('API: Full URL:', `${API_BASE_URL}/academics/academic-years`)
    
    const response = await apiInstance.get("/academics/academic-years")
    console.log('API: Response status:', response.status)
    console.log('API: Response data:', response.data)
    
    // Return the response in the format expected by the frontend
    // The real API returns: { success, message, data: { content: [...] } }
    return response.data;
  } catch (error) {
    console.error('API: Error in fetchAcademicYears:', error)
    if (axios.isAxiosError(error)) {
      console.error('API: Axios error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
    }
    throw error;
  }
};

// Fetch all semesters (the real API doesn't have the academic-year filter endpoint)
export const fetchAcademicSemesters = async (academicYearId?: string) => {
  try {
    console.log('API: Calling fetchAcademicSemesters')
    if (academicYearId) {
      console.log('API: Note - academicYearId provided but real API doesn\'t support filtering by year:', academicYearId)
    }
    
    const url = "/academics/semesters"
    console.log('API: Full URL:', `${API_BASE_URL}${url}`)
    
    const response = await apiInstance.get(url)
    console.log('API: Response status:', response.status)
    console.log('API: Response data:', response.data)
    
    // Return the response in the format expected by the frontend
    // The real API returns: { success, message, data: { content: [...] } }
    return response.data;
  } catch (error) {
    console.error('API: Error in fetchAcademicSemesters:', error)
    if (axios.isAxiosError(error)) {
      console.error('API: Axios error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
    }
    throw error;
  }
};
