import { z } from 'zod';

// Common fields shared across all listing types
const commonSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    price: z.string().min(1, 'Price is required'),
    location: z.string().min(3, 'Location is required'),
    description: z.string().min(50, 'Description must be at least 50 characters'),
    amenities: z.array(z.string()).min(1, 'Add at least one amenity'),
});

// Builder/New Construction Schema
export const builderSchema = commonSchema.extend({
    listingType: z.literal('builder_new'),
    builderName: z.string().min(2, 'Builder name is required'),
    reraId: z.string().optional(),
    totalTowers: z.number().positive('Must be positive').optional(),
    totalUnits: z.number().positive('Must be positive').optional(),
    possessionDate: z.string().optional(),
    bhk: z.string().optional(),
    carpetArea: z.string().optional(),
});

// Resale Schema
export const resaleSchema = commonSchema.extend({
    listingType: z.literal('resale_residential'),
    propertyAge: z.string().min(1, 'Property age is required'),
    ownershipType: z.enum(['Freehold', 'Leasehold']),
    maintenanceCost: z.string().optional(),
    vacancyStatus: z.enum(['Occupied', 'Vacant']),
    bhk: z.string().min(1, 'BHK is required'),
    bathrooms: z.number().positive('Must be positive'),
    carpetArea: z.string().min(1, 'Carpet area is required'),
});

// Rental Schema
export const rentalSchema = commonSchema.extend({
    listingType: z.literal('rent_residential'),
    monthlyRent: z.string().min(1, 'Monthly rent is required'),
    securityDeposit: z.string().min(1, 'Security deposit is required'),
    availableFrom: z.string().min(1, 'Available from date is required'),
    tenantPreference: z.enum(['Family', 'Bachelors', 'Company', 'Any']),
    furnishing: z.enum(['Fully Furnished', 'Semi Furnished', 'Unfurnished']),
    bhk: z.string().min(1, 'BHK is required'),
    bathrooms: z.number().positive('Must be positive'),
    carpetArea: z.string().min(1, 'Carpet area is required'),
});

// Commercial Schema (Sell or Rent)
export const commercialSchema = commonSchema.extend({
    listingType: z.enum(['commercial_sell', 'commercial_rent']),
    floorLoading: z.string().optional(),
    powerBackupKVA: z.string().optional(),
    cafeteria: z.boolean().optional(),
    zoningCode: z.string().optional(),
    fireSafety: z.boolean().optional(),
    carpetArea: z.string().min(1, 'Carpet area is required'),
    // If commercial_rent
    monthlyRent: z.string().optional(),
    securityDeposit: z.string().optional(),
});

// Type guard helpers
export function getSchemaForListingType(listingType: string) {
    switch (listingType) {
        case 'builder_new':
            return builderSchema;
        case 'resale_residential':
            return resaleSchema;
        case 'rent_residential':
            return rentalSchema;
        case 'commercial_sell':
        case 'commercial_rent':
            return commercialSchema;
        default:
            return commonSchema;
    }
}

// Export types
export type BuilderFormData = z.infer<typeof builderSchema>;
export type ResaleFormData = z.infer<typeof resaleSchema>;
export type RentalFormData = z.infer<typeof rentalSchema>;
export type CommercialFormData = z.infer<typeof commercialSchema>;
