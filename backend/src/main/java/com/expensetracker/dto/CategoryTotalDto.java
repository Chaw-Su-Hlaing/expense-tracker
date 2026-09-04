package com.expensetracker.dto;

import com.expensetracker.entity.Category;

import java.math.BigDecimal;

public record CategoryTotalDto(
        Category category,
        BigDecimal total,
        double percentage
) {
}
