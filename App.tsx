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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_auth') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'light') ? 'light' : 'dark';
  });

  // Credenciais de acesso
  const ADMIN_EMAIL = 'jvcompany23@gmail.com';
  const ADMIN_PASSWORD = 'joaovitor12';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === ADMIN_EMAIL && loginPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Email ou senha incorretos');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

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

    if (isAuthenticated) {
      checkAlerts();
    }
  }, [activeTab, isAuthenticated]);

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

  // Tela de Login Premium
  if (!isAuthenticated) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          .login-universe {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(ellipse at 50% 0%, #0a1a0a 0%, #000000 50%, #000000 100%);
            overflow: hidden;
            position: relative;
            font-family: 'Rajdhani', sans-serif;
          }
          
          /* Animated Grid Background */
          .grid-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
              linear-gradient(rgba(57, 255, 20, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(57, 255, 20, 0.03) 1px, transparent 1px);
            background-size: 60px 60px;
            animation: gridPulse 4s ease-in-out infinite;
          }
          
          @keyframes gridPulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          
          /* Floating Orbs */
          .orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(100px);
            animation: floatOrb 20s infinite;
          }
          
          .orb-1 {
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(57, 255, 20, 0.15) 0%, transparent 70%);
            top: -200px;
            left: -200px;
            animation-delay: 0s;
          }
          
          .orb-2 {
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(16, 124, 16, 0.2) 0%, transparent 70%);
            bottom: -150px;
            right: -150px;
            animation-delay: -5s;
          }
          
          .orb-3 {
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(57, 255, 20, 0.1) 0%, transparent 70%);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation-delay: -10s;
          }
          
          @keyframes floatOrb {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(30px, -30px) scale(1.05); }
            50% { transform: translate(-20px, 20px) scale(0.95); }
            75% { transform: translate(20px, 30px) scale(1.02); }
          }
          
          /* Particles */
          .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
          }
          
          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #39ff14;
            border-radius: 50%;
            opacity: 0;
            animation: particleFloat 8s infinite;
          }
          
          .particle:nth-child(1) { left: 10%; animation-delay: 0s; }
          .particle:nth-child(2) { left: 20%; animation-delay: 1s; }
          .particle:nth-child(3) { left: 30%; animation-delay: 2s; }
          .particle:nth-child(4) { left: 40%; animation-delay: 3s; }
          .particle:nth-child(5) { left: 50%; animation-delay: 4s; }
          .particle:nth-child(6) { left: 60%; animation-delay: 5s; }
          .particle:nth-child(7) { left: 70%; animation-delay: 6s; }
          .particle:nth-child(8) { left: 80%; animation-delay: 7s; }
          .particle:nth-child(9) { left: 90%; animation-delay: 0.5s; }
          .particle:nth-child(10) { left: 15%; animation-delay: 1.5s; }
          .particle:nth-child(11) { left: 25%; animation-delay: 2.5s; }
          .particle:nth-child(12) { left: 35%; animation-delay: 3.5s; }
          .particle:nth-child(13) { left: 45%; animation-delay: 4.5s; }
          .particle:nth-child(14) { left: 55%; animation-delay: 5.5s; }
          .particle:nth-child(15) { left: 65%; animation-delay: 6.5s; }
          .particle:nth-child(16) { left: 75%; animation-delay: 7.5s; }
          .particle:nth-child(17) { left: 85%; animation-delay: 0.2s; }
          .particle:nth-child(18) { left: 95%; animation-delay: 1.2s; }
          .particle:nth-child(19) { left: 5%; animation-delay: 2.2s; }
          .particle:nth-child(20) { left: 48%; animation-delay: 3.2s; }
          
          @keyframes particleFloat {
            0% { bottom: -10px; opacity: 0; transform: scale(0); }
            10% { opacity: 1; transform: scale(1); }
            90% { opacity: 1; transform: scale(1); }
            100% { bottom: 100vh; opacity: 0; transform: scale(0); }
          }
          
          /* Login Card */
          .login-card-premium {
            position: relative;
            background: rgba(10, 10, 10, 0.85);
            border: 1px solid rgba(57, 255, 20, 0.3);
            border-radius: 30px;
            padding: 60px 50px;
            width: 100%;
            max-width: 480px;
            backdrop-filter: blur(30px);
            box-shadow: 
              0 0 60px rgba(57, 255, 20, 0.1),
              0 25px 50px -12px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
            animation: cardEntry 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(30px) scale(0.95);
            z-index: 10;
          }
          
          @keyframes cardEntry {
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          
          .login-card-premium::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, transparent, rgba(57, 255, 20, 0.3), transparent);
            border-radius: 32px;
            z-index: -1;
            animation: borderGlow 3s linear infinite;
          }
          
          @keyframes borderGlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          /* Logo Section */
          .login-logo-premium {
            text-align: center;
            margin-bottom: 50px;
            animation: logoEntry 1s 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(20px);
          }
          
          @keyframes logoEntry {
            to { opacity: 1; transform: translateY(0); }
          }
          
          .login-logo-premium .brand {
            font-family: 'Orbitron', sans-serif;
            font-size: 13px;
            font-weight: 600;
            color: rgba(57, 255, 20, 0.7);
            letter-spacing: 8px;
            margin-bottom: 15px;
            text-transform: uppercase;
          }
          
          .login-logo-premium .title {
            font-family: 'Orbitron', sans-serif;
            font-size: 42px;
            font-weight: 800;
            color: #fff;
            text-shadow: 
              0 0 20px rgba(57, 255, 20, 0.5),
              0 0 40px rgba(57, 255, 20, 0.3),
              0 0 60px rgba(57, 255, 20, 0.1);
            animation: titleGlow 2s ease-in-out infinite;
          }
          
          .login-logo-premium .title span {
            color: #39ff14;
            text-shadow: 
              0 0 10px #39ff14,
              0 0 20px #39ff14,
              0 0 30px #39ff14,
              0 0 40px #39ff14;
          }
          
          @keyframes titleGlow {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.2); }
          }
          
          .login-logo-premium .subtitle {
            font-size: 16px;
            color: #666;
            margin-top: 8px;
            letter-spacing: 2px;
          }
          
          /* Form */
          .login-form-premium {
            display: flex;
            flex-direction: column;
            gap: 25px;
          }
          
          .input-group {
            position: relative;
            animation: inputEntry 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateX(-20px);
          }
          
          .input-group:nth-child(1) { animation-delay: 0.5s; }
          .input-group:nth-child(2) { animation-delay: 0.6s; }
          .input-group:nth-child(3) { animation-delay: 0.7s; }
          
          @keyframes inputEntry {
            to { opacity: 1; transform: translateX(0); }
          }
          
          .input-icon {
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(57, 255, 20, 0.5);
            font-size: 18px;
            transition: color 0.3s;
          }
          
          .login-input-premium {
            width: 100%;
            background: rgba(0, 0, 0, 0.6);
            border: 2px solid rgba(57, 255, 20, 0.15);
            border-radius: 16px;
            padding: 20px 20px 20px 55px;
            font-size: 16px;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 500;
            color: #fff;
            outline: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .login-input-premium::placeholder {
            color: #555;
            font-weight: 400;
          }
          
          .login-input-premium:focus {
            border-color: #39ff14;
            box-shadow: 
              0 0 0 4px rgba(57, 255, 20, 0.1),
              0 0 20px rgba(57, 255, 20, 0.2);
            background: rgba(0, 0, 0, 0.8);
          }
          
          .input-group:focus-within .input-icon {
            color: #39ff14;
          }
          
          /* Button */
          .login-btn-premium {
            position: relative;
            background: linear-gradient(135deg, #39ff14 0%, #20c20e 50%, #107c10 100%);
            border: none;
            border-radius: 16px;
            padding: 22px;
            font-size: 18px;
            font-family: 'Orbitron', sans-serif;
            font-weight: 700;
            color: #000;
            cursor: pointer;
            letter-spacing: 3px;
            text-transform: uppercase;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            animation: btnEntry 0.8s 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(20px);
          }
          
          @keyframes btnEntry {
            to { opacity: 1; transform: translateY(0); }
          }
          
          .login-btn-premium::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            transition: left 0.5s;
          }
          
          .login-btn-premium:hover {
            transform: translateY(-3px);
            box-shadow: 
              0 10px 40px rgba(57, 255, 20, 0.4),
              0 0 60px rgba(57, 255, 20, 0.2);
          }
          
          .login-btn-premium:hover::before {
            left: 100%;
          }
          
          .login-btn-premium:active {
            transform: translateY(0);
          }
          
          /* Error */
          .login-error-premium {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.4);
            color: #ff6b6b;
            padding: 16px 20px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            text-align: center;
            animation: errorShake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
          }
          
          @keyframes errorShake {
            10%, 90% { transform: translateX(-1px); }
            20%, 80% { transform: translateX(2px); }
            30%, 50%, 70% { transform: translateX(-4px); }
            40%, 60% { transform: translateX(4px); }
          }
          
          /* Footer */
          .login-footer {
            margin-top: 40px;
            text-align: center;
            animation: footerEntry 1s 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
          
          @keyframes footerEntry {
            to { opacity: 1; }
          }
          
          .login-footer p {
            color: #444;
            font-size: 12px;
            letter-spacing: 1px;
          }
          
          .login-footer .secure-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-top: 15px;
            padding: 8px 16px;
            background: rgba(57, 255, 20, 0.05);
            border: 1px solid rgba(57, 255, 20, 0.2);
            border-radius: 20px;
            color: rgba(57, 255, 20, 0.7);
            font-size: 11px;
            letter-spacing: 2px;
          }
          
          .secure-badge::before {
            content: '🔒';
          }
        `}</style>
        <div className="login-universe">
          <div className="grid-bg"></div>
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="particles">
            {[...Array(20)].map((_, i) => <div key={i} className="particle"></div>)}
          </div>

          <div className="login-card-premium">
            <div className="login-logo-premium">
              <div className="brand">ASSINALIVEBR</div>
              <div className="title">Game<span>Pass</span></div>
              <div className="subtitle">Management System</div>
            </div>

            <form className="login-form-premium" onSubmit={handleLogin}>
              {loginError && <div className="login-error-premium">{loginError}</div>}

              <div className="input-group">
                <span className="input-icon">✉</span>
                <input
                  type="email"
                  className="login-input-premium"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <span className="input-icon">🔐</span>
                <input
                  type="password"
                  className="login-input-premium"
                  placeholder="Senha"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-btn-premium">
                Acessar Sistema
              </button>
            </form>

            <div className="login-footer">
              <p>Acesso restrito a administradores</p>
              <div className="secure-badge">CONEXÃO SEGURA</div>
            </div>
          </div>
        </div>
      </>
    );
  }

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
            <button className="logout-btn" onClick={handleLogout}>
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
