'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type ReactElement, useEffect } from 'react';

import { useTranslation } from 'shared/hooks/use-translation';
import { toast } from 'sonner';

import Button from '.';

import { BiLogoGithub } from 'react-icons/bi';
import { FcGoogle } from 'react-icons/fc';
import styles from './styles.module.scss';

type ErrorCode = {
  code: string;
  message: string;
};

type AuthProvider = {
  name: 'google' | 'github';
  svgIcon: ReactElement;
  actionText?: string;
};

const OAuthButtons = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const error = searchParams.get('error');
  const next = searchParams.get('next') || '/';

  const { t } = useTranslation();

  const errorCodes: ErrorCode[] = [
    {
      code: '403',
      message: t('error_user_deactivated'),
    },
    {
      code: 'access_denied',
      message: t('error_auth_cancelled'),
    },
  ];

  const authProviders: AuthProvider[] = [
    {
      name: 'google',
      svgIcon: <FcGoogle size={20} />,
      actionText: t('google_button'),
    },
    {
      name: 'github',
      svgIcon: <BiLogoGithub size={21} />,
      actionText: t('github_button'),
    },
  ];

  const handleErrorAlert = (message?: string) => {
    toast.error(message || t('error_generic'), {
      position: 'top-center',
      duration: 5000,
    });
  };

  useEffect(() => {
    if (error) {
      const errorCode = errorCodes.find((item) => item.code === error);

      router.replace('/sign-in');

      if (errorCode) {
        return () => {
          handleErrorAlert(errorCode.message);
        };
      }
    }
  }, [error]);

  return (
    <>
      <div className={styles.buttons}>
        {authProviders.map((provider, index) => (
          <Button
            key={index}
            type="button"
            redirect={`${process.env.NEXT_PUBLIC_API_URL}/${provider.name}/callback?next=${next}&source=${pathname}`}
          >
            {provider.svgIcon} {provider.actionText}
          </Button>
        ))}
      </div>
    </>
  );
};
export default OAuthButtons;
