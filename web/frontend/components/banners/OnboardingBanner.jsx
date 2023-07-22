import { Banner } from "@shopify/polaris";
import React, { useEffect, useState } from "react";

export default function OnboardingBanner({ setRun }) {
  const [active, setActive] = useState(true);
  useEffect(() => {
    try {
      if (localStorage.getItem("onboarding-banner") == "false")
        setActive(false);
    } catch (_error) {
      console.log("Third party cookies not supported");
    }
  });

  const handleDismiss = () => {
    setActive(false);
    try {
      localStorage.setItem("onboarding-banner", "false");
    } catch (_error) {
      console.log("Third party cookies not supported");
    }
  };

  return (
    <div style={{ display: active ? "inherit" : "none" }}>
      <Banner
        title="New to the app?"
        status="warning"
        onDismiss={handleDismiss}
        action={{ content: "Take a tour", onAction: () => setRun(true) }}
      >
        <p>
          If you're confused of how the app works, feel free to take a tour.
        </p>
      </Banner>
    </div>
  );
}
