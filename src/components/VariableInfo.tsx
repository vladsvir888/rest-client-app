'use client';

import CreateVariable from './CreateVariable';
import CurrentVariable from './CurrentVariable';
import { useState, useEffect } from 'react';
import { getVariables } from '@/utils/applyVariables';
import style from './style/VariableInfo.module.css';

import type { VariableRecord } from '@/types/types';

export default function VariableInfo({ authUser }: { authUser: string }) {
  const [listVar, setListVar] = useState<VariableRecord[]>([]);

  const handleCreateVariable = (key: string, value: string) => {
    const parsed = getVariables(authUser);
    parsed[key] = value;
    localStorage.setItem(`variable-${authUser}`, JSON.stringify(parsed));

    setListVar((prev) => [...prev, { key, variable: key, value }]);
  };

  const handleDeleteVariable = (keysToDelete: React.Key[]) => {
    const newArray = listVar.filter((item) => !keysToDelete.includes(item.key));
    setListVar(newArray);
    const parsed = getVariables(authUser);
    keysToDelete.forEach((key) => {
      delete parsed[String(key)];
    });
    localStorage.setItem(`variable-${authUser}`, JSON.stringify(parsed));
  };

  useEffect(() => {
    const parsed = getVariables(authUser);
    const formatted = Object.entries(parsed).map(([key, value]) => ({
      key,
      variable: key,
      value,
    }));
    setListVar(formatted);
  }, [authUser]);

  return (
    <div className={style.variable_container}>
      <CurrentVariable listVar={listVar} delVar={handleDeleteVariable} />
      <CreateVariable createVar={handleCreateVariable} />
    </div>
  );
}
