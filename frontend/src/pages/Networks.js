import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { subMinutes, parseISO } from 'date-fns';
import axios from 'axios';
import './Networks.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

const BASE_URL = 'http://localhost:8080';

function Networks() {
  const [activeClientsData, setActiveClientsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);

  const fetchActiveClientsData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/active-clients`);
      console.log("Received data from API:", response.data);
      setActiveClientsData(response.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching active clients data:', error);
      setActiveClientsData([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveClientsData();
    const interval = setInterval(fetchActiveClientsData, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      updateChartData();
    }
  }, [activeClientsData]);

  const updateChartData = () => {
    const chart = chartRef.current;
    if (!chart) return;

    const now = new Date();
    const tenMinutesAgo = subMinutes(now, 10);
    
    const recentData = activeClientsData.filter(d => parseISO(d.timestamp) >= tenMinutesAgo);

    if (recentData.length > 0) {
      const lastValue = recentData[recentData.length - 1].count;
      
      const chartData = [
        ...recentData.map(d => ({ x: parseISO(d.timestamp), y: d.count })),
        { x: now, y: lastValue }
      ];

      chart.data.datasets[0].data = chartData;
      
      chart.options.scales.x.min = tenMinutesAgo;
      chart.options.scales.x.max = now;

      const maxCount = Math.max(...chartData.map(d => d.y), 1);
      chart.options.scales.y.max = maxCount + 1;

      chart.update('none');
    }
  };

  const chartData = {
    datasets: [
      {
        label: 'Active Clients',
        data: [],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 0,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Active Clients Over the Last 10 Minutes',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          displayFormats: { minute: 'HH:mm' }
        },
        title: { display: true, text: 'Time' },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          autoSkipPadding: 20
        },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Active Clients' },
        ticks: { stepSize: 1 },
      }
    }
  };

  return (
    <div className="networks-container">
      <h1 className="page-title">Network Activity</h1>
      <div className="chart-container">
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <Line ref={chartRef} data={chartData} options={chartOptions} />
        )}
      </div>
      <div className="network-stats">
        <div className="stat-card">
          <h3>Current Active Clients</h3>
          <p className="stat-value">{activeClientsData.length > 0 ? activeClientsData[activeClientsData.length - 1].count : 0}</p>
        </div>
        <div className="stat-card">
          <h3>Peak Active Clients</h3>
          <p className="stat-value">{Math.max(...activeClientsData.map(d => d.count), 0)}</p>
        </div>
      </div>
    </div>
  );
}

export default Networks;