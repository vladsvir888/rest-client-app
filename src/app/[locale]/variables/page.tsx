import dynamic from 'next/dynamic';

const VariablePage = dynamic(() =>
  import('../../../components/Variables/Variables').then((mod) => mod.default)
);

export default async function Page() {
  return <VariablePage />;
}
