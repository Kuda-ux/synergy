import { CONTACT, SITE_NAME } from "./constants";
import type { ProductDetailData } from "./catalog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function organisationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    email: CONTACT.email,
    telephone: CONTACT.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${CONTACT.address.line1}, ${CONTACT.address.line2}, ${CONTACT.address.line3}`,
      addressLocality: CONTACT.address.city,
      addressCountry: "ZW",
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: SITE_NAME,
    url: siteUrl,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${CONTACT.address.line1}, ${CONTACT.address.line2}, ${CONTACT.address.line3}`,
      addressLocality: CONTACT.address.city,
      addressCountry: "ZW",
    },
  };
}

export function productJsonLd(product: ProductDetailData, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.shortDescription,
    brand: { "@type": "Brand", name: product.brand.name },
    url: `${siteUrl}${path}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: (product.priceUsdCents / 100).toFixed(2),
      availability:
        product.status === "preorder"
          ? "https://schema.org/PreOrder"
          : product.stockQty > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      url: `${siteUrl}${path}`,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
