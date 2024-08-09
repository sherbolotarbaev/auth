'use client';

import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { useLogInOtpMutation, useSendOtpMutation } from '@/redux/api/auth';
import { type SubmitHandler, useForm } from 'react-hook-form';
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
  const [continueWithEmail, setContinueWithEmail] = useState<boolean>(false);

  const otp = watch('otp');
  const email = watch('email');

  const handleContinueWithEmail = async () => {
    setContinueWithEmail(true);
  };

  const handleClearInput = (name: keyof FormData) => {
    if (name === 'otp') {
      setIsOtpSent(false);
      setValue('otp', '');
    }

    setValue(name, '');
  };

  const checkIsOtpValid = useCallback(
    () => otp && isOtpSent && otp.length === 6 && /^\d+$/.test(otp),
    [otp, isOtpSent],
  );

  const handleSendOtp = () => {
    toast.promise(sendOtp({ email }).unwrap(), {
      position: 'top-center',
      loading: t('sendOtp_loading'),
      success: () => {
        setIsOtpSent(true);
        handleContinueWithEmail();
        return t('sendOtp_success');
      },
      error: (error) => {
        return error.data?.message === 'User does not exist.'
          ? t('error_user_not_found')
          : error.data?.message === 'User has been deactivated.'
          ? t('error_user_deactivated')
          : error.data?.message?.startsWith('Please try again in')
          ? error.data?.message
          : error.data?.message ===
            'Current operation is too frequent, please try again later!'
          ? error.data?.message
          : t('error_generic');
      },
    });
  };

  const handleLogInOtp = () => {
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
  };

  const handleSubmitForm: SubmitHandler<FormData> = () => {
    handleSendOtp();
  };

  const resendOtp = async () => {
    setIsOtpSent(false);
    handleClearInput('otp');
    handleSendOtp();
  };

  useEffect(() => {
    if (cookieEmail) setValue('email', cookieEmail);
    if (checkIsOtpValid()) handleLogInOtp();
  }, [cookieEmail, checkIsOtpValid]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleSubmitForm)}>
      <div className={clsx('container', styles.container)}>
        <div className={clsx('text', styles.text)}>
          <Logo />

          <h2 className="title">{t('signIn_title')}</h2>

          <p className="desc">{t('signIn_description')}</p>
        </div>

        {!continueWithEmail && (
          <>
            <OAuthButtons />

            <div className={styles.divider}>
              <hr />
              <span>{t('divider')}</span>
              <hr />
            </div>
          </>
        )}

        <Input
          label={t('email_label')}
          placeholder={t('email_placeholder')}
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
            onChange: () => handleClearInput('otp'),
          })}
        />

        {isOtpSent ? (
          <>
            <Input
              label={t('otp_label')}
              placeholder={t('otp_placeholder')}
              error={errors.otp && errors.otp.message}
              load={isLoading}
              disabled={isLoading || success}
              register={register('otp', {
                required: t('otp_required'),
                pattern: {
                  value: /^\d+$/,
                  message: t('otp_invalid'),
                },
                minLength: {
                  value: 6,
                  message: t('otp_required'),
                },
                maxLength: {
                  value: 6,
                  message: t('otp_required'),
                },
              })}
            />

            <div className={clsx('text', styles.text)}>
              <p className="desc">
                {t('email_sent_message')}

                <span className="link" onClick={resendOtp}>
                  {t('email_sent_action')}
                </span>
              </p>
            </div>
          </>
        ) : (
          <>
            <Button
              theme="white"
              load={isOtpSending}
              disabled={isOtpSending || success || !isValid}
              pulseAnimation={success || isValid}
            >
              {t('button')} <BiSolidRightArrow size={8} />
            </Button>

            <div className={clsx('text', styles.text)}>
              <p className="desc">
                {t('signIn_link_description')}

                <Link
                  className="link"
                  href={next !== '/' ? `/sign-up?next=${next}` : '/sign-up'}
                >
                  {t('signIn_link')}
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </form>
  );
};
export default LoginForm;
