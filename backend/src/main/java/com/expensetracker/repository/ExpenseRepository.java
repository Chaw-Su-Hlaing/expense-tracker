package com.expensetracker.repository;

import com.expensetracker.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.date = :date")
    BigDecimal sumAmountByDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.date BETWEEN :start AND :end")
    BigDecimal sumAmountByDateBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("""
            SELECT e.category AS category, COALESCE(SUM(e.amount), 0) AS total
            FROM Expense e
            WHERE e.date BETWEEN :start AND :end
            GROUP BY e.category
            ORDER BY total DESC
            """)
    List<CategoryTotalProjection> sumAmountByCategoryBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
