import { useEffect } from "react";

const SCHEMA_ID = "local-business-schema";

export const LocalBusinessSchema = () => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "Elevated AI Works",
      url: "https://elevatedaiworks.com",
      areaServed: ["Colorado Springs, CO", "Colorado"],
      sameAs: [
        "https://www.linkedin.com/company/elevatedaiworks",
        "https://www.instagram.com/elevatedaiworks/",
        "https://www.facebook.com/share/1812Qn1Mxh/?mibextid=wwXIfr",
      ],
    };

    let script = document.getElementById(SCHEMA_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = SCHEMA_ID;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      script?.remove();
    };
  }, []);

  return null;
};
