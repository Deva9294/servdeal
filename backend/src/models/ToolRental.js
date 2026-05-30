import mongoose from 'mongoose';

const toolRentalSchema = new mongoose.Schema(
  {
    rentalId: { type: String, unique: true },
    tool: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool', required: true },
    renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalDays: { type: Number, required: true },
    dailyRate: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    deposit: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'picked_up', 'returned', 'cancelled', 'disputed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'deposit_held'],
      default: 'pending',
    },
    deliveryMethod: { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
    deliveryAddress: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },
    notes: String,
    returnedAt: Date,
    damageReported: { type: Boolean, default: false },
    damageDescription: String,
    depositReturned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

toolRentalSchema.pre('save', function generateRentalId(next) {
  if (!this.rentalId) {
    this.rentalId = `TR${Date.now().toString().slice(-6)}`;
  }
  next();
});

toolRentalSchema.index({ renter: 1 });
toolRentalSchema.index({ owner: 1 });
toolRentalSchema.index({ tool: 1 });
toolRentalSchema.index({ status: 1 });

export default mongoose.model('ToolRental', toolRentalSchema);
