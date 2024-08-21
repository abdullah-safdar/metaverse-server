import * as dotenv from "dotenv";
dotenv.config();

const config = {
  MONGO_URL: process.env.MONGO_URL || "",
  PORT_NUMBER: Number(process.env.PORT_NUMBER) || 10,
  MIX_PANEL_KEY: process.env.MIX_PANEL_KEY || "",
  CRYPTO_JS_KEY: process.env.CRYPTO_JS_KEY || "",
  CRYPTO_JS_IV: process.env.CRYPTO_JS_IV || "",
};

export { config };
