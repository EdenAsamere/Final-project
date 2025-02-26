import { z } from "zod";


const addressSchema = z.object({
  city: z.string().min(2, "City name is too short"),
  subcity: z.string().optional(),
  kebele: z.string().optional(),
  houseNumber: z.string().optional(),
  woreda: z.string().optional(),
  zone: z.string().optional(),
  region: z.string().optional(),
});


export const profileSchema = z.object({
  profilePicture: z.string().url().optional(), // Optional field, must be a valid URL
  address: addressSchema.optional(), // Address is optional but must match the schema
});


export const updateProfileSchema = profileSchema.partial(); // Allows partial updates

export const uploadDocumentSchema = z.object({
  documentType: z.enum(["idCard", "bankStatement", "passport", "other"]),
  file: z.string().url("Invalid document URL"),
});

export const penaltySchema = z.object({
  penaltyPoints: z.number().min(0, "Penalty points must be 0 or greater"),
  penaltyReason: z.string().min(5, "Reason must be at least 5 characters"),
  penaltyAmount: z.number().min(0, "Penalty amount must be 0 or greater"),
});
