package com.expensetracker.repository;

import com.expensetracker.entity.Category;

import java.math.BigDecimal;

/** Interface-based projection for GROUP BY category aggregate queries. */
public interface CategoryTotalProjection {
    Category getCategory();
    BigDecimal getTotal();
}
