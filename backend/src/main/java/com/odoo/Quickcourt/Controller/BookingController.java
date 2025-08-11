package com.odoo.Quickcourt.Controller;

// controller/BookingController.java

import com.odoo.Quickcourt.Dto.Booking.BookingRequest;
import com.odoo.Quickcourt.Dto.Booking.BookingResponse;
import com.odoo.Quickcourt.Services.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Booking management APIs")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('OWNER')")
    @Operation(summary = "Create a new booking")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        BookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('OWNER')")
    @Operation(summary = "Get user's bookings")
    public ResponseEntity<Page<BookingResponse>> getUserBookings(Pageable pageable) {
        Page<BookingResponse> bookings = bookingService.getUserBookings(pageable);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER') or hasRole('OWNER')")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<String> cancelBooking(@PathVariable UUID id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok("Booking cancelled successfully");
    }
}
