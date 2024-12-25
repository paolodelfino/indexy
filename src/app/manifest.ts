import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Indexy",
    short_name: "Indexy",
    description: "",
    display: "browser",
    start_url: "/",
    scope: "/",
    orientation: "portrait-primary",
    background_color: "black",
    theme_color: "black",
    icons: [
      {
        src: "/manifest-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/manifest-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
