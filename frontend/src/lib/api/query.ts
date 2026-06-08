export function toQueryString(
  params: Record<string, string | number | boolean | undefined>,
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && String(value).length > 0) {
      searchParams.set(key, String(value));
    }
  }

  const result = searchParams.toString();
  return result.length > 0 ? `?${result}` : '';
}
