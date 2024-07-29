import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { TextInput, PasswordInput, Button, Paper, Title, Box, Stack, Text } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';

const Index: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const theme = useMantineTheme();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (username && password) {
      router.push('/dashboard/networks');
    } else {
      alert('Please enter both username and password');
    }
  };

  const handleDashboard = () => {
    router.push('/dashboard/networks');
  };

  return (
    <Box
      w="100%"
      h="100vh"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, #E6F3FF 0%, #CCE6FF 100%)`,
      }}
    >
      <Stack 
        align="center" 
        gap="xl" 
        w="100%" 
        maw={420} 
        p="md"
      >
        <Title order={1} c={theme.colors.accent[9]}>Welcome to Meter</Title>
        <Text size="lg" ta="center" c={theme.colors.accent[7]}>
          Manage your networks and clients efficiently with our powerful dashboard.
        </Text>
        
        <Paper withBorder shadow="md" p={30} radius="md" w="100%">
          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="Username"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
              />

              <Button type="submit" fullWidth mt="xl">
                Sign in
              </Button>
            </Stack>
          </form>
        </Paper>
        
        <Button onClick={handleDashboard} variant="outline" color="gray">
          Go to Dashboard
        </Button>
      </Stack>
    </Box>
  );
}

export default Index;