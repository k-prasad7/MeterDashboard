import React from 'react';
import { AppShell } from '@mantine/core';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <AppShell padding={0}>
      {children}
    </AppShell>
  );
}

export default MainLayout;