const MANDATORY = [
  "MONGODB_URL",
  "JWT_SECRET",
  "JWT_EXPIRE",
  "COOKIE_EXPIRE",
  "CLOUDINARY_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const PRODUCTION_REQUIRED = [
  "BREVO_API_KEY",
  "FRONTEND_URL",
];

const OPTIONAL = [
  "PORT",
  "FRONTEND_WWW_URL",
  "NODE_ENV",
  "SENDER_EMAIL",
  "SENDER_NAME",
  "OTP_MODE",
  "LOGIN_MAX_ATTEMPTS",
  "LOGIN_LOCK_MINUTES",
  "FORGOT_PASSWORD_MAX_ATTEMPTS",
  "FORGOT_PASSWORD_LOCK_MINUTES",
  "TRUST_PROXY",
];

const validateEnv = () => {
  const missing = MANDATORY.filter((key) => !process.env[key]);
  const isProduction = process.env.NODE_ENV === "production";

  if (missing.length > 0) {
    console.error("\n\x1b[31m[ENV] Missing required environment variables:\x1b[0m");
    missing.forEach((key) => console.error(`  \x1b[31m✗\x1b[0m ${key}`));
    console.error("\nServer cannot start without these. Check your .env file.\n");
    process.exit(1);
  }

  if (isProduction) {
    const missingProd = PRODUCTION_REQUIRED.filter((key) => !process.env[key]);
    if (missingProd.length > 0) {
      console.error("\n\x1b[31m[ENV] Production requires these additional variables:\x1b[0m");
      missingProd.forEach((key) => console.error(`  \x1b[31m✗\x1b[0m ${key}`));
      console.error("");
      process.exit(1);
    }
  }

  const unset = OPTIONAL.filter((key) => !process.env[key]);
  if (unset.length > 0) {
    const label = isProduction ? "\x1b[33m[ENV] Optional (defaults used):\x1b[0m" : "\x1b[33m[ENV] Optional variables not set (defaults will be used):\x1b[0m";
    console.warn(`\n${label}`);
    unset.forEach((key) => console.warn(`  \x1b[33m⚠\x1b[0m ${key}`));
    console.warn("");
  }

  console.log("\x1b[32m[ENV] All required variables present ✓\x1b[0m");
};

export default validateEnv;
