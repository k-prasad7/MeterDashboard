import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AppShell, Stack, Text, UnstyledButton, Group, useMantineTheme, rgba } from '@mantine/core';
import { IconNetwork, IconUsers, IconMessageCircle } from '@tabler/icons-react';

const navItems = [
  { icon: IconNetwork, label: 'Networks', href: '/dashboard/networks' },
  { icon: IconUsers, label: 'Clients', href: '/dashboard/clients' },
  { icon: IconMessageCircle, label: 'Chat', href: '/dashboard/chat' },
];

const Sidebar: React.FC = () => {
  const theme = useMantineTheme();
  const router = useRouter();

  return (
    <AppShell.Navbar 
      p="md" 
      style={{ 
        background: `linear-gradient(135deg, #E6F3FF 0%, #CCE6FF 100%)`,
      }}
    >
      <AppShell.Section>
        <Text size="xl" fw={700} ta="center" mb="xl" c={theme.colors.accent[9]}>Insights</Text>
      </AppShell.Section>

      <AppShell.Section grow>
        <Stack>
          {navItems.map((item) => (
            <UnstyledButton
              key={item.href}
              component={Link}
              href={item.href}
              data-active={router.pathname === item.href || undefined}
              styles={(theme) => ({
                root: {
                  display: 'block',
                  width: '100%',
                  padding: theme.spacing.xs,
                  borderRadius: theme.radius.sm,
                  color: theme.colors.accent[9],
                  '&:hover': {
                    backgroundColor: rgba(theme.colors.accent[2], 0.5),
                  },
                  '&[data-active]': {
                    backgroundColor: rgba(theme.colors.accent[3], 0.5),
                  },
                },
              })}
            >
              <Group>
                <item.icon size={20} />
                <Text size="sm">{item.label}</Text>
              </Group>
            </UnstyledButton>
          ))}
        </Stack>
      </AppShell.Section>

      <AppShell.Section>
        <Text size="xs" ta="center" c={theme.colors.accent[7]} opacity={0.7}>© 2023 Your Company</Text>
      </AppShell.Section>
    </AppShell.Navbar>
  );
}

export default Sidebar;