# =================================================================
# DATENBANK
# =================================================================
# PostgreSQL Verbindungs-URL
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"

# =================================================================
# E-MAIL KONFIGURATION
# =================================================================
# SMTP Server Einstellungen
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-specific-password"
SMTP_SECURE="true"  # true für SSL/TLS

# Absender E-Mail-Adresse
MAIL_FROM="noreply@yourcompany.com"
MAIL_FROM_NAME="Your Company Name"

# =================================================================
# VERSANDDIENSTLEISTER API KEYS
# =================================================================
# Deutsche Post DHL
DHL_API_KEY="your-dhl-api-key"
DHL_API_SECRET="your-dhl-api-secret"
DHL_ACCOUNT_NUMBER="your-dhl-account-number"

# Hermes
HERMES_API_KEY="your-hermes-api-key"
HERMES_USER_ID="your-hermes-user-id"

# DPD
DPD_API_KEY="your-dpd-api-key"
DPD_CUSTOMER_NUMBER="your-dpd-customer-number"

# GLS
GLS_API_KEY="your-gls-api-key"
GLS_CUSTOMER_ID="your-gls-customer-id"

# Internationale Versanddienstleister
UPS_API_KEY="your-ups-api-key"
UPS_USER_ID="your-ups-user-id"
UPS_PASSWORD="your-ups-password"

FEDEX_API_KEY="your-fedex-api-key"
FEDEX_ACCOUNT_NUMBER="your-fedex-account-number"

TNT_API_KEY="your-tnt-api-key"
TNT_ACCOUNT_NUMBER="your-tnt-account-number"

# =================================================================
# BENACHRICHTIGUNGSDIENSTE
# =================================================================
# SMS (Twilio)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+491234567890"

# E-Mail (SendGrid)
SENDGRID_API_KEY="your-sendgrid-api-key"

# Push-Benachrichtigungen (Web Push)
VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"
VAPID_SUBJECT="mailto:your-email@yourcompany.com"

# WhatsApp Business API
WHATSAPP_API_KEY="your-whatsapp-api-key"
WHATSAPP_PHONE_NUMBER_ID="your-whatsapp-phone-number-id"

# =================================================================
# AUTHENTIFIZIERUNG & SICHERHEIT
# =================================================================
# NextAuth.js Konfiguration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-at-least-32-chars"

# JWT
JWT_SECRET="your-jwt-secret-at-least-32-chars"
JWT_EXPIRY="24h"

# =================================================================
# EXTERNE DIENSTE
# =================================================================
# Stripe (Zahlungen)
STRIPE_PUBLIC_KEY="your-stripe-public-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# AWS S3 (Dateispeicherung)
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_REGION="eu-central-1"
AWS_BUCKET_NAME="your-bucket-name"

# =================================================================
# ANWENDUNGSKONFIGURATION
# =================================================================
# Umgebung
NODE_ENV="development"  # oder "production"

# API Limits
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW_MS="900000"  # 15 Minuten in Millisekunden

# Cache
REDIS_URL="redis://username:password@localhost:6379"

# Logging
LOG_LEVEL="debug"  # debug, info, warn, error

# =================================================================
# FEATURE FLAGS
# =================================================================
ENABLE_WHATSAPP_NOTIFICATIONS="true"
ENABLE_SMS_NOTIFICATIONS="true"
ENABLE_PUSH_NOTIFICATIONS="true"
ENABLE_INTERNATIONAL_SHIPPING="true"