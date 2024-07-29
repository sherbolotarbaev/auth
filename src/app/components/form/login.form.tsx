'use client';

import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useLogInOtpMutation, useSendOtpMutation } from '@/redux/api/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'shared/hooks/use-translation';

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

  const { t } = useTranslation();

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
      loading: t('sendOtp_loading'),
      success: () => {
        setIsOtpSent(true);
        return t('sendOtp_success');
      },
      error: (error) => {
        return error.data?.message === 'User does not exist.'
          ? t('error_user_not_found')
          : error.data?.message === 'User has been deactivated.'
          ? t('error_user_deactivated')
          : t('error_generic');
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
        loading: t('loginOtp_loading'),
        success: ({ redirectUrl, email }: LogInOtpResponse) => {
          setSuccess(true);
          setCookie('email', email);
          router.push(`/?to=${redirectUrl}`);
          return `${t('loginOtp_success')} ${email}`;
        },
        error: (error) => {
          return error.data?.message === 'Incorrect verification code.'
            ? t('error_otp_invalid')
            : error.data?.message === 'Verification code expired.'
            ? t('error_otp_expired')
            : t('error_generic');
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

            <h2 className={clsx('title', styles.title)}>{t('signIn_title')}</h2>

            <p className={clsx('desc', styles.desc)}>{t('signIn_description')}</p>
          </div>

          <OAuthButtons />

          <div className={styles.divider}>
            <hr />
            <span>{t('divider')}</span>
            <hr />
          </div>

          <Input
            label={t('email_label')}
            placeholder="Enter your email..."
            error={errors.email && errors.email.message}
            load={isOtpSending || isLoading}
            disabled={isOtpSending || isLoading || success}
            autoComplete="email"
            register={register('email', {
              required: t('email_required'),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t('email_invalid'),
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
              {t('button')} <BiSolidRightArrow size={8} />
            </Button>
          )}

          {isOtpSent && (
            <>
              <Input
                label={t('otp_label')}
                placeholder="Paste verification code..."
                error={errors.email && errors.email.message}
                load={isLoading}
                disabled={isLoading || success}
                register={register('otp', {
                  required: t('otp_required'),
                  pattern: {
                    value: /^\d+$/,
                    message: t('otp_invalid'),
                  },
                  minLength: 6,
                  maxLength: 6,
                })}
              />

              <div className="text">
                <p className="desc">{t('email_sent_message')}</p>
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
            {t('signIn_link_description')}
            <Link
              className="link"
              href={next !== '/' ? `/sign-up?next=${next}` : '/sign-up'}
            >
              {t('signIn_link')}
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};
export default LoginForm;
