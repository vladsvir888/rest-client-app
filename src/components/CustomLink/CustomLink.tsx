'use client';

import { useTransition } from 'react';
import { Link as NextLink } from '@/i18n/navigation';
import { useRouter } from 'next/navigation';
import { Loader } from '../Loader/Loader';

export function CustomLink({ href, children, replace, ...rest }: Parameters<typeof NextLink>[0]) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      {isPending && <Loader />}
      <NextLink
        href={href}
        onClick={(e) => {
          e.preventDefault();
          startTransition(() => {
            const url = href.toString();
            if (replace) {
              router.replace(url);
            } else {
              router.push(url);
            }
          });
        }}
        {...rest}
      >
        {children}
      </NextLink>
    </>
  );
}
