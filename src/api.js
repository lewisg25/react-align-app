const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const AUTH_STORAGE_KEY = "alignAuth";

export function getStoredAuth() {
  const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!savedAuth) return null;

  try {
    return JSON.parse(savedAuth);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function getAuthToken() {
  return getStoredAuth()?.token || "";
}

export function saveAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && data.message
        ? data.message
        : typeof data === "object" && data !== null && data.error
        ? data.error
        : "An error occurred. Please try again later.";

    throw new Error(message);
  }

  return data;
}

export async function getServerStatus() {
  try {
    return await apiRequest("/health");
  } catch {
    return apiRequest("/");
  }
}

export function loginUser({ email, password }) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function registerAccount(account) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(account),
  });
}

export function loginWithGoogle({ credential, yearsTogether, relationshipTier }) {
  return apiRequest("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential, yearsTogether, relationshipTier }),
  });
}

export function getCurrentUser() {
  return apiRequest("/auth/me");
}

export function getDashboard() {
  return apiRequest("/dashboard");
}

export function getCheckInQuestions() {
  return apiRequest("/check-ins/questions");
}

export function getCheckInResponses() {
  return apiRequest("/check-ins/responses");
}

export function saveCheckInResponse(response) {
  return apiRequest("/check-ins/response", {
    method: "POST",
    body: JSON.stringify(response),
  });
}

export function updateCheckInResponse(responseId, response) {
  const path = responseId
    ? `/check-ins/response/${encodeURIComponent(responseId)}`
    : "/check-ins/response";

  return apiRequest(path, {
    method: "PUT",
    body: JSON.stringify(response),
  });
}

export function deleteCheckInResponse(responseId, response = {}) {
  const path = responseId
    ? `/check-ins/response/${encodeURIComponent(responseId)}`
    : "/check-ins/response";

  return apiRequest(path, {
    method: "DELETE",
    body: JSON.stringify(response),
  });
}

export function getWeeklySummary(weekIdentifier) {
  return apiRequest(`/check-ins/summary/${encodeURIComponent(weekIdentifier)}`);
}

export function verifyEmail(token) {
  return apiRequest(`/auth/verify-email?token=${encodeURIComponent(token)}`);
}
