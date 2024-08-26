import React, { useState, useEffect, useMemo } from 'react';
import { Paper, Title, Group, Text, Stack, Box } from '@mantine/core';
import { AreaChart } from '@mantine/charts';
import { useLocalStorage } from '@mantine/hooks';
import { useMantineTheme } from '@mantine/core';

interface Device {
  id: string;
  name: string;
  type: 'Mobile' | 'Computer';
  status: 'Active' | 'Inactive';
}

interface DataPoint {
  date: string;
  activeMobiles: number;
  activeComputers: number;
}

const Networks: React.FC = () => {
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [activeComputerCount, setActiveComputerCount] = useState(0);
  const [chartData, setChartData] = useLocalStorage<DataPoint[]>({
    key: 'networkChartData',
    defaultValue: [],
  });
  const theme = useMantineTheme();

  // Define colors using the new theme
  const mobileColor = theme.colors.accent[6];
  const computerColor = theme.colors.accent[4];
  const inactiveColor = theme.colors.accent[2];

  const formattedChartData = useMemo(() => {
    return chartData.map(point => ({
      ...point,
      formattedDate: new Date(point.date).toISOString()
    }));
  }, [chartData]);

  const xAxisTicks = useMemo(() => {
    if (formattedChartData.length < 2) return formattedChartData.map(d => d.formattedDate);
    const dataLength = formattedChartData.length;
    const interval = Math.ceil(dataLength / 4);
    return [
      formattedChartData[0].formattedDate,
      ...Array(3).fill(null).map((_, i) => formattedChartData[Math.min((i + 1) * interval, dataLength - 1)].formattedDate),
      formattedChartData[dataLength - 1].formattedDate
    ];
  }, [formattedChartData]);

  useEffect(() => {
    const countDevices: () => void = () => {
      const storedClients = localStorage.getItem('clients');
      if (storedClients) {
        const clients: Device[] = JSON.parse(storedClients);
        console.log('All clients:', clients);
        
        const activeMobiles = clients.filter(client => 
          client.status === 'Active' && client.type === 'Mobile'
        ).length;
        const inactive = clients.filter(client => client.status === 'Inactive').length;
        const activeComputers = clients.filter(client => 
          client.status === 'Active' && client.type === 'Computer'
        ).length;
        
        console.log('Active mobiles:', activeMobiles);
        console.log('Active computers:', activeComputers);
        
        setActiveCount(activeMobiles);
        setInactiveCount(inactive);
        setActiveComputerCount(activeComputers);

        // Update chart data
        const now = new Date();
        const newDataPoint: DataPoint = {
          date: now.toISOString(),
          activeMobiles: activeMobiles,
          activeComputers: activeComputers,
        };

        setChartData(prevData => {
          const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
          const newData = [...prevData.filter(d => new Date(d.date) >= tenMinutesAgo), newDataPoint];
          return newData;
        });
      }
    };
 
    countDevices();

    const intervalId = setInterval(countDevices, 1000);

    return () => clearInterval(intervalId);
  }, [setChartData]);

  return (
    <Box p="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper p="md" radius="md" withBorder style={{ flex: 1 }}>
        <Title order={2} mb="md" c={theme.white}>Network Devices</Title>
        <Group grow mb="xl">
          <Paper p="md" radius="md" withBorder bg={theme.colors.accent[7]}>
            <Stack align="center">
              <Text size="lg" fw={500} c={theme.white}>Active Mobile Clients</Text>
              <Text size="xl" fw={700} c={theme.white}>{activeCount}</Text>
            </Stack>
          </Paper>
          <Paper p="md" radius="md" withBorder bg={theme.colors.accent[7]}>
            <Stack align="center">
              <Text size="lg" fw={500} c={theme.white}>Inactive Clients</Text>
              <Text size="xl" fw={700} c={theme.white}>{inactiveCount}</Text>
            </Stack>
          </Paper>
          <Paper p="md" radius="md" withBorder bg={theme.colors.accent[7]}>
            <Stack align="center">
              <Text size="lg" fw={500} c={theme.white}>Active Computer Clients</Text>
              <Text size="xl" fw={700} c={theme.white}>{activeComputerCount}</Text>
            </Stack>
          </Paper>
        </Group>
        <Paper p="md" radius="md" withBorder>
          <Title order={3} mb="md" c={theme.colors.accent[7]}>Active Clients</Title>
          {formattedChartData.length > 0 ? (
            <AreaChart
              h={300}
              data={formattedChartData}
              dataKey="formattedDate"
              series={[
                { name: 'activeMobiles', color: mobileColor, label: 'Mobile' },
                { name: 'activeComputers', color: computerColor, label: 'Computer' },
              ]}
              curveType="linear"
              withLegend
              withDots={false}
              strokeWidth={2}
              tickLine="y"
              fillOpacity={0.2}
              yAxisProps={{ domain: [0, 'auto'] }}
              xAxisProps={{
                ticks: xAxisTicks,
                tickFormatter: (date: string) => {
                  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                },
              }}
            />
          ) : (
            <Text c={theme.colors.accent[7]}>No data available</Text>
          )}
        </Paper>
      </Paper>
    </Box>
  );
};

export default Networks;