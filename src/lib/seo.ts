import { CONTACT, SITE_NAME, SITE_TAGLINE } from "./constants";
import type { ProductDetailData } from "./catalog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function organisationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/brand/logo.jpeg`,
    image: `${siteUrl}/brand/logo.jpeg`,
    description: SITE_TAGLINE,
    email: CONTACT.email,
    telephone: CONTACT.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${CONTACT.address.line1}, ${CONTACT.address.line2}, ${CONTACT.address.line3}`,
      addressLocality: CONTACT.address.city,
      addressCountry: "ZW",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT.phone,
      contactType: "customer service",
      areaServed: "ZW",
      availableLanguage: "English",
    },
    sameAs: [CONTACT.whatsappHref],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_TAGLINE,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/brand/logo.jpeg`,
    image: `${siteUrl}/brand/logo.jpeg`,
    description: SITE_TAGLINE,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    priceRange: "$$",
    currenciesAccepted: "USD, ZWG",
    paymentAccepted: "Cash, Card, EcoCash, Bank Transfer",
    areaServed: {
      "@type": "Country",
      name: "Zimbabwe",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: `${CONTACT.address.line1}, ${CONTACT.address.line2}, ${CONTACT.address.line3}`,
      addressLocality: CONTACT.address.city,
      addressCountry: "ZW",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -17.8292,
      longitude: 31.0522,
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "17:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "13:00" },
    ],
  };
}

export function productJsonLd(product: ProductDetailData, path: string) {
  const images = product.images
    .filter((img) => !img.url.startsWith("placeholder:"))
    .map((img) => (img.url.startsWith("/") ? `${siteUrl}${img.url}` : img.url));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.shortDescription,
    brand: { "@type": "Brand", name: product.brand.name },
    url: `${siteUrl}${path}`,
    ...(images.length > 0 && { image: images }),
    category: product.category?.name,
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
      seller: { "@type": "Organization", name: SITE_NAME },
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "ZW" },
      },
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
