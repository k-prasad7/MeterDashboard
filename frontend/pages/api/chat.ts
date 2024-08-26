import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from "@anthropic-ai/sdk";
import { ClientData, Client } from '../../types/clientTypes';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type MessageRole = 'user' | 'assistant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { message, history, clientData } = req.body as { 
        message: string; 
        history: { sender: string; text: string }[]; 
        clientData: ClientData 
      };

      // Format the history for Anthropic API
      const formattedHistory: { role: MessageRole; content: string }[] = history.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      // Create a more detailed client data context
      const clientContext = createClientContext(clientData);

      // Add the new message to the history
      formattedHistory.push({ role: 'user', content: message });

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1000,
        system: clientContext,
        messages: formattedHistory
      });

      // Extract the assistant's response
      let assistantResponse = '';
      for (const block of response.content) {
        if (block.type === 'text') {
          assistantResponse += block.text;
        }
        // Handle other types of content if necessary
      }

      // Send back a simplified response
      res.status(200).json({ 
        text: assistantResponse,
        sender: 'ai'
      });
    } catch (error) {
      console.error('Error in chat API:', error);
      res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

function createClientContext(clientData: ClientData): string {
  const { summary, clients } = clientData;
  
  return `
    Current client data summary: 
    Total Clients: ${summary.totalClients}
    Active Clients: ${summary.activeClients.length} (${summary.activeClients.join(', ')})
    Inactive Clients: ${summary.inactiveClients.length} (${summary.inactiveClients.join(', ')})
    Mobile Clients: ${summary.mobileClients.length} (${summary.mobileClients.join(', ')})
    Computer Clients: ${summary.computerClients.length} (${summary.computerClients.join(', ')})

    Total Client Names: ${clients.map(client => client.name).join(', ')}

    You have access to detailed information about each client, including their name, type (Mobile or Computer), and status (Active or Inactive).
  `;
}