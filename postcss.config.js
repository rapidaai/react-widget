const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./src/**/*.tsx", "./public/index.html"],
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    // require("postcss-obfuscator")({
    //   enable: true, // Enable plugin
    // }),
  ],
};
