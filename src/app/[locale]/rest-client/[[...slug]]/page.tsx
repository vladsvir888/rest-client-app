import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { parseUrl } from './api/parseUrl';
import { methods } from '@/consts/rest-client';

const RestClient = dynamic(() =>
  import('../../../../components/RestClient/RestClient').then((mod) => mod.RestClient)
);

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string | string[] | undefined }>;
}) {
  const { slug } = await params;

  if (slug === undefined || !methods.includes(slug[0])) {
    const headersList = await headers();
    const fullUrl = headersList.get('link')?.split('; ')[0].slice(1, -1);
    const pathSegments = (await parseUrl(fullUrl || '')).pathSegments;

    redirect(`/${pathSegments[0]}/${pathSegments[1]}/GET`);
  }

  return <RestClient />;
}
