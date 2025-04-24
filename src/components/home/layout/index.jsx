import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import SidePanel from '../side-panel';
import { Outlet } from 'react-router-dom';
import { AnimatedButton } from '../../buttons';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const [tabTitle, setTabTitle] = useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sessions, setSessions] = useState([]);
  const [input, setInput] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const startNewSession = useCallback(() => {
    const newSession = {
      id: Date.now(),
      history: [],
    };
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    setInput('');
  }, []);
  useEffect(() => {
    if (sessions.length === 0) {
      startNewSession();
    }
  }, [sessions.length, startNewSession]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const loadSession = (id) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setCurrentSessionId(id);
    }
    if (isMobile) {
      setDrawerOpen(false);
    }
  };
  useEffect(() => {
    document.title = `Discuss Ai. | ${tabTitle}`; // 🔁 Change this string to whatever you want
  }, [tabTitle]);

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
      {/* App Bar */}
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 5,
          left: 0,
          right: 0,
          height: '64px',
          bgcolor: 'transparent',
          borderColor: 'divider',
          justifyContent: 'space-between',
          display: 'flex',
          alignItems: 'center',
          py: 2,
          px: 4,
        }}
      >
        {
          !drawerOpen && (
            <IconButton
              edge="start"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ mr: 2, ":hover": { background: '#252525' } }}
            >
              <MenuIcon sx={{ color: '#888' }} />
            </IconButton>
          )
        }
        {
          !isMobile && (
            <AnimatedButton startNewSession={startNewSession} />
          )
        }
      </Box>
      <SidePanel toggleDrawer={toggleDrawer} setTabTitle={setTabTitle} loadSession={loadSession} sessions={sessions} startNewSession={startNewSession} drawerOpen={drawerOpen} />
      <Box
        component="main"
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        <Outlet context={{ startNewSession, setSessions, sessions, currentSessionId, input, setInput }} />
      </Box>
    </Box>
  );
};

export default MainLayout;