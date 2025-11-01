import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, Check, X, AlertCircle, Loader, Clock } from 'lucide-react';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  onPaymentSuccess, 
  appointmentDetails,
  amount = 500.00 // Default consultation fee
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds

  // Countdown timer for reservation
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setError('Your reservation has expired. Please select the slot again.');
          setTimeout(() => {
            onClose();
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace(/\//g, '').length <= 4) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const validateCardPayment = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    if (!cardName || cardName.trim().length < 3) {
      setError('Please enter the cardholder name');
      return false;
    }
    if (!expiryDate || expiryDate.length !== 5) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!cvv || cvv.length !== 3) {
      setError('Please enter a valid 3-digit CVV');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    setError('');

    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    if (selectedMethod === 'CARD' && !validateCardPayment()) {
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const paymentData = {
        paymentMethod: selectedMethod,
        amount: amount,
        cardDetails: selectedMethod === 'CARD' ? `**** **** **** ${cardNumber.slice(-4)}` : null,
        notes: selectedMethod === 'CASH' ? 'Cash payment to be collected at clinic' : 'Card payment processed'
      };

      onPaymentSuccess(paymentData);
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      setProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: 'CARD',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Pay securely with your card',
      color: 'blue'
    },
    {
      id: 'CASH',
      name: 'Cash Payment',
      icon: Wallet,
      description: 'Pay at the clinic',
      color: 'green'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={!processing ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-xl font-bold">Complete Payment</h3>
              <p className="text-blue-100 text-sm mt-1">Secure checkout</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Reservation Timer */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                timeRemaining < 60 ? 'bg-red-500' : 'bg-white bg-opacity-20'
              }`}>
                <Clock size={16} />
                <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
              </div>
              <button
                onClick={onClose}
                disabled={processing}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Reservation Notice */}
          <div className={`rounded-xl p-3 border flex items-start gap-2 ${
            timeRemaining < 60 
              ? 'bg-red-50 border-red-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <AlertCircle className={timeRemaining < 60 ? 'text-red-500' : 'text-yellow-600'} size={18} />
            <div className="text-sm">
              <p className={`font-medium ${
                timeRemaining < 60 ? 'text-red-800' : 'text-yellow-800'
              }`}>
                {timeRemaining < 60 ? 'Hurry! Time running out!' : 'Slot Reserved'}
              </p>
              <p className={timeRemaining < 60 ? 'text-red-700' : 'text-yellow-700'}>
                This slot is temporarily reserved for you. Complete payment within {formatTime(timeRemaining)} or it will be released.
              </p>
            </div>
          </div>

          {/* Appointment Summary */}
          {appointmentDetails && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <h4 className="font-semibold text-gray-800 mb-2">Appointment Details</h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-700">
                  <span className="font-medium">Doctor:</span> {appointmentDetails.doctorName}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Date:</span> {appointmentDetails.date}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Time:</span> {appointmentDetails.time}
                </p>
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Consultation Fee</span>
              <span className="text-2xl font-bold text-gray-900">₹{amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Payment Methods */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Select Payment Method</h4>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    disabled={processing}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? `border-${method.color}-500 bg-${method.color}-50 shadow-md`
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? `bg-${method.color}-100` : 'bg-gray-100'
                      }`}>
                        <Icon className={isSelected ? `text-${method.color}-600` : 'text-gray-600'} size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{method.name}</p>
                          {isSelected && (
                            <Check className={`text-${method.color}-600`} size={18} />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card Details Form */}
          {selectedMethod === 'CARD' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white shadow-lg">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded"></div>
                  <CreditCard size={32} className="text-gray-400" />
                </div>
                <div className="space-y-4">
                  <div className="text-xl tracking-wider font-mono">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">CARDHOLDER NAME</p>
                      <p className="font-medium">{cardName || 'YOUR NAME'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">EXPIRES</p>
                      <p className="font-medium">{expiryDate || 'MM/YY'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    disabled={processing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="JOHN DOE"
                    disabled={processing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      disabled={processing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="123"
                      disabled={processing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cash Payment Info */}
          {selectedMethod === 'CASH' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fadeIn">
              <div className="flex gap-3">
                <Wallet className="text-green-600 flex-shrink-0" size={20} />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Cash Payment Instructions</p>
                  <p>Please bring ₹{amount.toFixed(2)} to the clinic on your appointment day. Payment must be made before the consultation.</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={processing}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={!selectedMethod || processing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {processing ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Confirm Payment
                </>
              )}
            </button>
          </div>

          {/* Security Badge */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secured by 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
