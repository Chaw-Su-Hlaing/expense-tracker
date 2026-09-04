package com.expensetracker.repository;

import com.expensetracker.entity.Category;
import com.expensetracker.entity.Expense;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public final class ExpenseSpecifications {

    private ExpenseSpecifications() {
    }

    public static Specification<Expense> hasCategory(Category category) {
        return (root, query, cb) -> category == null ? null : cb.equal(root.get("category"), category);
    }

    public static Specification<Expense> dateFrom(LocalDate start) {
        return (root, query, cb) -> start == null ? null : cb.greaterThanOrEqualTo(root.get("date"), start);
    }

    public static Specification<Expense> dateTo(LocalDate end) {
        return (root, query, cb) -> end == null ? null : cb.lessThanOrEqualTo(root.get("date"), end);
    }

    public static Specification<Expense> titleContains(String keyword) {
        return (root, query, cb) -> (keyword == null || keyword.isBlank())
                ? null
                : cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%");
    }
}
