/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://colombiatours97.hu",
  generateRobotsTxt: true,
  // optional
  generateIndexSitemap: false,
  exclude: ["/login", "/dashboard/*"],
  // optional
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://colombiatours97.hu/server-sitemap.xml", // If you have additional sitemaps
    ],
  },
};
