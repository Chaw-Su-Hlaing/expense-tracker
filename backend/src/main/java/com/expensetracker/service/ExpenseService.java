package com.expensetracker.service;

import com.expensetracker.dto.CategoryTotalDto;
import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.dto.SummaryResponse;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.Expense;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.CategoryTotalProjection;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.ExpenseSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    @Transactional
    public ExpenseResponse create(ExpenseRequest request) {
        Expense expense = Expense.builder()
                .title(request.title())
                .amount(request.amount())
                .category(request.category())
                .date(request.date())
                .notes(request.notes())
                .build();
        return ExpenseResponse.from(expenseRepository.save(expense));
    }

    public Page<ExpenseResponse> list(LocalDate startDate, LocalDate endDate, Category category, Pageable pageable) {
        Specification<Expense> spec = Specification
                .where(ExpenseSpecifications.dateFrom(startDate))
                .and(ExpenseSpecifications.dateTo(endDate))
                .and(ExpenseSpecifications.hasCategory(category));

        return expenseRepository.findAll(spec, pageable).map(ExpenseResponse::from);
    }

    public ExpenseResponse getById(Long id) {
        return ExpenseResponse.from(findEntityOrThrow(id));
    }

    @Transactional
    public ExpenseResponse update(Long id, ExpenseRequest request) {
        Expense expense = findEntityOrThrow(id);
        expense.setTitle(request.title());
        expense.setAmount(request.amount());
        expense.setCategory(request.category());
        expense.setDate(request.date());
        expense.setNotes(request.notes());
        return ExpenseResponse.from(expense);
    }

    @Transactional
    public void delete(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw ResourceNotFoundException.expense(id);
        }
        expenseRepository.deleteById(id);
    }

    public SummaryResponse getSummary(YearMonth month) {
        YearMonth targetMonth = month != null ? month : YearMonth.now();
        LocalDate today = LocalDate.now();
        LocalDate monthStart = targetMonth.atDay(1);
        LocalDate monthEnd = targetMonth.atEndOfMonth();

        BigDecimal todayTotal = expenseRepository.sumAmountByDate(today);
        BigDecimal monthTotal = expenseRepository.sumAmountByDateBetween(monthStart, monthEnd);

        List<CategoryTotalProjection> rawTotals = expenseRepository.sumAmountByCategoryBetween(monthStart, monthEnd);
        List<CategoryTotalDto> breakdown = rawTotals.stream()
                .map(row -> new CategoryTotalDto(
                        row.getCategory(),
                        row.getTotal(),
                        percentageOf(row.getTotal(), monthTotal)))
                .toList();

        return new SummaryResponse(today, todayTotal, targetMonth, monthTotal, breakdown);
    }

    private Expense findEntityOrThrow(Long id) {
        return expenseRepository.findById(id).orElseThrow(() -> ResourceNotFoundException.expense(id));
    }

    private double percentageOf(BigDecimal part, BigDecimal whole) {
        if (whole == null || whole.compareTo(BigDecimal.ZERO) == 0) {
            return 0.0;
        }
        return part.multiply(BigDecimal.valueOf(100))
                .divide(whole, 2, RoundingMode.HALF_UP)
                .doubleValue();
    }
}
