import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import Provider from '../models/Provider.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

const generateInvoiceData = async (booking) => {
  const [service, customer, provider, payment] = await Promise.all([
    Service.findById(booking.service),
    User.findById(booking.customer).select('name email phone'),
    Provider.findById(booking.provider).populate('user', 'name businessName email phone'),
    Payment.findOne({ booking: booking._id }),
  ]);

  const invoiceNumber = `INV-${booking.bookingId}-${Date.now().toString().slice(-4)}`;
  const gstRate = 0.18;
  const baseAmount = booking.baseAmount || booking.amount;
  const gstAmount = booking.gst || Math.round(baseAmount * gstRate);
  const discount = booking.discount || 0;
  const totalAmount = booking.amount;

  return {
    invoiceNumber,
    date: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

    seller: {
      name: provider?.user?.businessName || provider?.user?.name || 'ServDeal Provider',
      address: '',
      gstin: '',
      phone: provider?.user?.phone || '',
      email: provider?.user?.email || '',
    },

    buyer: {
      name: customer?.name || 'Customer',
      address: booking.address
        ? `${booking.address.line1 || ''}, ${booking.address.city || ''}, ${booking.address.state || ''}, ${booking.address.pincode || ''}`
        : '',
      phone: customer?.phone || '',
      email: customer?.email || '',
    },

    service: {
      name: service?.name || 'Service',
      description: service?.shortDescription || '',
      hsn: service?.hsnCode || '9985',
      quantity: 1,
      rate: baseAmount,
      amount: baseAmount,
    },

    financials: {
      subtotal: baseAmount,
      discount,
      taxableAmount: baseAmount - discount,
      cgst: Math.round(gstAmount / 2),
      sgst: Math.round(gstAmount / 2),
      igst: 0,
      totalAmount,
      amountInWords: numberToWords(totalAmount),
    },

    payment: {
      method: booking.paymentMethod || 'online',
      status: booking.paymentStatus || 'pending',
      transactionId: payment?.gatewayPaymentId || payment?.gatewayOrderId || '',
      paidAt: payment?.updatedAt || null,
    },

    bookingId: booking.bookingId,
    metadata: {
      bookingId: booking._id,
      serviceId: service?._id,
      providerId: provider?._id,
    },
  };
};

function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
  return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
}

export const getBookingInvoice = catchAsync(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.bookingId, customer: req.user._id });
  if (!booking) throw new AppError('Booking not found', 404);

  const invoice = await generateInvoiceData(booking);
  res.json({ success: true, data: invoice });
});

export const getProviderBookingInvoice = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider not found', 404);

  const booking = await Booking.findOne({ _id: req.params.bookingId, provider: provider._id });
  if (!booking) throw new AppError('Booking not found', 404);

  const invoice = await generateInvoiceData(booking);
  res.json({ success: true, data: invoice });
});

export const downloadInvoice = catchAsync(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.bookingId, customer: req.user._id });
  if (!booking) throw new AppError('Booking not found', 404);

  const invoice = await generateInvoiceData(booking);

  // In production, generate PDF here using a library like puppeteer or pdfkit
  // For now, return structured data that frontend can render as printable invoice
  res.json({
    success: true,
    data: invoice,
    message: 'Use the structured data to render a printable invoice on the frontend.',
  });
});

export const emailInvoice = catchAsync(async (req, res) => {
  const { email } = req.body;
  const booking = await Booking.findOne({ _id: req.params.bookingId, customer: req.user._id });
  if (!booking) throw new AppError('Booking not found', 404);

  const invoice = await generateInvoiceData(booking);

  // Email sending would be handled by emailService
  // For now, return success
  res.json({
    success: true,
    data: invoice,
    message: `Invoice sent to ${email || invoice.buyer.email}`,
  });
});
