import DynamicPricing from '../models/DynamicPricing.js';
import Provider from '../models/Provider.js';
import Booking from '../models/Booking.js';

/**
 * Calculate dynamic price for a service based on demand, supply, distance, time, and emergency
 */
export const calculateDynamicPrice = async ({
  serviceId,
  city,
  customerLat,
  customerLng,
  basePrice,
  isEmergency = false,
}) => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hour = now.getHours();

  const rules = await DynamicPricing.find({
    $or: [{ service: serviceId }, { service: null }],
    $or: [{ city }, { city: null }],
    $or: [{ dayOfWeek }, { dayOfWeek: null }],
    startHour: { $lte: hour },
    endHour: { $gte: hour },
    isActive: true,
  }).sort({ city: -1, service: -1 });

  const rule = rules[0] || {
    demandMultiplier: 1,
    supplyMultiplier: 1,
    distanceMultiplier: 1,
    emergencyMultiplier: 1,
    maxMultiplier: 2,
  };

  const nearbyProviders = await Provider.countDocuments({
    services: serviceId,
    isOnline: true,
    verificationStatus: 'approved',
    currentLocation: {
      $near: {
        $geometry: { type: 'Point', coordinates: [customerLng, customerLat] },
        $maxDistance: 10000,
      },
    },
  });

  const activeBookings = await Booking.countDocuments({
    service: serviceId,
    status: { $in: ['pending', 'confirmed', 'ongoing'] },
    createdAt: { $gte: new Date(Date.now() - 3600000) },
  });

  let demandFactor = 1;
  if (nearbyProviders === 0) demandFactor = 1.5;
  else if (activeBookings / nearbyProviders > 2) demandFactor = 1.3;
  else if (activeBookings / nearbyProviders > 1) demandFactor = 1.15;

  let supplyFactor = nearbyProviders < 3 ? 1.2 : 1;
  let emergencyFactor = isEmergency ? (rule.emergencyMultiplier || 1.5) : 1;

  const totalMultiplier =
    demandFactor * supplyFactor * emergencyFactor * (rule.demandMultiplier || 1);

  const clampedMultiplier = Math.min(totalMultiplier, rule.maxMultiplier || 2);

  const finalAmount = Math.round(basePrice * clampedMultiplier);

  return {
    basePrice,
    surgeMultiplier: Math.round(clampedMultiplier * 100) / 100,
    finalAmount,
    breakdown: {
      demandFactor: Math.round(demandFactor * 100) / 100,
      supplyFactor: Math.round(supplyFactor * 100) / 100,
      emergencyFactor: Math.round(emergencyFactor * 100) / 100,
      nearbyProviders,
      activeBookings,
    },
  };
};

/**
 * Get pricing rules for admin management
 */
export const getPricingRules = async (filters = {}) => {
  return DynamicPricing.find(filters).populate('service', 'name').sort('-createdAt');
};
