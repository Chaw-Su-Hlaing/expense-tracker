package com.expensetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

public record SummaryResponse(
        LocalDate date,
        BigDecimal todayTotal,
        YearMonth month,
        BigDecimal monthTotal,
        List<CategoryTotalDto> categoryBreakdown
) {
}
