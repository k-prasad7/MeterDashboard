import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { MantineProvider } from '@mantine/core';
import DashboardLayout from '../components/DashboardLayout';
import MainLayout from '../components/MainLayout';
import { theme } from '../styles/theme';
import '@mantine/core/styles.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isDashboardPage, setIsDashboardPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      setIsDashboardPage(url.startsWith('/dashboard'));
      setIsLoading(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    handleRouteChange(router.pathname);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const Layout = isDashboardPage ? DashboardLayout : MainLayout;

  return (
    <MantineProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MantineProvider>
  );
}

export default MyApp;