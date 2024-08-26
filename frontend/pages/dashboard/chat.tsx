import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Paper, Title, Text, TextInput, Button, ScrollArea, Stack, Alert } from '@mantine/core';
import { IconSend, IconAlertCircle } from '@tabler/icons-react';
import { getClientData, getActiveClientCount, getInactiveClientCount, getMobileClientCount, getComputerClientCount } from '../../utils/clientData';
import { ClientData, Client } from '../../types/clientTypes';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [clientData, setClientData] = useState<ClientData>({ 
    clients: [], 
    summary: { 
      totalClients: 0, 
      activeClients: [], 
      inactiveClients: [], 
      mobileClients: [], 
      computerClients: [] 
    } 
  });
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const data = getClientData();
    setClientData(data);
  }, []);

  const handleSend = useCallback(async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now(),
      text: input.trim(),
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.text,
          history: messages,
          clientData: clientData
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.text && data.sender === 'ai') {
        const aiMessage: Message = {
          id: Date.now(),
          text: data.text,
          sender: 'ai',
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error calling chat API:', error);
      setError('An error occurred while sending your message. Please try again.');
    }
  }, [input, messages, clientData]);

  const getClientNames = useCallback((): string[] => {
    return clientData.clients.map((client: Client) => client.name);
  }, [clientData.clients]);

  const getClientCounts = useCallback(() => {
    return {
      activeClients: getActiveClientCount(),
      inactiveClients: getInactiveClientCount(),
      mobileClients: getMobileClientCount(),
      computerClients: getComputerClientCount(),
    };
  }, []);

  return (
    <Box p="md" style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
      <Paper p="md" radius="md" withBorder style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Title order={2} mb="md">Chat</Title>
        <ScrollArea style={{ flex: 1 }} viewportRef={scrollAreaRef}>
          <Stack gap="xs">
            {messages.map((message) => (
              <Paper
                key={message.id}
                p="xs"
                radius="sm"
                style={{
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                  maxWidth: '70%',
                }}
              >
                <Text>{message.text}</Text>
              </Paper>
            ))}
          </Stack>
        </ScrollArea>
        {error && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" mt="md">
            {error}
          </Alert>
        )}
        <Box mt="md">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <TextInput
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              rightSection={
                <Button 
                  onClick={handleSend} 
                  variant="filled" 
                  size="sm" 
                  style={{ 
                    height: '100%', 
                    paddingLeft: '10px', 
                    paddingRight: '10px',
                    borderTopLeftRadius: 0, 
                    borderBottomLeftRadius: 0 
                  }}
                >
                  <IconSend size={20} />
                </Button>
              }
              rightSectionWidth={60}
              styles={(theme) => ({
                rightSection: {
                  width: 60,
                  paddingRight: 0,
                },
                input: {
                  paddingRight: 0,
                },
              })}
            />
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default Chat;