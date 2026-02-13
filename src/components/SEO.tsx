import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({
  title = "Mentawai Shores - Find Your Dream Property in Mentawai Islands",
  description = "Discover exclusive properties for sale and rent across the beautiful Mentawai Islands. Beachfront land, eco-villas, and tropical properties in Indonesia's pristine archipelago.",
  keywords = "mentawai property, mentawai real estate, mentawai land for sale, mentawai villa, indonesia property, surf property mentawai, beachfront property, tropical property",
  image = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop",
  url = "https://mentawaishores.com",
  type = "website",
}: SEOProps) => {
  const siteTitle = title.includes("Mentawai Shores") ? title : `${title} | Mentawai Shores`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Mentawai Shores" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="ID-SB" />
      <meta name="geo.placename" content="Mentawai Islands" />
      <meta name="geo.position" content="-2.0855;99.6506" />
      <meta name="ICBM" content="-2.0855, 99.6506" />
    </Helmet>
  );
};

export default SEO;
