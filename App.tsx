import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Bell,
  LogOut,
  Menu,
  X,
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';
import { dashboardAPI, portalAPI, accountsAPI } from './services/api';
import Dashboard from './components/Dashboard';
import AccountsManager from './components/AccountsManager';
import ClientsManager from './components/ClientsManager';
import SalesManager from './components/SalesManager';
import AlertsPanel from './components/AlertsPanel';
import PortalApp from './portal/PortalApp';
import type { TabType } from './types';

const styles = `
  :root {
    --neon-green: #39ff14;
    --xbox-green: #107c10;
    --dark-bg: #050505;
    --panel-bg: rgba(20, 20, 20, 0.6);
    --silver: #e2e8f0;
    --glass-border: rgba(57, 255, 20, 0.15);
    --glass-shine: rgba(255, 255, 255, 0.05);
  }

  /* Light mode overrides */
  .app-container.light {
    --dark-bg: #f5f5f5;
    --panel-bg: rgba(255, 255, 255, 0.9);
    --silver: #1a1a1a;
    --glass-border: rgba(16, 124, 16, 0.2);
    --glass-shine: rgba(0, 0, 0, 0.03);
  }

  .app-container.light .sidebar {
    background: rgba(255, 255, 255, 0.95);
    border-right-color: rgba(0, 0, 0, 0.1);
  }

  .app-container.light .main-content {
    background: #f0f0f0;
  }

  .app-container.light .nav-item {
    color: #333;
  }

  .app-container.light .nav-item:hover {
    background: rgba(16, 185, 129, 0.1);
  }

  .app-container.light .logo-brand,
  .app-container.light .mobile-header {
    color: #333;
  }

  .theme-toggle {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--silver);
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    margin-top: 20px;
  }

  .theme-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  .app-container.light .theme-toggle {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
  }

  .app-container.light .theme-toggle:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: none;
  }

  body {
    background-color: var(--dark-bg);
    color: var(--silver);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    overflow-x: hidden;
    min-height: 100vh;
    display: flex;
  }

  /* Background Animado */
  .animated-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background: radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 100%);
    overflow: hidden;
  }

  .bg-grid {
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    background-image: 
      linear-gradient(rgba(57, 255, 20, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(57, 255, 20, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    transform: perspective(500px) rotateX(60deg);
    animation: gridMove 20s linear infinite;
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;
    animation: floatOrb 10s infinite alternate cubic-bezier(0.45, 0.05, 0.55, 0.95);
  }

  .orb-1 { 
    width: 400px; 
    height: 400px; 
    background: var(--xbox-green); 
    top: -100px; 
    left: -100px; 
    animation-duration: 15s; 
  }

  .orb-2 { 
    width: 300px; 
    height: 300px; 
    background: var(--neon-green); 
    bottom: -50px; 
    right: -50px; 
    animation-duration: 12s; 
    opacity: 0.2; 
  }

  .orb-3 { 
    width: 200px; 
    height: 200px; 
    background: #ffffff; 
    top: 40%; 
    left: 40%; 
    animation-duration: 18s; 
    opacity: 0.05; 
  }

  /* Sidebar */
  .app-container {
    display: flex;
    min-height: 100vh;
    width: 100%;
  }

  .sidebar {
    width: 260px;
    background: rgba(10, 10, 10, 0.8);
    backdrop-filter: blur(20px);
    border-right: 1px solid var(--glass-border);
    display: flex;
    flex-direction: column;
    padding: 20px;
    position: fixed;
    height: 100vh;
    z-index: 100;
    transition: transform 0.3s ease;
  }

  .sidebar.mobile-hidden {
    transform: translateX(-100%);
  }

  .logo-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    position: relative;
  }

  .logo-brand {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;
  }


  .logo-text {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 0 0 10px var(--neon-green);
  }

  .logo-text span {
    color: var(--neon-green);
  }

  .nav-menu {
    list-style: none;
    flex: 1;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    color: #888;
    text-decoration: none;
    border-radius: 12px;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .nav-item:hover, .nav-item.active {
    background: rgba(57, 255, 20, 0.08);
    color: #fff;
    transform: translateX(5px);
    box-shadow: 0 0 20px rgba(57, 255, 20, 0.1);
    border: 1px solid rgba(57, 255, 20, 0.2);
  }

  .nav-item svg {
    transition: 0.3s;
    width: 20px;
    height: 20px;
  }

  .nav-item:hover svg {
    color: var(--neon-green);
    transform: scale(1.2) rotate(5deg);
  }

  .nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 60%;
    width: 4px;
    background: var(--neon-green);
    border-radius: 0 4px 4px 0;
    box-shadow: 0 0 10px var(--neon-green);
  }

  .nav-badge {
    margin-left: auto;
    background: #ef4444;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    min-width: 20px;
    text-align: center;
  }

  .sidebar-footer {
    margin-top: auto;
    padding: 20px 0;
    border-top: 1px solid rgba(255,255,255,0.05);
  }

  .logout-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    color: #ff4444;
    text-decoration: none;
    border-radius: 12px;
    font-weight: 500;
    transition: all 0.3s;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
    cursor: pointer;
  }

  .logout-btn:hover {
    background: rgba(255, 68, 68, 0.1);
    color: #ff6666;
  }

  .main-content {
    flex: 1;
    margin-left: 260px;
    padding: 30px;
    overflow-y: auto;
    position: relative;
    min-height: 100vh;
  }

  .mobile-header {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: rgba(10, 10, 10, 0.95);
    border-bottom: 1px solid var(--glass-border);
    backdrop-filter: blur(20px);
    z-index: 99;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
  }

  .menu-btn {
    background: transparent;
    border: none;
    color: var(--neon-green);
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: 0.3s;
  }

  .menu-btn:hover {
    background: rgba(57, 255, 20, 0.1);
  }

  .overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 99;
  }

  .overlay.show {
    display: block;
  }

  @keyframes gridMove {
    0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
    100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
  }

  @keyframes floatOrb {
    0% { transform: translate(0, 0); }
    100% { transform: translate(30px, -30px); }
  }

  @keyframes pulseLogo {
    0% {
      box-shadow: 0 0 15px #39ff14;
    }
    50% {
      box-shadow: 0 0 30px #39ff14, 0 0 10px #ffffff;
    }
    100% {
      box-shadow: 0 0 15px #39ff14;
    }
  }

  @media (max-width: 768px) {
    .sidebar {
      transform: translateX(-100%);
    }
    
    .sidebar.mobile-visible {
      transform: translateX(0);
    }
    
    .main-content {
      margin-left: 0;
      padding: 80px 16px 16px;
    }
    
    .mobile-header {
      display: flex;
    }

    .bg-grid {
      display: none;
    }
  }
`;

function AdminApp() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'light') ? 'light' : 'dark';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const checkAlerts = async () => {
      try {
        const data = await accountsAPI.expiring();
        if (Array.isArray(data)) {
          setAlertCount(data.length);
        }
      } catch (error) {
        console.error('Erro ao verificar alertas:', error);
        setAlertCount(0);
      }
    };

    checkAlerts();
  }, [activeTab]);

  const navItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'accounts' as TabType, label: 'Contas', icon: Package },
    { id: 'clients' as TabType, label: 'Clientes', icon: Users },
    { id: 'sales' as TabType, label: 'Vendas', icon: ShoppingCart },
    { id: 'alerts' as TabType, label: 'Alertas', icon: Bell, badge: alertCount },
  ];

  const handleNavClick = (tabId: TabType) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'accounts':
        return <AccountsManager />;
      case 'clients':
        return <ClientsManager />;
      case 'sales':
        return <SalesManager />;
      case 'alerts':
        return <AlertsPanel />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`app-container ${theme}`}>

        {/* Mobile Header */}
        <div className="mobile-header">
          <button
            className="menu-btn"
            onClick={() => setMobileMenuOpen(true)}
            title="Abrir menu"
            aria-label="Abrir menu"
          >
            <Menu size={24} />
          </button>
          <div className="flex-col items-center gap-4">
            <div className="brand-text">
              ASSINALIVEBR
            </div>
            <span className="logo-text text-lg">
              Game<span>Pass</span>
            </span>
          </div>
          <div className="spacer-40" />
        </div>

        {/* Overlay */}
        <div
          className={`overlay ${mobileMenuOpen ? 'show' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`sidebar ${mobileMenuOpen ? 'mobile-visible' : ''}`}>
          <div className="logo-area">
            <div className="logo-brand">ASSINALIVEBR</div>
            <div className="logo-text">
              Game<span>Pass</span>
            </div>
            <button
              className={`menu-btn absolute top-0 right-0 ${mobileMenuOpen ? 'block' : 'hidden'}`}
              onClick={() => setMobileMenuOpen(false)}
              title="Fechar menu"
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="nav-menu">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <item.icon size={20} />
                {item.label}
                {item.badge && item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            </button>
            <button className="logout-btn">
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </>
  );
}

export default function App() {
  const [isPortal, setIsPortal] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    setIsPortal(path.startsWith('/portal'));

    const handlePopState = () => {
      const newPath = window.location.pathname;
      setIsPortal(newPath.startsWith('/portal'));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (isPortal) {
    return <PortalApp />;
  }

  return <AdminApp />;
}
