import React, { useState, useEffect } from 'react';
import { Table, TextInput, Select, Button, Badge, Group, Title, Container, Paper } from '@mantine/core';
import { NextPage } from 'next';

interface Client {
  id: string;
  name: string;
  type: string;
  status: string;
}

const Clients: NextPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState<Omit<Client, 'id' | 'status'>>({ name: '', type: 'Mobile' });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedClients = localStorage.getItem('clients');
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const addClient = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const clientExists = clients.some(client => client.name.toLowerCase() === newClient.name.toLowerCase());
    if (clientExists) {
      alert('A client with this name already exists.');
      return;
    }
    const newClientWithId: Client = {
      ...newClient,
      id: Date.now().toString(),
      status: 'Active'
    };
    setClients(prevClients => [...prevClients, newClientWithId].sort((a, b) => a.name.localeCompare(b.name)));
    setNewClient({ name: '', type: 'Mobile' });
  };

  const handleInputChange = (name: string, value: string): void => {
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const toggleClientStatus = (id: string): void => {
    setClients(prevClients =>
      prevClients.map(client =>
        client.id === id
          ? { ...client, status: client.status === 'Active' ? 'Inactive' : 'Active' }
          : client
      )
    );
  };

  return (
    <Container size="lg">
      <Title order={1} mb="md">Client Management</Title>
      
      <Paper p="md" mb="xl">
        <Title order={2} mb="md">Add New Client</Title>
        <form onSubmit={addClient}>
          <Group align="end">
            <TextInput
              label="Client Name"
              placeholder="Enter client name"
              value={newClient.name}
              onChange={(event) => handleInputChange('name', event.currentTarget.value)}
              required
            />
            <Select
              label="Client Type"
              data={[
                { value: 'Mobile', label: 'Mobile' },
                { value: 'Computer', label: 'Computer' },
              ]}
              value={newClient.type}
              onChange={(value) => handleInputChange('type', value || 'Mobile')}
            />
            <Button type="submit">Add Client</Button>
          </Group>
        </form>
      </Paper>

      <Title order={2} mb="md">Client List</Title>
      {isLoading ? (
        <div>Loading...</div>
      ) : clients.length > 0 ? (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {clients.map((client) => (
              <Table.Tr key={client.id}>
                <Table.Td>{client.name}</Table.Td>
                <Table.Td>{client.type}</Table.Td>
                <Table.Td>
                  <Badge color={client.status === 'Active' ? 'green' : 'red'}>
                    {client.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Button 
                    onClick={() => toggleClientStatus(client.id)}
                    variant={client.status === 'Active' ? 'outline' : 'filled'}
                    color={client.status === 'Active' ? 'red' : 'green'}
                  >
                    Toggle Status
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <p>No clients found. Add a client to get started.</p>
      )}
    </Container>
  );
}

export default Clients;