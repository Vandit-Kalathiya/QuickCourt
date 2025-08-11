import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Input from "../../../components/ui/Input";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useOwner } from "context/OwnerContext";

const BookingWidget = ({ venue, onBookingComplete }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCourtId, setSelectedCourtId] = useState("");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [courts, setCourts] = useState([]);
  const { getFacilityCourts } = useOwner();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  // Base price per slot (you can make this dynamic based on court or time)
  const BASE_PRICE_PER_SLOT = 35;

  // Create axios instance
  const api = axios.create({
    baseURL: "http://localhost:7000/api",
    timeout: 10000,
  });

  // Add request interceptor for auth token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const courts = await getFacilityCourts(id);
        setCourts(courts);
      } catch (error) {
        console.error("Error fetching courts:", error);
      }
    };
    fetchCourts();
  }, [id, getFacilityCourts]);

  // Format time from 24-hour to 12-hour format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Transform API slots to display format
  const transformSlots = (apiSlots) => {
    return apiSlots.map((slot, index) => ({
      id: `${slot.startTime}-${slot.endTime}`,
      displayTime: `${formatTime(slot.startTime)} - ${formatTime(
        slot.endTime
      )}`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      price: BASE_PRICE_PER_SLOT, // You can make this dynamic
      available: true, // API doesn't return availability, assuming all returned slots are available
    }));
  };

  const sportOptions = courts?.map((court) => ({
    value: court?.id,
    label: `${court?.name} - ${court?.sportType}`,
  }));

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  // Fetch available slots from API
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (selectedDate && selectedCourtId) {
        setIsLoading(true);
        console.log(selectedCourtId, ' ', selectedDate);
        try {
          const response = await api.get(
            `/courts/${selectedCourtId}/available-slots`,
            {
              params: { date: selectedDate },
            }
          );

          console.log(response.data);

          const transformedSlots = transformSlots(response.data);
          setAvailableSlots(transformedSlots);
        } catch (error) {
          console.error("Error fetching available slots:", error);
          setAvailableSlots([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setAvailableSlots([]);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, selectedCourtId]);

  useEffect(() => {
    // Calculate total price
    const total = selectedTimeSlots.reduce((sum, slotId) => {
      const slot = availableSlots.find((s) => s.id === slotId);
      return sum + (slot ? slot.price : 0);
    }, 0);
    setTotalPrice(total);
  }, [selectedTimeSlots, availableSlots]);

  const handleTimeSlotToggle = (slotId) => {
    setSelectedTimeSlots((prev) => {
      if (prev.includes(slotId)) {
        return prev.filter((id) => id !== slotId);
      } else {
        return [...prev, slotId];
      }
    });
  };

  const handleBookingSubmit = () => {
    if (selectedDate && selectedCourtId && selectedTimeSlots.length > 0) {
      setShowBookingSummary(true);
    }
  };

  const handlePaymentProcess = () => {
    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);

      const selectedCourt = courts.find(
        (court) => court.id === selectedCourtId
      );
      const bookingData = {
        date: selectedDate,
        courtId: selectedCourtId,
        timeSlots: selectedTimeSlots.map((slotId) => {
          const slot = availableSlots.find((s) => s.id === slotId);
          return {
            id: slot.id,
            displayTime: slot.displayTime,
            startTime: slot.startTime,
            endTime: slot.endTime,
            price: slot.price,
          };
        }),
        totalPrice,
      };
      onBookingComplete(bookingData);
      setShowBookingSummary(false);
      // Reset form
      setSelectedDate("");
      setSelectedCourtId("");
      setSelectedTimeSlots([]);
    }, 2000);
  };

  if (showBookingSummary) {
    const selectedCourt = courts.find((court) => court.id === selectedCourtId);

    return (
      <div className="bg-card border border-border rounded-lg p-6 sticky top-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">
            Booking Summary
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBookingSummary(false)}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-text-secondary">Venue:</span>
            <span className="font-medium text-foreground">{venue?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Date:</span>
            <span className="font-medium text-foreground">
              {new Date(selectedDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Court:</span>
            <span className="font-medium text-foreground">
              {selectedCourt?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Sport:</span>
            <span className="font-medium text-foreground">
              {selectedCourt?.sportType}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Time Slots:</span>
            <div className="mt-2 space-y-1">
              {selectedTimeSlots.map((slotId) => {
                const slot = availableSlots.find((s) => s.id === slotId);
                return (
                  <div key={slotId} className="flex justify-between text-sm">
                    <span>{slot?.displayTime}</span>
                    <span>${slot?.price}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-primary">${totalPrice}</span>
            </div>
          </div>
        </div>
        <Button
          onClick={handlePaymentProcess}
          loading={isLoading}
          fullWidth
          className="mb-3"
        >
          {isLoading ? "Processing Payment..." : "Confirm & Pay"}
        </Button>
        <p className="text-xs text-text-secondary text-center">
          Secure payment powered by Stripe. Your booking will be confirmed
          instantly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-2">
      <h3 className="text-xl font-semibold text-foreground mb-6">
        Book This Venue
      </h3>
      <div className="space-y-6">
        {/* Date Selection */}
        <Input
          type="date"
          label="Select Date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={today}
          required
        />

        {/* Court Selection */}
        <Select
          label="Choose Court"
          placeholder="Select a court"
          options={sportOptions}
          value={selectedCourtId}
          onChange={setSelectedCourtId}
          required
        />

        {/* Time Slots */}
        {selectedDate && selectedCourtId && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Available Time Slots
            </label>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => handleTimeSlotToggle(slot.id)}
                    disabled={!slot.available}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      !slot.available
                        ? "bg-muted text-muted-foreground border-border cursor-not-allowed"
                        : selectedTimeSlots.includes(slot.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{slot.displayTime}</span>
                      <span className="text-xs opacity-80">${slot.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-text-secondary">
                <Icon
                  name="Clock"
                  size={32}
                  className="mx-auto mb-2 opacity-50"
                />
                <p>No available slots for this date</p>
              </div>
            )}
          </div>
        )}

        {/* Price Summary */}
        {selectedTimeSlots.length > 0 && (
          <div className="bg-muted rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary">Selected Slots:</span>
              <span className="font-medium text-foreground">
                {selectedTimeSlots.length}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Price:</span>
              <span className="text-primary">${totalPrice}</span>
            </div>
          </div>
        )}

        {/* Book Button */}
        <Button
          onClick={handleBookingSubmit}
          disabled={
            !selectedDate || !selectedCourtId || selectedTimeSlots.length === 0
          }
          fullWidth
          iconName="Calendar"
          iconPosition="left"
        >
          Book Now
        </Button>

        <div className="text-xs text-text-secondary space-y-1">
          <p>• Free cancellation up to 24 hours before booking</p>
          <p>• Instant confirmation via email and SMS</p>
          <p>• Secure payment processing</p>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;
