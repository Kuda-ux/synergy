import { describe, expect, it } from "vitest";
import { checkoutSchema } from "@/lib/validation/checkout";
import { quotationSchema } from "@/lib/validation/quotation";
import { trackOrderSchema } from "@/lib/validation/misc";

const validCheckout = {
  email: "customer@example.com",
  phone: "+263777000000",
  firstName: "Tino",
  lastName: "M",
  isInstitutional: false,
  deliveryMethod: "collection",
  paymentMethod: "pay_on_collection",
  country: "Zimbabwe",
  items: [{ productId: "abc", quantity: 2 }],
};

describe("checkout validation", () => {
  it("accepts a valid collection order", () => {
    expect(checkoutSchema.safeParse(validCheckout).success).toBe(true);
  });

  it("requires a delivery address for delivery orders", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, deliveryMethod: "harare_delivery" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join(".") === "deliveryAddress")).toBe(true);
    }
  });

  it("requires an organisation name for institutional purchases", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, isInstitutional: true });
    expect(result.success).toBe(false);
  });

  it("rejects empty carts and bad quantities", () => {
    expect(checkoutSchema.safeParse({ ...validCheckout, items: [] }).success).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...validCheckout, items: [{ productId: "abc", quantity: 0 }] }).success,
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...validCheckout, items: [{ productId: "abc", quantity: 2.5 }] }).success,
    ).toBe(false);
  });

  it("rejects unknown delivery and payment methods", () => {
    expect(checkoutSchema.safeParse({ ...validCheckout, deliveryMethod: "teleport" }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...validCheckout, paymentMethod: "iou" }).success).toBe(false);
  });
});

describe("quotation validation", () => {
  const valid = {
    organisationName: "Example High School",
    organisationType: "school",
    contactName: "T. Moyo",
    contactEmail: "head@example.sch.zw",
    contactPhone: "+263777000000",
    items: [{ description: "Robotics class pack", quantity: 2 }],
  };

  it("accepts a valid request", () => {
    expect(quotationSchema.safeParse(valid).success).toBe(true);
  });

  it("requires at least one item", () => {
    expect(quotationSchema.safeParse({ ...valid, items: [] }).success).toBe(false);
  });

  it("rejects invalid emails and org types", () => {
    expect(quotationSchema.safeParse({ ...valid, contactEmail: "not-an-email" }).success).toBe(false);
    expect(quotationSchema.safeParse({ ...valid, organisationType: "club" }).success).toBe(false);
  });
});

describe("track order validation", () => {
  it("validates order number and email", () => {
    expect(trackOrderSchema.safeParse({ orderNumber: "SD-260713-1234", email: "a@b.com" }).success).toBe(true);
    expect(trackOrderSchema.safeParse({ orderNumber: "SD", email: "a@b.com" }).success).toBe(false);
    expect(trackOrderSchema.safeParse({ orderNumber: "SD-260713-1234", email: "nope" }).success).toBe(false);
  });
});
