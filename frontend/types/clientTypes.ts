// Define the possible client types
export type ClientType = 'Mobile' | 'Computer';

// Define the possible client statuses
export type ClientStatus = 'Active' | 'Inactive';

// Define the structure of a single client
export interface Client {
  id: string;
  name: string;
  type: ClientType;
  status: ClientStatus;
  // You can add more fields here if needed, e.g.:
  // lastSeen?: Date;
  // ipAddress?: string;
}

// Define the structure of the client summary
export interface ClientSummary {
  totalClients: number;
  activeClients: string[];
  inactiveClients: string[];
  mobileClients: string[];
  computerClients: string[];
}

// Define the overall structure of the client data
export interface ClientData {
  clients: Client[];
  summary: ClientSummary;
}

// Optional: Define a type for client filter functions
export type ClientFilter = (client: Client) => boolean;