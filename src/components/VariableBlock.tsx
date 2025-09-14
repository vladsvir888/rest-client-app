import VariableInfo from './VariableInfo';
import VariableTitle from './VariableTitle';

export default function VariableBlock({ userEmail }: { userEmail: string }) {
  return (
    <>
      <VariableTitle />
      <VariableInfo authUser={userEmail} />
    </>
  );
}
