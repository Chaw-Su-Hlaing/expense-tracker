package com.expensetracker.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException expense(Long id) {
        return new ResourceNotFoundException("Expense not found with id: " + id);
    }
}
