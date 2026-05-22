"use client";

import { useEffect } from "react";

type ReviewsWidgetProps = {
  widgetId: string;
};

const SCRIPT_ID = "featurable-bundle-script";

export default function ReviewsWidget({ widgetId }: ReviewsWidgetProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://featurable.com/assets/bundle.js";
    script.async = true;
    script.charset = "UTF-8";
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div
      id={widgetId}
      data-featurable-async=""
    />
  );
}