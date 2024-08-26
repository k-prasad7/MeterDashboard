import { Client, ClientSummary, ClientData, ClientType, ClientStatus } from '../types/clientTypes';

export function getClientData(): ClientData {
  if (typeof window === 'undefined') {
    return { clients: [], summary: getEmptySummary() };
  }

  try {
    const storedClients = localStorage.getItem('clients');
    const clients: Client[] = storedClients ? JSON.parse(storedClients) : [];

    const summary: ClientSummary = calculateSummary(clients);

    return { clients, summary };
  } catch (error) {
    console.error('Error fetching client data:', error);
    return { clients: [], summary: getEmptySummary() };
  }
}

function calculateSummary(clients: Client[]): ClientSummary {
  return {
    totalClients: clients.length,
    activeClients: getClientNamesByStatus(clients, 'Active'),
    inactiveClients: getClientNamesByStatus(clients, 'Inactive'),
    mobileClients: getClientNamesByType(clients, 'Mobile'),
    computerClients: getClientNamesByType(clients, 'Computer'),
  };
}

function getClientNamesByStatus(clients: Client[], status: ClientStatus): string[] {
  return clients.filter(client => client.status === status).map(client => client.name);
}

function getClientNamesByType(clients: Client[], type: ClientType): string[] {
  return clients.filter(client => client.type === type).map(client => client.name);
}

function getEmptySummary(): ClientSummary {
  return {
    totalClients: 0,
    activeClients: [],
    inactiveClients: [],
    mobileClients: [],
    computerClients: [],
  };
}

// Helper functions
export function getClientById(id: string): Client | undefined {
  const { clients } = getClientData();
  return clients.find(client => client.id === id);
}

export function filterClientsByStatus(status: ClientStatus): Client[] {
  const { clients } = getClientData();
  return clients.filter(client => client.status === status);
}

export function filterClientsByType(type: ClientType): Client[] {
  const { clients } = getClientData();
  return clients.filter(client => client.type === type);
}

export function updateClient(updatedClient: Client): void {
  const { clients } = getClientData();
  const updatedClients = clients.map(client => 
    client.id === updatedClient.id ? updatedClient : client
  );
  localStorage.setItem('clients', JSON.stringify(updatedClients));
}

// New helper functions for getting counts
export function getActiveClientCount(): number {
  return getClientData().summary.activeClients.length;
}

export function getInactiveClientCount(): number {
  return getClientData().summary.inactiveClients.length;
}

export function getMobileClientCount(): number {
  return getClientData().summary.mobileClients.length;
}

export function getComputerClientCount(): number {
  return getClientData().summary.computerClients.length;
}