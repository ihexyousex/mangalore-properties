"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ListingFormData } from "@/stores/useListingStore";

// Builder-specific fields
export function BuilderFields({ register, errors }: any) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">New Construction Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Builder Name */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Builder/Developer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("builderName")}
                        placeholder="e.g., Prestige Group"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                    {errors.builderName && (
                        <p className="text-sm text-red-500">{errors.builderName.message}</p>
                    )}
                </div>

                {/* RERA ID */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        RERA ID
                    </label>
                    <input
                        {...register("reraId")}
                        placeholder="PRM/KA/RERA/..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                </div>

                {/* Total Towers */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Total Towers/Blocks
                    </label>
                    <input
                        type="number"
                        {...register("totalTowers", { valueAsNumber: true })}
                        placeholder="e.g., 4"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                </div>

                {/* Total Units */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Total Units
                    </label>
                    <input
                        type="number"
                        {...register("totalUnits", { valueAsNumber: true })}
                        placeholder="e.g., 120"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                </div>

                {/* Possession Date */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Expected Possession Date
                    </label>
                    <input
                        type="date"
                        {...register("possessionDate")}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                </div>

                {/* BHK Configuration */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        BHK Options
                    </label>
                    <input
                        {...register("bhk")}
                        placeholder="e.g., 2, 3, 4 BHK"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                </div>
            </div>
        </div>
    );
}

// Resale-specific fields
export function ResaleFields({ register, errors }: any) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Resale Property Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Age */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Property Age <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("propertyAge")}
                        placeholder="e.g., 5 years"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                    {errors.propertyAge && (
                        <p className="text-sm text-red-500">{errors.propertyAge.message}</p>
                    )}
                </div>

                {/* Ownership Type */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Ownership Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register("ownershipType")}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    >
                        <option value="">Select...</option>
                        <option value="Freehold">Freehold</option>
                        <option value="Leasehold">Leasehold</option>
                    </select>
                    {errors.ownershipType && (
                        <p className="text-sm text-red-500">{errors.ownershipType.message}</p>
                    )}
                </div>

                {/* BHK */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        BHK <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("bhk")}
                        placeholder="e.g., 3 BHK"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                    {errors.bhk && (
                        <p className="text-sm text-red-500">{errors.bhk.message}</p>
                    )}
                </div>

                {/* Bathrooms */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Bathrooms <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        {...register("bathrooms", { valueAsNumber: true })}
                        placeholder="e.g., 2"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                    {errors.bathrooms && (
                        <p className="text-sm text-red-500">{errors.bathrooms.message}</p>
                    )}
                </div>

                {/* Carpet Area */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Carpet Area <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("carpetArea")}
                        placeholder="e.g., 1200 sqft"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                    {errors.carpetArea && (
                        <p className="text-sm text-red-500">{errors.carpetArea.message}</p>
                    )}
                </div>

                {/* Maintenance Cost */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Monthly Maintenance
                    </label>
                    <input
                        {...register("maintenanceCost")}
                        placeholder="e.g., ₹2500/month"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                </div>

                {/* Vacancy Status */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Current Status <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register("vacancyStatus")}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    >
                        <option value="">Select...</option>
                        <option value="Vacant">Vacant</option>
                        <option value="Occupied">Occupied</option>
                    </select>
                    {errors.vacancyStatus && (
                        <p className="text-sm text-red-500">{errors.vacancyStatus.message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Rental-specific fields
export function RentalFields({ register, errors }: any) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Rental Property Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Rent */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Monthly Rent <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("monthlyRent")}
                        placeholder="e.g., ₹25,000"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                    {errors.monthlyRent && (
                        <p className="text-sm text-red-500">{errors.monthlyRent.message}</p>
                    )}
                </div>

                {/* Security Deposit */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Security Deposit <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("securityDeposit")}
                        placeholder="e.g., ₹50,000"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                    {errors.securityDeposit && (
                        <p className="text-sm text-red-500">{errors.securityDeposit.message}</p>
                    )}
                </div>

                {/* Available From */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Available From <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        {...register("availableFrom")}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                    {errors.availableFrom && (
                        <p className="text-sm text-red-500">{errors.availableFrom.message}</p>
                    )}
                </div>

                {/* Tenant Preference */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Preferred Tenant <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register("tenantPreference")}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    >
                        <option value="">Select...</option>
                        <option value="Family">Family</option>
                        <option value="Bachelors">Bachelors</option>
                        <option value="Company">Company Lease</option>
                        <option value="Any">Any</option>
                    </select>
                    {errors.tenantPreference && (
                        <p className="text-sm text-red-500">{errors.tenantPreference.message}</p>
                    )}
                </div>

                {/* Furnishing Status */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Furnishing <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register("furnishing")}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    >
                        <option value="">Select...</option>
                        <option value="Fully Furnished">Fully Furnished</option>
                        <option value="Semi Furnished">Semi Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                    </select>
                    {errors.furnishing && (
                        <p className="text-sm text-red-500">{errors.furnishing.message}</p>
                    )}
                </div>

                {/* BHK */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        BHK <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("bhk")}
                        placeholder="e.g., 2 BHK"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                    {errors.bhk && (
                        <p className="text-sm text-red-500">{errors.bhk.message}</p>
                    )}
                </div>

                {/* Bathrooms */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Bathrooms <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        {...register("bathrooms", { valueAsNumber: true })}
                        placeholder="e.g., 2"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                    {errors.bathrooms && (
                        <p className="text-sm text-red-500">{errors.bathrooms.message}</p>
                    )}
                </div>

                {/* Carpet Area */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Carpet Area <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("carpetArea")}
                        placeholder="e.g., 1000 sqft"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                    {errors.carpetArea && (
                        <p className="text-sm text-red-500">{errors.carpetArea.message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Commercial-specific fields
export function CommercialFields({ register, errors, listingType }: any) {
    const isRental = listingType === 'commercial_rent';

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Commercial Property Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Carpet Area */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Carpet Area <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("carpetArea")}
                        placeholder="e.g., 2500 sqft"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                    {errors.carpetArea && (
                        <p className="text-sm text-red-500">{errors.carpetArea.message}</p>
                    )}
                </div>

                {/* Floor Loading */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Floor Loading Capacity
                    </label>
                    <input
                        {...register("floorLoading")}
                        placeholder="e.g., 150 kg/sqm"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                </div>

                {/* Power Backup */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Power Backup (KVA)
                    </label>
                    <input
                        {...register("powerBackupKVA")}
                        placeholder="e.g., 100 KVA"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                </div>

                {/* Zoning Code */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Zoning Code
                    </label>
                    <input
                        {...register("zoningCode")}
                        placeholder="e.g., C-1 Commercial"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                </div>

                {/* Cafeteria */}
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        {...register("cafeteria")}
                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-yellow-500 focus:ring-yellow-500/20"
                    />
                    <label className="text-sm font-medium text-white/80">
                        Cafeteria Available
                    </label>
                </div>

                {/* Fire Safety */}
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        {...register("fireSafety")}
                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-yellow-500 focus:ring-yellow-500/20"
                    />
                    <label className="text-sm font-medium text-white/80">
                        Fire Safety Compliant
                    </label>
                </div>

                {/* If Rental */}
                {isRental && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">
                                Monthly Rent
                            </label>
                            <input
                                {...register("monthlyRent")}
                                placeholder="e.g., ₹1,50,000"
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">
                                Security Deposit
                            </label>
                            <input
                                {...register("securityDeposit")}
                                placeholder="e.g., ₹3,00,000"
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
