/**
 * GraphQL Resolvers for Contact Form
 * 
 * This file contains the resolver functions for contact form mutations.
 * It handles form submissions and sends emails to the admin.
 */

import { sendContactFormEmail } from "../utils/emailService";

interface ContactFormInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const contactResolvers = {
  Mutation: {
    /**
     * submitContactForm Mutation
     * 
     * Handles contact form submissions from the website.
     * Validates the input and sends an email to the admin email address.
     * 
     * @param _ - Parent object (not used)
     * @param args - Contains the input object with form data
     * @returns ContactFormResponse with success status and message
     */
    submitContactForm: async (
      _: unknown,
      args: { input: ContactFormInput }
    ) => {
      try {
        const { firstName, lastName, email, phone, subject, message } =
          args.input;

        // Basic validation
        if (!firstName || !lastName || !email || !phone || !subject || !message) {
          throw new Error("All fields are required");
        }

        // Email validation (basic)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error("Invalid email address");
        }

        // Route emails based on subject:
        // - "University Partnership" -> partners@vedascholars.com
        // - All other inquiries -> enquiries@vedascholars.com
        let recipientEmail: string;
        if (subject.toLowerCase().includes("partnership")) {
          recipientEmail = process.env.PARTNERS_EMAIL || "partners@vedascholars.com";
        } else {
          recipientEmail = process.env.CONTACT_EMAIL || "enquiries@vedascholars.com";
        }

        await sendContactFormEmail(
          {
            firstName,
            lastName,
            email,
            phone,
            subject,
            message,
          },
          recipientEmail
        );

        return {
          success: true,
          message: "Your message has been sent successfully. We'll get back to you soon!",
        };
      } catch (error) {
        console.error("Error in submitContactForm:", error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to send message. Please try again later.",
        };
      }
    },
  },
};

