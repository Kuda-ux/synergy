import { z } from "zod";
import { ORGANISATION_TYPES } from "../constants";

const orgTypeValues = ORGANISATION_TYPES.map((o) => o.value) as [string, ...string[]];

export const quotationItemSchema = z.object({
  productId: z.string().min(1).optional(),
  description: z.string().min(1).max(300),
  quantity: z.number().int().min(1).max(100000),
});

export const quotationSchema = z.object({
  organisationName: z.string().min(1, "Organisation name is required").max(200),
  organisationType: z.enum(orgTypeValues),
  contactName: z.string().min(1, "Contact person is required").max(120),
  contactEmail: z.email("Enter a valid email address"),
  contactPhone: z.string().min(7, "Enter a valid phone number").max(20),
  poReference: z.string().max(80).optional(),
  requirements: z.string().max(4000).optional(),
  items: z.array(quotationItemSchema).min(1, "Add at least one item to your quotation"),
});

export type QuotationInput = z.infer<typeof quotationSchema>;
