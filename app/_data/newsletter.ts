// Newsletter service form endpoint. Null until a service is chosen; the sign-up form stays hidden until then.
export type NewsletterConfig = {
  action: string;
  emailField: string;
  hidden?: Record<string, string>;
};

export const NEWSLETTER: NewsletterConfig | null = null;
