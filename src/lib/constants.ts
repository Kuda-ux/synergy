/** Central business constants, status unions and navigation config. */

export const SITE_NAME = "Synergy Dynamics";
export const SITE_TAGLINE =
  "Zimbabwe's Robotics, Electronics and Intelligent Systems Marketplace";
export const BRAND_MESSAGE =
  "Engineering the Future Through Robotics and Intelligent Systems.";

export const CONTACT = {
  phone: "+263 777 938 962",
  phoneHref: "tel:+263777938962",
  whatsappHref: "https://wa.me/263777938962",
  email: "info@synergydynamics.co.zw",
  emailHref: "mailto:info@synergydynamics.co.zw",
  address: {
    line1: "Shop F04, Upstairs",
    line2: "Park City Village Mall",
    line3: "26 Park Street",
    city: "Harare",
    country: "Zimbabwe",
  },
} as const;

export const PRODUCT_STATUSES = ["draft", "active", "archived", "preorder"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const ORDER_STATUSES = [
  "pending_payment",
  "payment_processing",
  "paid",
  "processing",
  "ready_for_collection",
  "dispatched",
  "delivered",
  "cancelled",
  "refunded",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Pending Payment",
  payment_processing: "Payment Processing",
  paid: "Paid",
  processing: "Processing",
  ready_for_collection: "Ready for Collection",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const QUOTATION_STATUSES = [
  "new",
  "under_review",
  "info_required",
  "quoted",
  "accepted",
  "rejected",
  "converted",
] as const;
export type QuotationStatus = (typeof QUOTATION_STATUSES)[number];

export const ORGANISATION_TYPES = [
  { value: "school", label: "School" },
  { value: "university", label: "University or College" },
  { value: "government", label: "Government Institution" },
  { value: "business", label: "Business / Company" },
  { value: "individual", label: "Individual / Bulk Buyer" },
] as const;
export type OrganisationType = (typeof ORGANISATION_TYPES)[number]["value"];

export const DELIVERY_METHODS = [
  {
    value: "collection",
    label: "Store Collection (Free)",
    description:
      "Collect from Shop F04, Upstairs, Park City Village Mall, 26 Park Street, Harare.",
  },
  {
    value: "harare_delivery",
    label: "Harare Local Delivery",
    description: "Delivery within Harare. Rate confirmed before dispatch.",
  },
  {
    value: "nationwide_courier",
    label: "Nationwide Courier",
    description: "Courier delivery across Zimbabwe. Rate confirmed before dispatch.",
  },
  {
    value: "international_quote",
    label: "International Shipping (Quotation)",
    description:
      "We will contact you with a shipping quotation before payment is finalised.",
  },
] as const;
export type DeliveryMethod = (typeof DELIVERY_METHODS)[number]["value"];

export const PAYMENT_METHODS = [
  {
    value: "paynow",
    label: "Paynow (EcoCash, OneMoney, Card)",
    description: "Pay securely via Paynow. Currently in test mode.",
  },
  {
    value: "bank_transfer",
    label: "Bank Transfer",
    description: "Banking details are sent with your order confirmation.",
  },
  {
    value: "pay_on_collection",
    label: "Pay on Collection (Cash / Card)",
    description: "Pay when you collect your order in-store in Harare.",
  },
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]["value"];

export const CURRENCIES = ["USD", "ZWG"] as const;
export type Currency = (typeof CURRENCIES)[number];

/** Primary storefront navigation. Category links resolve against DB-driven category slugs. */
export const MAIN_NAV = [
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Robotics", href: "/shop/robotics-kits" },
  { label: "Components", href: "/shop/electronic-components" },
  { label: "Microcontrollers", href: "/shop/development-boards" },
  { label: "Sensors & IoT", href: "/shop/sensors-modules" },
  { label: "STEM Education", href: "/shop/stem-education" },
  { label: "Automation", href: "/services" },
  { label: "Custom Projects", href: "/services#custom-projects" },
  { label: "Support", href: "/support" },
] as const;

export const SETTING_KEYS = {
  zwgPerUsd: "zwg_per_usd",
  zwgEnabled: "zwg_enabled",
  announcements: "announcements",
  storeHours: "store_hours",
} as const;
