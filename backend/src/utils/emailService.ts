import nodemailer from 'nodemailer';

// Create a transporter using environment variables
// If credentials are not provided, it will fail gracefully or log to console
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendOTP = async (email: string, otp: string) => {
    try {
        // Check if credentials are set, otherwise log for dev
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('==================================================');
            console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
            console.log('==================================================');
            return;
        }

        const mailOptions = {
            from: process.env.SMTP_FROM || '"Veda Scholars" <noreply@vedascholars.com>',
            to: email,
            subject: 'Your Verification Code - Veda Scholars',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p>Thank you for signing up with Veda Scholars. Please use the following OTP to verify your email address:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="color: #D4AF37; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // In production, you might want to throw this error or handle it differently
        // For now, we log it so the flow doesn't break completely if email fails
        throw new Error('Failed to send verification email');
    }
};

/**
 * Sends a contact form submission email to the admin
 * @param formData - Contact form data including name, email, phone, subject, and message
 * @param recipientEmail - Email address where the form submission should be sent
 *                        - Defaults to enquiries@vedascholars.com for general inquiries
 *                        - Routes to partners@vedascholars.com for partnership inquiries
 */
export const sendContactFormEmail = async (
    formData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        subject: string;
        message: string;
    },
    recipientEmail: string = 'enquiries@vedascholars.com'
) => {
    try {
        // Check if credentials are set, otherwise log for dev
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('==================================================');
            console.log('[DEV MODE] Contact Form Submission:');
            console.log('From:', formData.email);
            console.log('Name:', `${formData.firstName} ${formData.lastName}`);
            console.log('Phone:', formData.phone);
            console.log('Subject:', formData.subject);
            console.log('Message:', formData.message);
            console.log('==================================================');
            return { success: true, message: 'Email logged (dev mode)' };
        }

        // Create a descriptive email subject
        const emailSubject = `[Veda Scholars] ${formData.subject} - From ${formData.firstName} ${formData.lastName}`;

        const mailOptions = {
            from: process.env.SMTP_FROM || '"Veda Scholars Contact Form" <noreply@vedascholars.com>',
            to: recipientEmail,
            replyTo: formData.email, // Allow replying directly to the user
            subject: emailSubject,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #050939; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #050939; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            <p><strong>Subject:</strong> ${formData.subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #D4AF37; margin: 20px 0;">
            <h3 style="color: #050939; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${formData.message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This email was sent from the Veda Scholars website contact form.</p>
            <p>You can reply directly to this email to respond to ${formData.firstName}.</p>
          </div>
        </div>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Contact form email sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending contact form email:', error);
        throw new Error('Failed to send contact form email');
    }
};
