import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import compress from "astro-compress";

export default defineConfig({
  site: "https://tomycell.com",
  integrations: [sitemap(), compress()],
});
