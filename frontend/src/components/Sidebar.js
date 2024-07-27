import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

// Import icons (you can use any icon library you prefer, like react-icons)
import { FaNetworkWired, FaUsers, FaChartLine } from 'react-icons/fa';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Insights</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard/networks" className="nav-item" activeClassName="active">
          <FaNetworkWired className="nav-icon" />
          <span>Networks</span>
        </NavLink>
        <NavLink to="/dashboard/clients" className="nav-item" activeClassName="active">
          <FaUsers className="nav-icon" />
          <span>Clients</span>
        </NavLink>
        <NavLink to="/dashboard/analytics" className="nav-item" activeClassName="active">
          <FaChartLine className="nav-icon" />
          <span>Analytics</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <p>© 2023 Your Company</p>
      </div>
    </div>
  );
}

export default Sidebar;