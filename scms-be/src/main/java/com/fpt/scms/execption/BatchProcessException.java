package com.fpt.scms.execption;

import java.util.List;

public class BatchProcessException extends RuntimeException {
    private final List<String> errors;

    public BatchProcessException(List<String> errors) {
        super("Batch processing failed with multiple errors");
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}