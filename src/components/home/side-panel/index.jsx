import React from 'react'
import { Box,  Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Typography, useMediaQuery, useTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import './side-panel.css';
import { GradientButton } from '../../buttons';
import { SocialButtons } from '../../social-buttons';

const SidePanel = ({ drawerOpen, setTabTitle, loadSession, startNewSession, sessions, toggleDrawer }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box>
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            borderTopRightRadius: '30px',
            borderBottomRightRadius: '30px',
            background: '#252525',
          },
          overflow: 'hidden',
        }}
      >
        <Box sx={{ overflow: 'hidden', overflowX: 'hidden', background: '#252525', height: '100vh' }}>
          <Box justifyContent={'center'} mt={5}>
            <Box display='flex' justifyContent='space-between' alignItems='center' >
              <Typography className='h4' variant="h4" sx={{ px: 2, py: 1, }}>
                Discuss Ai.
              </Typography>
              <IconButton
                edge="start"
                aria-label="menu"
                onClick={toggleDrawer}
                sx={{ mr: 2 }}
              >
                <MenuIcon sx={{ color: '#888' }} />
              </IconButton>
            </Box>
            <Box display='flex' my={5} justifyContent={'center'}>
              <GradientButton startNewSession={startNewSession} />
            </Box>
          </Box>
          <Box sx={{
            overflowY: 'auto', maxHeight: 'calc(100vh - 330px)',
            scrollbarColor: '#888 transparent',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: 10,
            },
          }}>
            <List>
              {sessions.map((item) => {
                const date = new Date(item?.id);

                const formattedDate = date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                });

                const title = item?.history?.[0]?.userText
                            ? item.history[0].userText.length > 50
                              ? item.history[0].userText.slice(0, 50) + '...'
                              : item.history[0].userText
                            : 'New Chat'
                  setTabTitle(title);
                return (
                  <ListItem key={item.id} disablePadding>
                    <ListItemButton onClick={() => loadSession(item.id)}>
                      <ListItemText sx={{ color: '#fff', fontSize: 14, fontWeight: 'bold', }}
                        primary={
                          item?.history?.[0]?.userText
                            ? item.history[0].userText.length > 50
                              ? item.history[0].userText.slice(0, 50) + '...'
                              : item.history[0].userText
                            : 'New Chat'
                        } secondary={formattedDate}
                        secondaryTypographyProps={{ sx: { color: '#888', fontWeight: 'bold', textAlign: 'right', fontSize: 10 } }}
                      />
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
          </Box>

        </Box>
        <Box pb={2}>
          <Divider sx={{my: 2}} variant='middle' color='#888' />
          <SocialButtons />
        </Box>
      </Drawer>
    </Box>
  )
}

export default SidePanel