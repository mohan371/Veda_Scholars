"use client";

import { useState, useEffect } from "react";
import { X, Mail, Phone, User, MessageSquare, Target } from "lucide-react";
import { client } from "../../lib/apollo-client";
import { useNotification } from "./NotificationProvider";
import { gql } from "@apollo/client";

const SUBMIT_CONTACT_FORM = gql`
  mutation SubmitContactForm($input: ContactFormInput!) {
    submitContactForm(input: $input) {
      success
      message
    }
  }
`;

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    reason: "",
    lookingFor: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.reason ||
      !formData.lookingFor
    ) {
      showNotification("error", "Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the message with reason and looking for
      const message = `Reason for visiting: ${formData.reason}\n\nWhat they're looking for: ${formData.lookingFor}`;

      const { data } = await client.mutate({
        mutation: SUBMIT_CONTACT_FORM,
        variables: {
          input: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            subject: "Welcome Modal - New Visitor Inquiry",
            message: message,
          },
        },
      });

      if (data?.submitContactForm?.success) {
        showNotification("success", "Thank you! We'll get back to you soon.");
        // Mark as submitted in this session and close
        // Using sessionStorage so it resets on new browser session
        sessionStorage.setItem("welcomeModalSubmitted", "true");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          reason: "",
          lookingFor: "",
        });
        onClose();
      } else {
        showNotification(
          "error",
          data?.submitContactForm?.message || "Failed to send message"
        );
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      showNotification(
        "error",
        error?.message || "Failed to send message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto z-10 animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] px-6 py-4 rounded-t-2xl flex items-center justify-between border-b-2 border-[var(--gold)]/30">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Welcome to Veda Scholars!
            </h2>
            <p className="text-white/80 text-sm mt-1">
              We'd love to know more about you
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 group">
              <label
                htmlFor="firstName"
                className="flex items-center gap-2 text-sm font-medium text-[var(--blue-dark)] group-focus-within:text-[var(--gold)] transition-colors"
              >
                <User size={16} />
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full bg-[var(--blue-medium-dark)]/5 border-2 border-[var(--blue-medium-dark)]/30 rounded-lg px-4 py-3 text-[var(--blue-darkest)] focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all placeholder:text-[var(--blue-medium)]/50"
                placeholder="John"
              />
            </div>

            <div className="space-y-2 group">
              <label
                htmlFor="lastName"
                className="flex items-center gap-2 text-sm font-medium text-[var(--blue-dark)] group-focus-within:text-[var(--gold)] transition-colors"
              >
                <User size={16} />
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full bg-[var(--blue-medium-dark)]/5 border-2 border-[var(--blue-medium-dark)]/30 rounded-lg px-4 py-3 text-[var(--blue-darkest)] focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all placeholder:text-[var(--blue-medium)]/50"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2 group">
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-medium text-[var(--blue-dark)] group-focus-within:text-[var(--gold)] transition-colors"
            >
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full bg-[var(--blue-medium-dark)]/5 border-2 border-[var(--blue-medium-dark)]/30 rounded-lg px-4 py-3 text-[var(--blue-darkest)] focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all placeholder:text-[var(--blue-medium)]/50"
              placeholder="john.doe@example.com"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2 group">
            <label
              htmlFor="phone"
              className="flex items-center gap-2 text-sm font-medium text-[var(--blue-dark)] group-focus-within:text-[var(--gold)] transition-colors"
            >
              <Phone size={16} />
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full bg-[var(--blue-medium-dark)]/5 border-2 border-[var(--blue-medium-dark)]/30 rounded-lg px-4 py-3 text-[var(--blue-darkest)] focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all placeholder:text-[var(--blue-medium)]/50"
              placeholder="+91 7708722334"
            />
          </div>

          {/* Reason for Visiting */}
          <div className="space-y-2 group">
            <label
              htmlFor="reason"
              className="flex items-center gap-2 text-sm font-medium text-[var(--blue-dark)] group-focus-within:text-[var(--gold)] transition-colors"
            >
              <Target size={16} />
              What brings you to Veda Scholars today?
            </label>
            <select
              id="reason"
              value={formData.reason}
              onChange={handleInputChange}
              required
              className="w-full bg-[var(--blue-medium-dark)]/5 border-2 border-[var(--blue-medium-dark)]/30 rounded-lg px-4 py-3 text-[var(--blue-darkest)] focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all cursor-pointer [&>option]:bg-white [&>option]:text-[var(--blue-darkest)]"
            >
              <option value="">Select a reason</option>
              <option value="Looking for study abroad opportunities">
                Looking for study abroad opportunities
              </option>
              <option value="Seeking career/job opportunities">
                Seeking career/job opportunities
              </option>
              <option value="Interested in university partnerships">
                Interested in university partnerships
              </option>
              <option value="Need counseling/guidance">
                Need counseling/guidance
              </option>
              <option value="Skill development support">
                Skill development support
              </option>
              <option value="Just browsing/exploring">
                Just browsing/exploring
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* What are you looking for */}
          <div className="space-y-2 group">
            <label
              htmlFor="lookingFor"
              className="flex items-center gap-2 text-sm font-medium text-[var(--blue-dark)] group-focus-within:text-[var(--gold)] transition-colors"
            >
              <MessageSquare size={16} />
              What are you looking for?
            </label>
            <textarea
              id="lookingFor"
              rows={4}
              value={formData.lookingFor}
              onChange={handleInputChange}
              required
              className="w-full bg-[var(--blue-medium-dark)]/5 border-2 border-[var(--blue-medium-dark)]/30 rounded-lg px-4 py-3 text-[var(--blue-darkest)] focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all resize-none placeholder:text-[var(--blue-medium)]/50"
              placeholder="Tell us what you're looking for (e.g., universities in UK, job opportunities in tech, visa guidance, etc.)"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--blue-darkest)] font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-[var(--blue-darkest)] border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={18} />
                  Submit
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-[var(--blue-medium-dark)]/30 text-[var(--blue-dark)] hover:border-[var(--blue-dark)] hover:bg-[var(--blue-medium-dark)]/5 rounded-lg transition-all font-medium"
            >
              Maybe Later
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
