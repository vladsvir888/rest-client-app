import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { parseUrl } from '../../../../lib/parseUrl';
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

  const headersList = await headers();
  const fullUrl = headersList.get('link')?.split('; ')[0].slice(1, -1);
  const parse: ReturnType<typeof parseUrl> = parseUrl(fullUrl || '');

  if (slug === undefined || !methods.includes(slug[0])) {
    redirect(`/${parse.pathSegments[0]}/${parse.pathSegments[1]}/GET`);
  }

  return (
    <RestClient
      body={parse.pathSegments[4] || ''}
      headers={parse.query.toString() || ''}
      select={parse.pathSegments[2]}
      url={parse.pathSegments[3] || ''}
    />
  );
}
