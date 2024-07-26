'use client';

import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useLogInOtpMutation, useSendOtpMutation } from '@/redux/api/auth';
import { SubmitHandler, useForm } from 'react-hook-form';

import { getCookie, setCookie } from 'cookies-next';
import { toast } from 'sonner';

import Button from 'components/button';
import OAuthButtons from 'components/button/oauth-buttons';
import Input from 'components/input';
import Logo from 'components/logo';
import Link from 'next/link';

import { BiSolidRightArrow } from 'react-icons/bi';
import styles from './styles.module.scss';

type FormData = {
  email: string;
  otp: string;
};

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  const cookieEmail = getCookie('email');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({ mode: 'onChange' });

  const [logIn, { isLoading }] = useLogInOtpMutation();
  const [sendOtp, { isLoading: isOtpSending }] = useSendOtpMutation();

  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const otp = watch('otp');
  const email = watch('email');

  const handleClearInput = (name: keyof FormData) => {
    if (name === 'email') {
      setIsOtpSent(false);
      setValue('otp', '');
    }

    setValue(name, '');
  };

  const checkIsOtpValid = () => {
    if (otp && isOtpSent && otp.length === 6 && /^\d+$/.test(otp)) return true;
    return false;
  };

  const handleSubmitForm: SubmitHandler<FormData> = async ({ email }) => {
    if (checkIsOtpValid()) {
      return;
    }

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
  };

  useEffect(() => {
    if (cookieEmail) {
      setValue('email', cookieEmail);
    }
  }, [cookieEmail]);

  useEffect(() => {
    if (checkIsOtpValid()) {
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
    }
  }, [otp, isOtpSent]);

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(handleSubmitForm)}>
        <div className={clsx('container', styles.container)}>
          <div className={clsx('text', styles.text)}>
            <Logo />

            <h2 className={clsx('title', styles.title)}>Sign in to sherbolotarbaev.co</h2>

            <p className={clsx('desc', styles.desc)}>
              Welcome back! Please sign in to continue.
            </p>
          </div>

          <OAuthButtons />

          <div className={styles.divider}>
            <hr />
            <span>or</span>
            <hr />
          </div>

          <Input
            label="Email address"
            // placeholder="Enter your email..."
            error={errors.email && errors.email.message}
            load={isOtpSending || isLoading}
            disabled={isOtpSending || isLoading || success}
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

          {!isOtpSent && (
            <Button
              theme="blue"
              load={isOtpSending}
              disabled={isOtpSending || success || !isValid}
              pulseAnimation={success || isValid}
            >
              Continue <BiSolidRightArrow size={8} />
            </Button>
          )}

          {isOtpSent && (
            <>
              <Input
                label="6-digit verification code"
                // placeholder="Paste verification code..."
                error={errors.email && errors.email.message}
                load={isLoading}
                disabled={isLoading || success}
                register={register('otp', {
                  required: 'Please enter verification code',
                  pattern: {
                    value: /^\d+$/,
                    message: 'Please enter only numbers',
                  },
                  minLength: 6,
                  maxLength: 6,
                })}
              />

              <div className="text">
                <p className="desc">We sent a code to your inbox.</p>
              </div>
            </>
          )}

          <p
            className="desc"
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {"Don't"} have an account?
            <Link
              className="link"
              href={next !== '/' ? `/sign-up?next=${next}` : '/sign-up'}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};
export default LoginForm;
