// src/contexts/PaymentContext.jsx
import React, { createContext, useContext, useReducer } from 'react';
import { paymentService } from '../services/paymentService';
import { useAuth } from './AuthContext';
import { useBooking } from './BookingContext';
import { toast } from 'react-toastify';

const PaymentContext = createContext();

const paymentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_PAYMENT_STATUS':
      return {
        ...state,
        paymentStatus: action.payload
      };
    case 'SET_CURRENT_PAYMENT':
      return {
        ...state,
        currentPayment: action.payload
      };
    case 'CLEAR_CURRENT_PAYMENT':
      return {
        ...state,
        currentPayment: null,
        paymentStatus: null
      };
    case 'SET_ORDER_DATA':
      return {
        ...state,
        orderData: action.payload
      };
    case 'CLEAR_ORDER_DATA':
      return {
        ...state,
        orderData: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_REFUND_STATUS':
      return {
        ...state,
        refundStatus: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  currentPayment: null,
  orderData: null,
  paymentStatus: null,
  refundStatus: null,
  loading: false,
  error: null
};

export const PaymentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);
  const { isAuthenticated } = useAuth();
  const { updateBookingStatus } = useBooking();

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existingScript = document.getElementById('razorpay-script');
      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Create payment order - corresponds to PaymentController.createOrder()
  const createOrder = async (bookingId, amount, customerPhone) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'creating_order' });

      const orderData = await paymentService.createOrder(bookingId, amount, customerPhone);
      
      dispatch({ type: 'SET_ORDER_DATA', payload: orderData });
      dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'order_created' });
      
      return orderData;
    } catch (error) {
      const errorMessage = error.message || 'Failed to create payment order';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'error' });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Initiate payment - uses Razorpay SDK + PaymentController.verifyPayment()
  const initiatePayment = async (bookingId, amount, customerDetails) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'initiating' });

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order
      const orderData = await createOrder(bookingId, amount, customerDetails.phone);

      // Configure Razorpay options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: 'Sports Booking Platform',
        description: orderData.description,
        image: '/logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          contact: orderData.customerPhone
        },
        notes: {
          booking_id: bookingId
        },
        theme: {
          color: '#3399cc'
        },
        handler: async (response) => {
          await handlePaymentSuccess(response, bookingId);
        },
        modal: {
          ondismiss: () => {
            dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'cancelled' });
            dispatch({ type: 'SET_LOADING', payload: false });
            toast.info('Payment cancelled by user');
          }
        }
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', async (response) => {
        await handlePaymentFailure(orderData.orderId, response.error.description);
      });

      rzp.open();
      dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'payment_opened' });

    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'error' });
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error(error.message);
      throw error;
    }
  };

  // Handle successful payment - corresponds to PaymentController.verifyPayment()
  const handlePaymentSuccess = async (response, bookingId) => {
    try {
      dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'verifying' });
      
      const verificationResult = await paymentService.verifyPayment(response);
      
      if (verificationResult.status === 'CAPTURED') {
        dispatch({ type: 'SET_CURRENT_PAYMENT', payload: verificationResult });
        dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'success' });
        
        // Update booking status
        updateBookingStatus(bookingId, 'CONFIRMED');
        
        toast.success('Payment successful! Booking confirmed.');
        return verificationResult;
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'verification_failed' });
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Payment verification failed');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Handle payment failure - corresponds to PaymentController.handleFailure()
  const handlePaymentFailure = async (orderId, reason) => {
    try {
      await paymentService.handlePaymentFailure(orderId, reason);
      dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'failed' });
      toast.error(Payment failed: ${reason});
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Error handling payment failure');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Process refund - corresponds to PaymentController.processRefund()
  const processRefund = async (bookingId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_REFUND_STATUS', payload: 'processing' });
      
      const result = await paymentService.processRefund(bookingId);
      
      dispatch({ type: 'SET_REFUND_STATUS', payload: 'completed' });
      toast.success('Refund processed successfully');
      return result;
    } catch (error) {
      const errorMessage = error.message || 'Failed to process refund';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_REFUND_STATUS', payload: 'failed' });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Get payment by booking ID - corresponds to PaymentController.getPaymentByBooking()
  const getPaymentByBooking = async (bookingId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const payment = await paymentService.getPaymentByBooking(bookingId);
      
      dispatch({ type: 'SET_CURRENT_PAYMENT', payload: payment });
      return payment;
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch payment details';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Clear payment data
  const clearPayment = () => {
    dispatch({ type: 'CLEAR_CURRENT_PAYMENT' });
    dispatch({ type: 'CLEAR_ORDER_DATA' });
    dispatch({ type: 'CLEAR_ERROR' });
    dispatch({ type: 'SET_REFUND_STATUS', payload: null });
  };

  // Reset payment status
  const resetPaymentStatus = () => {
    dispatch({ type: 'SET_PAYMENT_STATUS', payload: null });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    createOrder,
    initiatePayment,
    handlePaymentSuccess,
    handlePaymentFailure,
    processRefund,
    getPaymentByBooking,
    clearPayment,
    resetPaymentStatus,
    clearError
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};