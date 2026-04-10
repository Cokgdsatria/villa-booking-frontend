export const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
};

export const getServerBaseUrl = () => {
  return getApiBaseUrl().replace(/\/api\/v1\/?$/, "");
};

export const resolveAssetUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${getServerBaseUrl()}${normalizedPath}`;
};
