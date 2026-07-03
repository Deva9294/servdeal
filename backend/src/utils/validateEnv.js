/**
 * Environment Variables Validator
 * Ensures all critical environment variables are set on server startup
 */

export const validateEnvironment = () => {
  const requiredEnvVars = [
    'NODE_ENV',
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'CLIENT_URL',
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.error('❌ CRITICAL: Missing required environment variables:');
    missingEnvVars.forEach(envVar => {
      console.error(`   - ${envVar}`);
    });
    console.error('\nPlease set these variables before starting the server.');
    process.exit(1);
  }

  // Validate URL formats
  try {
    new URL(process.env.SERVER_URL || 'http://localhost:5000');
  } catch {
    console.error('❌ Invalid SERVER_URL format');
    process.exit(1);
  }

  const clientUrls = process.env.CLIENT_URL.split(',').map(url => url.trim());
  for (const url of clientUrls) {
    try {
      new URL(url);
    } catch {
      console.error(`❌ Invalid CLIENT_URL format: ${url}`);
      process.exit(1);
    }
  }

  // Warn about missing optional but recommended env vars
  const recommendedEnvVars = [
    'JWT_EXPIRE',
    'JWT_REFRESH_EXPIRE',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS',
  ];

  const missingRecommended = recommendedEnvVars.filter(envVar => !process.env[envVar]);
  if (missingRecommended.length > 0) {
    console.warn('⚠️  Missing recommended environment variables:');
    missingRecommended.forEach(envVar => {
      console.warn(`   - ${envVar}`);
    });
  }

  console.log('✅ Environment validation passed');
};
