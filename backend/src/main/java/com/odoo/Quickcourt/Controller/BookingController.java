package com.odoo.Quickcourt.Controller;

// controller/BookingController.java

import com.odoo.Quickcourt.Dto.Booking.BookingRequest;
import com.odoo.Quickcourt.Dto.Booking.BookingResponse;
import com.odoo.Quickcourt.Services.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Booking management APIs")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('OWNER')")
    @Operation(summary = "Create a new booking")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) throws BadRequestException {
        BookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('OWNER')")
    @Operation(summary = "Get user's bookings")
    public ResponseEntity<Page<BookingResponse>> getUserBookings(Pageable pageable) throws BadRequestException {
        // Log original pageable for debugging

        // Map 'bookingDate' to 'createdAt' (optional fallback)
        Sort sort = pageable.getSort().stream()
                .map(order -> {
                    if ("bookingDate".equals(order.getProperty())) {
                        return new Sort.Order(order.getDirection(), "createdAt");
                    }
                    return order;
                })
                .collect(Collectors.collectingAndThen(Collectors.toList(), Sort::by));

        // Validate sort fields
        List<String> validSortFields = Arrays.asList("id", "status", "createdAt", "startTime", "endTime");
        for (Sort.Order order : sort) {
            String sortProperty = order.getProperty();
            if (!validSortFields.contains(sortProperty)) {
                throw new BadRequestException("Invalid sort field: " + sortProperty + ". Valid fields are: " + validSortFields);
            }
        }

        // Validate page and size
        if (pageable.getPageNumber() < 0) {
            throw new BadRequestException("Page number cannot be negative");
        }
        if (pageable.getPageSize() <= 0 || pageable.getPageSize() > 100) {
            throw new BadRequestException("Page size must be between 1 and 100");
        }

        Pageable validatedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        Page<BookingResponse> bookings = bookingService.getUserBookings(validatedPageable);
        return ResponseEntity.ok(bookings);
    }
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER') or hasRole('OWNER')")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<String> cancelBooking(@PathVariable UUID id) throws BadRequestException {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok("Booking cancelled successfully");
    }
}
