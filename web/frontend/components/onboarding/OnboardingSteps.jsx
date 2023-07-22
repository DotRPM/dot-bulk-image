import React from "react";
import ReactJoyride from "react-joyride";

function OnboardingSteps({ run }) {
  const steps = [
    {
      title: "Welcome to Pictimport!",
      target: "body",
      placement: "center",
      content: "Let's take a tour to find out how the app works",
      disableBeacon: true,
    },
    {
      title: "Let's import some images first",
      target:
        "#AppFrameMain > div > div > div:nth-child(4) > div > div:nth-child(4) > div > div:nth-child(3) > button",
      content: "Click on this button to import multiple images at a time.",
      spotlightClicks: true,
    },
    {
      title: "This is your image palette",
      target:
        "#AppFrameMain > div > div > div:nth-child(4) > div > div.Polaris-LegacyCard__Section.Polaris-LegacyCard__Section--flush > div > div > div > div",
      content:
        "The image palette stores the images which need to be imported to products.",
    },
    {
      title: "Navigate to the product",
      target:
        "#AppFrameMain > div > div > div:nth-child(3) > div > div.Polaris-LegacyCard__Section.Polaris-LegacyCard__Section--flush > div",
      content: "Scroll throught the products list to find the relevant product",
      spotlightClicks: true,
    },
    {
      title: "Page navigation",
      target:
        "#AppFrameMain > div > div > div:nth-child(3) > div > div:nth-child(3)",
      content:
        "Use the page navigation if required. Each page shows 15 products at a time.",
      spotlightClicks: true,
    },
    {
      title: "Drag and drop",
      target:
        "#AppFrameMain > div > div > div:nth-child(4) > div > div.Polaris-LegacyCard__Section.Polaris-LegacyCard__Section--flush > div > div > div > div > div:nth-child(1) > div > span",
      content: "Now drag and drop an image to the corresponding product.",
      spotlightClicks: true,
    },
    {
      title: "Cut or copy",
      target:
        "#AppFrameMain > div > div > div:nth-child(4) > div > div:nth-child(3)",
      content: "Check this box if you want to remove already assigned images",
      spotlightClicks: true,
    },
    {
      title: "Finally, click save",
      target:
        "#AppFrameMain > div > div > div:nth-child(3) > div > div:nth-child(4) > div > div:nth-child(2) > button",
      content: "Click save to update the products with assigned images.",
      spotlightClicks: true,
    },
  ];

  return (
    <ReactJoyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
    />
  );
}

export default OnboardingSteps;
