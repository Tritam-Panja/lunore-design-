import { supabase } from './supabase';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SendInquiryResult {
  success: boolean;
  message?: string;
}

/**
 * Sends a contact inquiry directly to the studio's email inbox using Web3Forms,
 * and also saves a record to Supabase if configured.
 */
export async function sendContactInquiry(formData: ContactFormData): Promise<SendInquiryResult> {
  const web3FormsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  let emailSent = false;
  let errorMsg = '';

  // 1. Try sending directly to Email Inbox via Web3Forms if key is provided
  if (web3FormsKey && web3FormsKey !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject ? `[Lunore Studio Inquiry] ${formData.subject}` : 'New Inquiry from Lunore Website',
          message: formData.message,
          from_name: 'Lunore Luxe Decor Studio Inquiries',
          botcheck: '', // Honeypot spam prevention
        }),
      });

      const result = await response.json();
      if (result.success) {
        emailSent = true;
      } else {
        errorMsg = result.message || 'Failed to send email notification.';
      }
    } catch (err: unknown) {
      const e = err as Error;
      errorMsg = e.message || 'Network error while contacting email service.';
    }
  }

  // 2. Also save to Supabase Database (if configured)
  try {
    const { error: dbError } = await supabase.from('inquiries').insert({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });

    if (!dbError) {
      // If DB insert succeeded, we consider it a success even if email service is still being set up
      return {
        success: true,
        message: 'Inquiry received successfully and logged in studio records.',
      };
    }
  } catch {
    // Supabase fallback continues
  }

  // If email was sent via Web3Forms
  if (emailSent) {
    return {
      success: true,
      message: 'Inquiry sent directly to studio email inbox.',
    };
  }

  // If neither key is configured yet, provide clear instruction
  if (!web3FormsKey || web3FormsKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
    return {
      success: false,
      message:
        'Please add your free VITE_WEB3FORMS_ACCESS_KEY in your .env file to enable instant inbox email delivery.',
    };
  }

  return {
    success: false,
    message: errorMsg || 'Unable to submit inquiry. Please try again or reach out via WhatsApp/Phone.',
  };
}
