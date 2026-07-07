import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";

const MetaData = ({ title, description, keywords, image, url }) => {
  const siteName = "Samridhi Enterprises";
  const defaultTitle = `${siteName} - Premium Bike Parts & Accessories`;
  const defaultDescription =
    "Your one-stop shop for premium motorcycle spare parts, accessories, and riding gear. Genuine products, fast shipping across India.";
  const defaultKeywords =
    "Samridhi Enterprises, bike parts, motorcycle spare parts, auto parts, bike accessories, motorcycle accessories, two-wheeler parts, bike spare parts India";

  return (
    <Helmet>
      <title>{title || defaultTitle}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
    </Helmet>
  );
};

MetaData.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
};

export default MetaData;
