import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/lib/catalog";

export const runtime = "nodejs";
export const alt = "Synergy Robotics product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function formatPrice(cents: number) {
  return `US$${(cents / 100).toFixed(2)}`;
}

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function fetchAsBase64(path: string): Promise<string | null> {
  try {
    const url = `${getBaseUrl()}${path}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const ext = path.split(".").pop()?.toLowerCase() ?? "png";
    let mime = `image/${ext}`;
    if (ext === "jpg" || ext === "jpeg") mime = "image/jpeg";
    if (ext === "svg") mime = "image/svg+xml";
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ category: string; product: string }> }) {
  const { product: slug } = await params;
  const product = await getProductBySlug(slug);

  const brandName = "Synergy Robotics";
  const tagline = "Zimbabwe's Robotics, Electronics & Intelligent Systems Marketplace";

  let productImgSrc: string | null = null;
  if (product) {
    const realImage = product.images.find((img) => !img.url.startsWith("placeholder:"));
    if (realImage) {
      productImgSrc = await fetchAsBase64(realImage.url);
    }
  }
  const logoSrc = await fetchAsBase64("/brand/logo.jpeg");

  const price = product ? formatPrice(product.priceUsdCents) : "";
  const name = product ? product.name : "Product";
  const sku = product ? product.sku : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0b0b0f 0%, #1a0f14 50%, #2a1420 100%)",
          color: "#f4f5f7",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circuit-grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.08,
            backgroundImage:
              "linear-gradient(to right, rgba(162,67,126,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(162,67,126,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Magenta glows */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "rgba(162,67,126,0.28)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -160,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: "rgba(118,39,87,0.22)",
            filter: "blur(100px)",
          }}
        />

        {/* Header bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 40px",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {logoSrc ? (
              <img
                src={logoSrc}
                alt="Synergy Robotics logo"
                width={48}
                height={48}
                style={{ borderRadius: 12, objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#a2437e" }} />
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>{brandName}</span>
              <span style={{ fontSize: 12, color: "#dc9cc1", textTransform: "uppercase", letterSpacing: 1.5 }}>
                {tagline}
              </span>
            </div>
          </div>
          <span
            style={{
              fontSize: 14,
              color: "#a2437e",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            Shop Now
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            padding: "0 40px 40px",
            gap: 40,
            zIndex: 2,
          }}
        >
          {/* Product image */}
          <div
            style={{
              width: 420,
              height: 420,
              borderRadius: 24,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(162,67,126,0.25)",
              boxShadow: "0 24px 80px -24px rgba(162,67,126,0.35)",
            }}
          >
            {productImgSrc ? (
              <img src={productImgSrc} alt={name} width={420} height={420} style={{ objectFit: "cover" }} />
            ) : (
              <div style={{ color: "#a2437e", fontSize: 18, fontWeight: 600 }}>Product Image</div>
            )}
          </div>

          {/* Text block */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              gap: 16,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "#dc9cc1",
                textTransform: "uppercase",
                letterSpacing: 2,
                fontWeight: 600,
              }}
            >
              {sku ? `SKU: ${sku}` : "In Stock"}
            </span>
            <h1
              style={{
                fontSize: 44,
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: -1,
                margin: 0,
                maxWidth: 620,
              }}
            >
              {name}
            </h1>
            <p
              style={{
                fontSize: 18,
                color: "#a2a2ad",
                lineHeight: 1.5,
                margin: 0,
                maxWidth: 600,
              }}
            >
              {product?.shortDescription ?? "Quality robotics and electronics components delivered across Zimbabwe."}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 8 }}>
              {price && (
                <span
                  style={{
                    fontSize: 42,
                    fontWeight: 800,
                    color: "#f4f5f7",
                  }}
                >
                  {price}
                </span>
              )}
              <span
                style={{
                  fontSize: 16,
                  color: "#4cc38a",
                  background: "rgba(76,195,138,0.12)",
                  padding: "8px 14px",
                  borderRadius: 9999,
                  fontWeight: 600,
                }}
              >
                In Stock
              </span>
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 14,
                color: "#85858f",
              }}
            >
              Tap the link to buy on synergyrobotics.co.zw
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
