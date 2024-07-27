import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Clients.css';

const BASE_URL = 'http://localhost:8080';

function Clients() {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ name: '', type: 'Mobile' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/devices`);
      const sortedClients = response.data.sort((a, b) => a.name.localeCompare(b.name));
      setClients(sortedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      alert('Failed to fetch clients. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (e) => {
    e.preventDefault();
    const clientExists = clients.some(client => client.name.toLowerCase() === newClient.name.toLowerCase());
    if (clientExists) {
      alert('A client with this name already exists.');
      return;
    }
    try {
      await axios.post(`${BASE_URL}/api/devices`, newClient);
      setNewClient({ name: '', type: 'Mobile' });
      fetchClients();
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Failed to add client. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const toggleClientStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await axios.patch(`${BASE_URL}/api/devices/${id}/status`, { status: newStatus });
      fetchClients();
    } catch (error) {
      console.error('Error updating client status:', error);
      alert('Failed to update client status. Please try again.');
    }
  };

  return (
    <div className="clients-container">
      <h1 className="page-title">Client Management</h1>
      
      <div className="add-client-section">
        <h2>Add New Client</h2>
        <form onSubmit={addClient} className="add-client-form">
          <input
            type="text"
            name="name"
            placeholder="Client Name"
            value={newClient.name}
            onChange={handleInputChange}
            required
          />
          <select
            name="type"
            value={newClient.type}
            onChange={handleInputChange}
          >
            <option value="Mobile">Mobile</option>
            <option value="Computer">Computer</option>
          </select>
          <button type="submit" className="btn-add">Add Client</button>
        </form>
      </div>

      <div className="client-list-section">
        <h2>Client List</h2>
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : clients.length > 0 ? (
          <div className="client-table">
            <div className="client-header">
              <div>Name</div>
              <div>Type</div>
              <div>Status</div>
              <div>Action</div>
            </div>
            {clients.map((client) => (
              <div key={client.id} className="client-row">
                <div>{client.name}</div>
                <div>{client.type}</div>
                <div>
                  <span className={`status-badge ${client.status.toLowerCase()}`}>
                    {client.status}
                  </span>
                </div>
                <div>
                  <button 
                    onClick={() => toggleClientStatus(client.id, client.status)}
                    className={`btn-toggle ${client.status.toLowerCase()}`}
                  >
                    Toggle Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-clients-message">No clients found. Add a client to get started.</p>
        )}
      </div>
    </div>
  );
}

export default Clients;