'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CurrentVariable({ authUser }: { authUser: string }) {
  const t = useTranslations();
  const [listVar, setListVar] = useState<Record<string, string>>({});

  useEffect(() => {
    const raw = localStorage.getItem(`variale-${authUser}`);
    if (raw) {
      try {
        setListVar(JSON.parse(raw));
      } catch (err) {
        console.log('Error parse variable', err);
      }
    }
  }, [authUser]);

  const curVariable = Object.entries(listVar);

  return (
    <table>
      <thead>
        <tr>
          <th>{t('key_variable')}</th>
          <th>{t('value_variable')}</th>
        </tr>
      </thead>
      <tbody>
        {curVariable.map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
