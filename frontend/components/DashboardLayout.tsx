import React from 'react';
import { AppShell } from '@mantine/core';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <AppShell
      padding={0}
      layout="alt"
      navbar={{ width: 250, breakpoint: 'sm' }}
    >
      <Sidebar />
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default DashboardLayout;