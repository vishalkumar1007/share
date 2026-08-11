/** Production Multiverse API (Vercel). */
export const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "https://share-backend-jade.vercel.app"
).replace(/\/$/, "");

export const FRONTEND_ORIGIN =
  typeof window !== "undefined"
    ? `${window.location.origin}${import.meta.env.BASE_URL || "/"}`.replace(
        /\/$/,
        ""
      )
    : "";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { authorization: `Bearer ${token}` } : {};
};

const chatAuthHeaders = () => {
  const userToken = localStorage.getItem("authToken");
  if (userToken) return { authorization: `Bearer ${userToken}` };
  const guest =
    localStorage.getItem("mv_chat_guest_token") ||
    sessionStorage.getItem("chatGuestToken");
  return guest ? { authorization: `Bearer ${guest}` } : {};
};

const adminHeaders = () => {
  const token = sessionStorage.getItem("adminToken");
  return token ? { authorization: `Bearer ${token}` } : {};
};

const parseJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await parseJson(res);
  return { ok: res.ok, status: res.status, data };
};

const adminRequest = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await parseJson(res);
  return { ok: res.ok, status: res.status, data };
};

export const api = {
  signup: (body) =>
    request("/api/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  verify: () => request("/api/auth/verify"),
  me: () => request("/api/auth/me"),

  createShare: (body) =>
    request("/api/shares", { method: "POST", body: JSON.stringify(body) }),
  getShare: (shareId) => request(`/api/shares/${encodeURIComponent(shareId)}`),
  getShareStatus: (shareId) =>
    request(`/api/shares/${encodeURIComponent(shareId)}/status`),
  deleteShare: (shareId) =>
    request(`/api/shares/${encodeURIComponent(shareId)}`, { method: "DELETE" }),
  listMyShares: (page = 1, limit = 50) =>
    request(`/api/shares/me?page=${page}&limit=${limit}`),

  uploadDirect: (body) =>
    request("/api/uploads/direct", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  uploadLocal: async (file) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_BASE}/api/uploads/local`, {
      method: "POST",
      headers: { ...authHeaders() },
      body: form,
    });
    const data = await parseJson(res);
    return { ok: res.ok, status: res.status, data };
  },

  createChatSession: (body = {}) =>
    request("/api/chat/session", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  createChatRoom: (body = {}) =>
    request("/api/chat/rooms", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { ...chatAuthHeaders(), "Content-Type": "application/json" },
    }),
  getChatRoom: (code) =>
    request(`/api/chat/rooms/${encodeURIComponent(code)}`),
  joinChatRoom: (code) =>
    request(`/api/chat/rooms/${encodeURIComponent(code)}/join`, {
      method: "POST",
      body: "{}",
      headers: { ...chatAuthHeaders(), "Content-Type": "application/json" },
    }),
  listChatMessages: (code, since) => {
    const q = since ? `?since=${encodeURIComponent(since)}` : "";
    return request(`/api/chat/rooms/${encodeURIComponent(code)}/messages${q}`, {
      headers: { ...chatAuthHeaders() },
    });
  },
  sendChatMessage: (code, text) =>
    request(`/api/chat/rooms/${encodeURIComponent(code)}/messages`, {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: { ...chatAuthHeaders(), "Content-Type": "application/json" },
    }),
  leaveChatRoom: (code) =>
    request(`/api/chat/rooms/${encodeURIComponent(code)}/leave`, {
      method: "POST",
      body: "{}",
      headers: { ...chatAuthHeaders(), "Content-Type": "application/json" },
    }),
  endChatRoom: (code) =>
    request(`/api/chat/rooms/${encodeURIComponent(code)}`, {
      method: "DELETE",
      headers: { ...chatAuthHeaders(), "Content-Type": "application/json" },
    }),
  inviteChat: (body) =>
    request("/api/chat/invite", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { ...chatAuthHeaders(), "Content-Type": "application/json" },
    }),

  adminLogin: (body) =>
    adminRequest("/api/admin/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }),
  getMailSettings: () => adminRequest("/api/admin/mail-settings"),
  updateMailSettings: (body) =>
    adminRequest("/api/admin/mail-settings", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  testMailSettings: (body = {}) =>
    adminRequest("/api/admin/mail-settings/test", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const EXT_MIME = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  pdf: "application/pdf",
  zip: "application/zip",
  json: "application/json",
  txt: "text/plain",
  csv: "text/csv",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  wav: "audio/wav",
  webm: "audio/webm",
  ogg: "audio/ogg",
  aac: "audio/aac",
  flac: "audio/flac",
};

export const inferMimeFromFilename = (filename) => {
  const ext = String(filename || "")
    .split(".")
    .pop()
    ?.toLowerCase();
  return (ext && EXT_MIME[ext]) || "application/octet-stream";
};

export const resolveFileMime = (file) => {
  const raw = String(file?.type || "").trim().toLowerCase();
  if (raw && raw !== "application/octet-stream") return raw;
  return inferMimeFromFilename(file?.name);
};

/** Cross-origin-safe download: fetch → blob → object URL (falls back to open). */
export const downloadFromUrl = async (url, filename = "download") => {
  const downloadUrl = (() => {
    try {
      const u = new URL(url);
      u.searchParams.set("download", "1");
      return u.toString();
    } catch {
      return url.includes("?") ? `${url}&download=1` : `${url}?download=1`;
    }
  })();

  try {
    const res = await fetch(downloadUrl, { mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
    return true;
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
    return false;
  }
};

export const uploadFile = async (file) => {
  const mime = resolveFileMime(file);
  const fileForUpload =
    !file.type || file.type === "application/octet-stream"
      ? new File([file], file.name, { type: mime, lastModified: file.lastModified })
      : file;

  const local = await api.uploadLocal(fileForUpload);
  if (local.ok && local.data?.blob) {
    return local.data.blob;
  }

  const base64 = await fileToBase64(fileForUpload);
  const direct = await api.uploadDirect({
    filename: fileForUpload.name,
    contentType: mime,
    data: base64,
  });
  if (direct.ok && (direct.data?.blob || direct.data?.data?.blob)) {
    return direct.data.blob || direct.data.data.blob;
  }

  const msg =
    local.data?.msg ||
    local.data?.message ||
    direct.data?.msg ||
    direct.data?.message ||
    "Upload failed — configure storage or try a smaller file";
  throw new Error(msg);
};

export const buildReceiveUrl = (shareId, type = "text") => {
  const path = ["text", "image", "file", "audio"].includes(type) ? type : "text";
  return `${FRONTEND_ORIGIN}/${path}?mode=receive&multiversecode=${encodeURIComponent(shareId)}`;
};

export const buildChatUrl = (roomCode) =>
  `${FRONTEND_ORIGIN}/chat?room=${encodeURIComponent(roomCode)}`;

export const EXPIRY_OPTIONS = [
  { label: "1 hour", value: 60 * 60 * 1000 },
  { label: "24 hours", value: 24 * 60 * 60 * 1000 },
  { label: "7 days", value: 7 * 24 * 60 * 60 * 1000 },
];
