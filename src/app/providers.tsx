'use client';

import { RestClientProvider } from '@/components/RestClientProvider/RestClientProvider';
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider } from 'antd';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider>
      <RestClientProvider>{children}</RestClientProvider>
    </ConfigProvider>
  );
}
