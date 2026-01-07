import { useEffect } from "react";

const BASE_URL = "https://elevatedaiworks.com";
const DEFAULT_OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/8omeehSKGzaB0sqOksu4uS6fUQ02/social-images/social-1767595579281-favicon-512x512.png";

interface PageMetaProps {
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
}

const setMetaTag = (attribute: "name" | "property", key: string, content: string) => {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const setCanonicalLink = (href: string) => {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

const buildUrl = (path: string) => {
  if (path === "/") {
    return BASE_URL;
  }
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const PageMeta = ({ title, description, canonicalPath, image }: PageMetaProps) => {
  useEffect(() => {
    const url = buildUrl(canonicalPath);
    const ogImage = image ?? DEFAULT_OG_IMAGE;

    document.title = title;
    setMetaTag("name", "description", description);
    setCanonicalLink(url);

    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", url);
    setMetaTag("property", "og:image", ogImage);

    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:url", url);
    setMetaTag("name", "twitter:image", ogImage);
  }, [canonicalPath, description, image, title]);

  return null;
};
