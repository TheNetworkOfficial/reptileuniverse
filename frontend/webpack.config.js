const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    main: "./src/main.js",
    index: "./src/pages/index/index.js",
    admin: "./src/pages/admin/admin.js",
    forgotPassword: "./src/pages/forgotPassword/forgotPassword.js",
    forgotUsername: "./src/pages/forgotUsername/forgotUsername.js",
    login: "./src/pages/login/login.js",
    registration: "./src/pages/registration/registration.js",
    resetPassword: "./src/pages/resetPassword/resetPassword.js",
    list: "./src/pages/list/list.js",
    details: "./src/pages/details/details.js",
    adoptionForm: "./src/pages/adoptionForm/adoptionForm.js",
    confirmation: "./src/pages/confirmation/confirmation.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "scripts/[name].[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|jpg|gif|mp4)$/,
        type: "asset/resource", // Use Webpack's built-in asset handling
        generator: {
          filename: "assets/[name][ext]", // Output files to 'assets' folder
        },
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
    }),
    new HtmlWebpackPlugin({
      template: "./src/components/header/header.html",
      filename: "header.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/components/footer/footer.html",
      filename: "footer.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/pages/index/index.html",
      filename: "index.html",
      chunks: ["main", "index"],
      favicon: "./src/assets/images/icons/reptileUniverseLogo1.png",
    }),
    new HtmlWebpackPlugin({
      template: "./src/pages/admin/admin.html",
      filename: "admin.html",
      chunks: ["main", "admin"],
      favicon: "./src/assets/images/icons/reptileUniverseLogo1.png",
    }),    
    new HtmlWebpackPlugin({
      template: "./src/pages/forgotPassword/forgotPassword.html",
      filename: "forgotPassword.html",
      chunks: ["main", "forgotPassword"],
      favicon: "./src/assets/images/icons/reptileUniverseLogo1.png",
    }),
    new HtmlWebpackPlugin({
      template: "./src/pages/forgotUsername/forgotUsername.html",
      filename: "forgotUsername.html",
      chunks: ["main", "forgotUsername"],
      favicon: "./src/assets/images/icons/reptileUniverseLogo1.png",
    }),
    new HtmlWebpackPlugin({
      template: "./src/pages/login/login.html",
      filename: "login.html",
      chunks: ["main", "login"],
      favicon: "./src/assets/images/icons/reptileUniverseLogo1.png",
    }),
    new HtmlWebpackPlugin({
      template: "./src/pages/registration/registration.html",
      filename: "registration.html",
      chunks: ["main", "registration"],
      favicon: "./src/assets/images/icons/reptileUniverseLogo1.png",
    }),
    new HtmlWebpackPlugin({
      template: "./src/pages/resetPassword/resetPassword.html",
      filename: "resetPassword.html",
      chunks: ["main", "resetPassword"],
      favicon: "./src/assets/images/icons/reptileUniverseLogo1.png",
    }),
    new HtmlWebpackPlugin({
      template: "./src/pages/list/list.html",
      filename: "list.html",
      chunks: ["main", "list"],
      favicon: "./src/assets/images/icons/reptileUniverseLogo1.png",
    }),
    new HtmlWebpackPlugin({
      template: "./src/pages/details/details.html",
      filename: "details.html",
      chunks: ["main", "details"],
      favicon: "./src/assets/images/icons/reptileUniverseLogo1.png",
    }),
    new HtmlWebpackPlugin({
      template: "./src/pages/adoptionForm/adoptionForm.html",
      filename: "adoptionForm.html",
      chunks: ["main", "adoptionForm"],
      favicon: "./src/assets/images/icons/reptileUniverseLogo1.png",
    }),
        new HtmlWebpackPlugin({
      template: "./src/pages/confirmation/confirmation.html",
      filename: "confirmation.html",
      chunks: ["main", "confirmation"],
      favicon: "./src/assets/images/icons/reptileUniverseLogo1.png",
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/popups/character-creation-popup.html',
      filename: 'character-creation-popup.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/popups/admin-add-skill-popup.html',
      filename: 'admin-add-skill-popup.html'
    }),
  ],
  devServer: {
    proxy: [
      {
        context: ['/api', '/graphql'],   // URLs to forward
        target: 'http://localhost:3000',  // your backend
        changeOrigin: true,               // host header rewrite
        secure: false,                    // if you're using self-signed certs
      },
    ],
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    allowedHosts: "all",  // ⬅️ this lets any hostname (including ngrok) through
  },
};

console.log("Webpack output path:", path.resolve(__dirname, "dist"));
console.log("Entry points:", module.exports.entry);
