import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { parseUrl } from '../../../../lib/parseUrl';
import { methods } from '@/consts/rest-client';
import AuthRoute from '@/components/auth/AuthRoute';
import { checkAuth } from '@/app/actions/auth';

const RestClient = dynamic(() =>
  import('../../../../components/RestClient/RestClient').then((mod) => mod.RestClient)
);

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const searchParamsUrl = await searchParams;
  const headersList = await headers();
  const fullUrl = headersList.get('link')?.split('; ')[0].slice(1, -1);
  const parse: ReturnType<typeof parseUrl> = parseUrl(fullUrl || '');

  if (slug === undefined || !methods.includes(slug[0])) {
    redirect(`/${parse.pathSegments[0]}/${parse.pathSegments[1]}/GET`);
  }

  const arrHeaders = Object.entries(searchParamsUrl || {}).map((el) => {
    return {
      key: el[0],
      value: Array.isArray(el[1]) ? el[1].join(', ') : el[1],
    };
  });

  const user = await checkAuth();

  return (
    <AuthRoute>
      <RestClient
        body={parse.pathSegments[4] || ''}
        headers={arrHeaders}
        select={parse.pathSegments[2]}
        url={parse.pathSegments[3] || ''}
        user={user}
      />
    </AuthRoute>
  );
}
