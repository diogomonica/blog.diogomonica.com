import { defineConfig } from "astro/config";
import rehypeFigures from "./src/plugins/rehype-figures.ts";

export default defineConfig({
  site: "https://blog.diogomonica.com",
  trailingSlash: "always",
  output: "static",
  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
    rehypePlugins: [rehypeFigures],
  },
});
