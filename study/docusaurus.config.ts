import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const baseUrl = process.env.STUDY_BASE ?? "/koodisampo/opiskelu/";

const config: Config = {
  title: "Koodisampo — opiskelumateriaali",
  tagline: "Tekniset oppitunnit aiheittain — erillään pelistä",
  favicon: "img/favicon.ico",
  url: "https://terotests.github.io",
  baseUrl,
  trailingSlash: true,
  organizationName: "terotests",
  projectName: "koodisampo",
  onBrokenLinks: "warn",
  markdown: {
    format: "md",
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },
  i18n: {
    defaultLocale: "fi",
    locales: ["fi"],
  },
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "docs",
          editUrl: "https://github.com/terotests/koodisampo/tree/main/study/docs/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: "Opiskelu",
      items: [
        {
          type: "docSidebar",
          sidebarId: "topicsSidebar",
          position: "left",
          label: "Aihepiirit",
        },
        {
          type: "doc",
          docId: "lyhenteet",
          position: "left",
          label: "Lyhenteet",
        },
        {
          href: "https://terotests.github.io/koodisampo/",
          label: "Peli",
          position: "right",
        },
        {
          href: "https://github.com/terotests/koodisampo",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Materiaali",
          items: [
            { label: "Aihepiirit", to: "/docs/intro" },
            { label: "Lyhenteet", to: "/docs/lyhenteet" },
          ],
        },
        {
          title: "Peli",
          items: [
            { label: "Corporate NetHack", href: "https://terotests.github.io/koodisampo/" },
          ],
        },
      ],
      copyright: `Koodisampo opiskelumateriaali — ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "cpp", "sql", "yaml", "docker"],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
