const apiUrl = import.meta.env.VITE_API_URL || "/api";

async function parseResponse(response) {
  const body = await response.text();
  if (!body) return null;

  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
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
        : "";

    throw new Error(message || "Something went wrong. Please try again.");
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

export function getUser() {
  return apiRequest("/auth/me");
}

export function loginWithGoogle(credential, yearsTogether, coupleProfile = {}) {
  return apiRequest("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential, yearsTogether, ...coupleProfile }),
  });
}

export function startEmailLogin(email, redirect = "/dashboard", yearsTogether, coupleProfile = {}) {
  return apiRequest("/auth/email/start", {
    method: "POST",
    body: JSON.stringify({ email, redirect, yearsTogether, ...coupleProfile }),
  });
}

export function logout() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}

export function getDashboard() {
  return apiRequest("/dashboard");
}

export function getQuestions() {
  return apiRequest("/check-ins/questions");
}

export function getResponses() {
  return apiRequest("/check-ins/responses");
}

export function saveResponse(response) {
  return apiRequest("/check-ins/response", {
    method: "POST",
    body: JSON.stringify(response),
  });
}

export function updateResponse(responseId, response) {
  const path = responseId
    ? `/check-ins/response/${encodeURIComponent(responseId)}`
    : "/check-ins/response";

  return apiRequest(path, {
    method: "PUT",
    body: JSON.stringify(response),
  });
}

export function deleteResponse(responseId, response = {}) {
  const path = responseId
    ? `/check-ins/response/${encodeURIComponent(responseId)}`
    : "/check-ins/response";

  return apiRequest(path, {
    method: "DELETE",
    body: JSON.stringify(response),
  });
}

export function getSummary(weekIdentifier) {
  return apiRequest(`/check-ins/summary/${encodeURIComponent(weekIdentifier)}`);
}

export function verifyEmail(token) {
  return apiRequest("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}
