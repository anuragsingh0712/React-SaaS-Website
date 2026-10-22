import React, { useState } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createContactSubmission } from '../data/store';
import { MIN_MESSAGE_LENGTH } from '../constants';
import { FormField, inputClassName } from '../components/FormField';

const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  company: z.string().trim().min(1, 'Company is required.'),
  message: z
    .string()
    .trim()
    .min(MIN_MESSAGE_LENGTH, `Message must be at least ${MIN_MESSAGE_LENGTH} characters.`),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const initialValues: ContactFormValues = { name: '', email: '', company: '', message: '' };

export function Contact(): React.ReactElement {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const handleReset = (): void => {
    reset(initialValues);
    setStatus('idle');
  };

  const onSubmit = async (values: ContactFormValues): Promise<void> => {
    setStatus('submitting');
    try {
      await createContactSubmission(values);
      setStatus('success');
      reset(initialValues);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Contact us</h1>
        <p className="mt-1 text-sm text-muted">Questions about Nimbus? Send us a message and we will respond shortly.</p>
      </div>

      <form
        className="space-y-4 rounded-card border border-border-subtle dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <FormField label="Name" htmlFor="name" error={errors.name?.message}>
          <input id="name" {...register('name')} className={inputClassName} placeholder="Jane Doe" />
        </FormField>

        <FormField label="Email" htmlFor="contact-email" error={errors.email?.message}>
          <input
            id="contact-email"
            type="email"
            {...register('email')}
            className={inputClassName}
            placeholder="jane@company.com"
          />
        </FormField>

        <FormField label="Company" htmlFor="company" error={errors.company?.message}>
          <input id="company" {...register('company')} className={inputClassName} placeholder="Acme Inc." />
        </FormField>

        <FormField
          label="Message"
          htmlFor="message"
          helperText={`At least ${MIN_MESSAGE_LENGTH} characters.`}
          error={errors.message?.message}
        >
          <textarea
            id="message"
            {...register('message')}
            rows={5}
            className={inputClassName}
            placeholder="How can we help?"
          />
        </FormField>

        {status === 'success' && (
          <div className="flex items-center gap-2 rounded-card bg-success-light px-4 py-3 text-sm font-medium text-success-dark">
            <CheckCircle2 className="h-4 w-4" /> Thanks! Your message has been sent.
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2 rounded-card bg-danger-light px-4 py-3 text-sm font-medium text-danger-dark">
            <XCircle className="h-4 w-4" /> Something went wrong. Please try again.
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!isValid || status === 'submitting'}
            className="inline-flex items-center gap-2 rounded-card bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {status === 'submitting' && <Loader2 className="h-4 w-4 animate-spin" />}
            Send message
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-card border border-border-default dark:border-border-dark px-5 py-2.5 text-sm font-medium text-muted hover:bg-canvas dark:hover:bg-night"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
