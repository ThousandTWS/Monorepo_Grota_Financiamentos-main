package org.example.server.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public final class PaginationUtils {

    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 10;
    private static final int MAX_SIZE = 50;

    private PaginationUtils() {
    }

    public static Pageable buildPageRequest(int page, int size, Sort sort) {
        int sanitizedPage = Math.max(page, DEFAULT_PAGE);
        int sanitizedSize = size <= 0 ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);
        Sort safeSort = sort != null ? sort : Sort.unsorted();
        return PageRequest.of(sanitizedPage, sanitizedSize, safeSort);
    }
}
