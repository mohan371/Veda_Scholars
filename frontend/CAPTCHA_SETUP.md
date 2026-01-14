# CAPTCHA Setup Guide

This project uses Google reCAPTCHA v2 for form protection. All forms now include CAPTCHA verification.

## Setup Instructions

### 1. Get Google reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "Create" to register a new site
3. Fill in the form:
   - **Label**: Veda Scholars (or your preferred name)
   - **reCAPTCHA type**: Select "reCAPTCHA v2" → "I'm not a robot" Checkbox
   - **Domains**: Add your domains:
     - `localhost` (for development)
     - `vedascholars.com` (your production domain)
     - `www.vedascholars.com` (if using www)
   - Accept the reCAPTCHA Terms of Service
4. Click "Submit"
5. Copy your **Site Key** and **Secret Key**

### 2. Add Environment Variables

Add the following to your `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
```

**Note**: Only the Site Key is needed in the frontend. The Secret Key should be kept on the backend for server-side verification.

### 3. Backend Verification (Optional but Recommended)

For complete security, verify the CAPTCHA token on the backend before processing form submissions. You'll need to:

1. Install a reCAPTCHA verification library on the backend
2. Verify the token using your Secret Key
3. Only process the form if verification succeeds

## Forms with CAPTCHA

The following forms now include CAPTCHA:

1. ✅ **Contact Form** (`/get-in-touch`) - Active form with CAPTCHA
2. ✅ **Contact Form** (Commented out version) - CAPTCHA included in commented code
3. ✅ **Authentication Form** (`/auth/login`, `/auth/signup`) - Login and Signup
4. ✅ **Profile Form** (`/profile`) - User profile updates
5. ✅ **Job Application Form** (`/jobs/[id]/apply`) - Job applications

## How It Works

1. User fills out the form
2. User completes the CAPTCHA challenge
3. CAPTCHA generates a token
4. Form submission is disabled until CAPTCHA is completed
5. Token is included with form submission (can be verified on backend)

## Testing

- **Development**: Use `localhost` in your reCAPTCHA domain list
- **Production**: Add your production domain to reCAPTCHA settings
- **Test Keys**: Google provides test keys for development (check reCAPTCHA documentation)

## Troubleshooting

- **CAPTCHA not showing**: Check that `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set correctly
- **CAPTCHA errors**: Verify your domain is added to reCAPTCHA settings
- **Console warnings**: The component will show a warning if the site key is missing but won't break the form

