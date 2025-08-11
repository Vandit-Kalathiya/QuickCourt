import React, { useState, useEffect } from "react";
import ImageGallery from "./components/ImageGallery";
import VenueInfo from "./components/VenueInfo";
import BookingWidget from "./components/BookingWidget";
import ReviewsSection from "./components/ReviewsSection";
import BookingSuccessModal from "./components/BookingSuccessModal";
import Breadcrumb from "./components/Breadcrumb";
import { useParams, useSearchParams } from "react-router-dom";
import { set } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";

const VenueDetailsBooking = () => {
  const [venue, setVenue] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const id = searchParams.get("id");

  useEffect(() => {
    // Fetch venue details using the id
    const fetchVenueDetails = async () => {
      try {
        console.log(id);
        const response = await fetch(`http://localhost:7000/venues/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        const data = await response.json();
        console.log(data);
        setVenue(data);
      } catch (error) {
        console.error("Error fetching venue details:", error);
      }
    };

    fetchVenueDetails();
  }, [id]);

  // Mock venue data
  // const venue = {
  //   id: 1,
  //   name: "Elite Sports Complex",
  //   description: `Premier sports facility featuring state-of-the-art courts and equipment. Our complex offers a comprehensive range of sports activities in a modern, well-maintained environment. Perfect for both casual players and serious athletes looking for top-quality facilities.\n\nWith over 15 years of experience in sports facility management, we pride ourselves on providing exceptional service and maintaining the highest standards of cleanliness and safety. Our facility is equipped with the latest technology and amenities to ensure you have the best possible experience.`,
  //   rating: 4.7,
  //   reviewCount: 284,
  //   operatingHours: "6:00 AM - 10:00 PM",
  //   location: {
  //     address: "1234 Sports Avenue",
  //     city: "Los Angeles",
  //     state: "CA",
  //     zipCode: "90210",
  //     lat: 34.0522,
  //     lng: -118.2437
  //   },
  //   sports: ["Tennis", "Basketball", "Badminton", "Swimming"],
  //   amenities: [
  //     "Parking",
  //     "WiFi",
  //     "Changing Rooms",
  //     "Equipment Rental",
  //     "Cafeteria",
  //     "First Aid",
  //     "Air Conditioning",
  //     "Lighting",
  //     "Security",
  //     "Lockers"
  //   ],
  //   images: [
  //     "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
  //     "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop",
  //     "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
  //     "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop",
  //     "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"
  //   ]
  // };

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      user: {
        name: "Michael Rodriguez",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      rating: 5,
      date: "2025-08-05",
      comment: `Excellent facility with top-notch courts and equipment. The staff is very professional and helpful. I've been playing tennis here for over a year and the experience has been consistently great. The courts are well-maintained and the booking system is very convenient.`,
      verified: true,
      helpfulCount: 12,
      images: [
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=200&h=200&fit=crop",
      ],
    },
    {
      id: 2,
      user: {
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      rating: 4,
      date: "2025-08-03",
      comment: `Great place for basketball! The courts are spacious and well-lit. Only minor complaint is that it can get quite busy during peak hours, but that's understandable given how popular this place is. The changing rooms are clean and the parking is convenient.`,
      verified: true,
      helpfulCount: 8,
    },
    {
      id: 3,
      user: {
        name: "David Chen",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      },
      rating: 5,
      date: "2025-07-28",
      comment: `Outstanding swimming pool facilities! The water is always clean and the temperature is perfect. The lifeguards are attentive and professional. I bring my kids here regularly and they absolutely love it. Highly recommended for families.`,
      verified: false,
      helpfulCount: 15,
    },
    {
      id: 4,
      user: {
        name: "Emily Watson",
        avatar: "https://randomuser.me/api/portraits/women/23.jpg",
      },
      rating: 4,
      date: "2025-07-25",
      comment: `Good badminton courts with proper ventilation and lighting. The equipment rental service is convenient and reasonably priced. The only improvement I'd suggest is having more courts available during weekend evenings as they tend to get fully booked.`,
      verified: true,
      helpfulCount: 6,
    },
    {
      id: 5,
      user: {
        name: "James Wilson",
        avatar: "https://randomuser.me/api/portraits/men/89.jpg",
      },
      rating: 5,
      date: "2025-07-20",
      comment: `Fantastic sports complex! I've used it for both tennis and basketball, and both experiences were excellent. The staff is friendly, the facilities are modern, and the pricing is fair. The online booking system makes it very easy to reserve courts in advance.`,
      verified: true,
      helpfulCount: 11,
    },
    {
      id: 6,
      user: {
        name: "Lisa Anderson",
        avatar: "https://randomuser.me/api/portraits/women/56.jpg",
      },
      rating: 3,
      date: "2025-07-15",
      comment: `Decent facility overall. The courts are in good condition and the location is convenient. However, I found the pricing to be a bit on the higher side compared to other facilities in the area. The customer service could also be more responsive.`,
      verified: false,
      helpfulCount: 3,
    },
  ];

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleBookingComplete = async (data) => {
    console.log(data);

    // Prepare payment data
    const bookingRequest = {
      amount: Math.round(data.totalPrice * 100),
      courtId: data.courtId,
      date: data.date,
      startTime: data.timeSlots[0].startTime,
      endTime: data.timeSlots[0].endTime,
    };

    // Create booking and initialize payment
    const response = await axios.post(
      "http://localhost:7000/bookings",
      bookingRequest,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response);

    const razorpayData = response.data;

    const options = {
      key: razorpayData.keyId,
      amount: razorpayData.amount,
      currency: razorpayData.currency,
      name: "QuickCourt",
      description: "Payment for Court Booking",
      order_id: razorpayData.razorpayOrderId,
      handler: async function (razorpayResponse) {
        try {
          // Step 1: Verify payment with Razorpay's callback API
          const verifyResponse = await axios.post(
            "http://localhost:7000/bookings/payment-callback",
            {}, // No request body since params are in the URL
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                "Content-Type": "application/json",
              },
              params: {
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
              },
            }
          );


          console.log("Payment Callback Response:", verifyResponse.data);

          if (verifyResponse.data.success) {
            const orderId = razorpayResponse.razorpay_order_id;
            // ✅ Step 2: Call your verify-payment API to release funds
            const deliveryVerifyResponse = await axios.post(
              `http://localhost:7000/bookings/verify-payment/${orderId}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
              }
            );

            console.log(
              "Delivery Verify Response:",
              deliveryVerifyResponse.data
            );

            if (deliveryVerifyResponse.data.success) {
              toast.success(deliveryVerifyResponse.data.message);

              // Redirect after a short delay
              setTimeout(() => {
                window.location.href = "http://localhost:4028/my-bookings";
              }, 2000);
            } else {
              toast.error("Payment released but delivery verification failed.");
            }
          } else {
            toast.error("Payment verification failed.");
          }
        } catch (verifyError) {
          console.error("Payment verification failed:", verifyError);
          toast.error("Payment verification failed.");
        }
      },
      prefill: {
        name: "Buyer",
        email: "buyer@example.com",
        contact: "9123456789",
      },
      theme: { color: "#34855a" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };


  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setVenue(null);
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Spacing */}
      <div className="h-16"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb venueName={venue?.name} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Image Gallery */}
            <ImageGallery images={venue?.photos} venueName={venue?.name} />

            {/* Venue Information */}
            <VenueInfo venue={venue} />

            {/* Reviews Section */}
            <ReviewsSection
              reviews={reviews}
              overallRating={venue?.rating}
              totalReviews={venue?.reviewCount}
            />
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-4">
            <BookingWidget
              venue={venue}
              onBookingComplete={handleBookingComplete}
            />
          </div>
        </div>
      </div>
      {/* Booking Success Modal */}
      <BookingSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        bookingData={venue}
      />
    </div>
  );
};

export default VenueDetailsBooking;
