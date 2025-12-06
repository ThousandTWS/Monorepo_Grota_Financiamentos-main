export type PagedResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export function toPagedResponse<T>(payload: unknown): PagedResponse<T> {
  if (
    payload &&
    typeof payload === "object" &&
    "content" in payload &&
    Array.isArray((payload as { content: unknown[] }).content)
  ) {
    const page = payload as Partial<PagedResponse<T>>;
    const safeContent = Array.isArray(page.content) ? (page.content as T[]) : [];

    return {
      content: safeContent,
      totalElements: Number(page.totalElements ?? safeContent.length),
      totalPages: Number(page.totalPages ?? 1),
      page: Number(page.page ?? 0),
      size: Number(page.size ?? safeContent.length),
      hasNext: Boolean(page.hasNext ?? false),
      hasPrevious: Boolean(page.hasPrevious ?? false),
    };
  }

  const items = Array.isArray(payload) ? (payload as T[]) : [];
  return {
    content: items,
    totalElements: items.length,
    totalPages: 1,
    page: 0,
    size: items.length,
    hasNext: false,
    hasPrevious: false,
  };
}
