import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.email("Enter a valid email address"),
  source: z.string().max(60).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Your name is required").max(120),
  email: z.email("Enter a valid email address"),
  phone: z.string().max(20).optional(),
  subject: z.string().min(1, "A subject is required").max(160),
  message: z.string().min(10, "Tell us a little more (at least 10 characters)").max(4000),
});

export const trackOrderSchema = z.object({
  orderNumber: z.string().min(4, "Enter your order number").max(30),
  email: z.email("Enter the email used on the order"),
});
