'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import clsx from 'clsx';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useLogInOtpMutation, useSendOtpMutation } from '@/redux/api/auth';

import { toast } from 'sonner';
import { setCookie, getCookie } from 'cookies-next';

import Input from 'components/input';
import Button from 'components/button';
import OAuthButtons from 'components/button/oauth-buttons';
import Link from 'next/link';

import styles from './styles.module.scss';

type FormData = {
  email: string;
  otp: string;
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  const cookieEmail = getCookie('email');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({ mode: 'onChange' });

  const [logIn, { isLoading }] = useLogInOtpMutation();
  const [sendOtp, { isLoading: isOtpSending }] = useSendOtpMutation();

  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleClearInput = (name: keyof FormData) => {
    if (name === 'email') {
      setIsOtpSent(false);
      setValue('otp', '');
    }

    setValue(name, '');
  };

  const handleSubmitForm: SubmitHandler<FormData> = async ({ email, otp }) => {
    if (isOtpSent) {
      toast.promise(logIn({ email, otp, next }).unwrap(), {
        position: 'top-center',
        loading: 'Loading...',
        success: ({ redirectUrl, email }: LogInOtpResponse) => {
          setSuccess(true);
          setCookie('email', email);
          router.push(`/?to=${redirectUrl}`);
          return `Successful sign in as ${email}`;
        },
        error: (error) => {
          return error.data?.message || 'Try again. Something happened on our end';
        },
      });
    } else {
      toast.promise(sendOtp({ email }).unwrap(), {
        position: 'top-center',
        loading: 'Sending...',
        success: () => {
          setIsOtpSent(true);
          return `Verification code sent successfully`;
        },
        error: (error) => {
          return error.data?.message || 'Try again. Something happened on our end';
        },
      });
    }
  };

  useEffect(() => {
    if (cookieEmail) {
      setValue('email', cookieEmail);
    }
  }, [cookieEmail]);

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(handleSubmitForm)}>
        <div className={clsx('container', styles.container)}>
          <div className={clsx('text', styles.text)}>
            <h2 className={clsx('title', styles.title)}>Welcome back 👋</h2>

            <p className={clsx('desc', styles.desc)}>Log in to your account.</p>
          </div>

          <OAuthButtons />

          <div className={styles.divider}>
            <hr />
            <span>OR</span>
            <hr />
          </div>

          <Input
            label="Email"
            placeholder="Enter your email..."
            error={errors.email && errors.email.message}
            load={isLoading}
            disabled={success}
            register={register('email', {
              required: 'Please enter your email',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email',
              },
              onChange: () => {
                setIsOtpSent(false);
                handleClearInput('otp');
              },
            })}
          />

          {isOtpSent && (
            <>
              <Input
                label="Verification code"
                placeholder="Paste verification code..."
                error={errors.email && errors.email.message}
                load={isLoading}
                disabled={success}
                register={register('otp', {
                  required: 'Please enter verification code',
                  minLength: 6,
                  maxLength: 6,
                })}
              />

              <div className="text">
                <p className="desc">We sent a code to your inbox.</p>
              </div>
            </>
          )}

          <Button
            theme="blue"
            load={isLoading || isOtpSending}
            disabled={success || !isValid}
            pulseAnimation={success || isValid}
          >
            {!isOtpSent ? 'Continue' : 'Sign in'}
          </Button>

          <p className={clsx('desc', styles.desc)}>
            By logging in, you agree to our Terms of Service and Privacy Policy.
          </p>

          <Link
            className={clsx('link', styles.link)}
            href={next !== '/' ? `/sign-up?next=${next}` : '/sign-up'}
          >
            {"Don't have an account? Sign Up"}
          </Link>
        </div>
      </form>
    </>
  );
}
