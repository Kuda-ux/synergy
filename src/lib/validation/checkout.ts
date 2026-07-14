import { z } from "zod";
import { DELIVERY_METHODS, PAYMENT_METHODS } from "../constants";

const deliveryValues = DELIVERY_METHODS.map((d) => d.value) as [string, ...string[]];
const paymentValues = PAYMENT_METHODS.map((p) => p.value) as [string, ...string[]];

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  email: z.email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number").max(20),
  firstName: z.string().min(1, "First name is required").max(80),
  lastName: z.string().min(1, "Last name is required").max(80),
  isInstitutional: z.boolean().default(false),
  company: z.string().max(160).optional(),
  poReference: z.string().max(80).optional(),
  deliveryMethod: z.enum(deliveryValues),
  deliveryAddress: z.string().max(400).optional(),
  city: z.string().max(80).optional(),
  country: z.string().max(80).default("Zimbabwe"),
  deliveryNotes: z.string().max(500).optional(),
  customerNotes: z.string().max(1000).optional(),
  paymentMethod: z.enum(paymentValues),
  items: z.array(checkoutItemSchema).min(1, "Your cart is empty"),
}).superRefine((data, ctx) => {
  if (data.deliveryMethod !== "collection" && !data.deliveryAddress?.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["deliveryAddress"],
      message: "A delivery address is required for delivery orders",
    });
  }
  if (data.isInstitutional && !data.company?.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["company"],
      message: "Organisation name is required for institutional purchases",
    });
  }
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
