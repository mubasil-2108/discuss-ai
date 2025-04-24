import { Box, OutlinedInput, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import './home.css';
import { useEffect, useRef, useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Buttons, FormattedText } from '../../components';
import { useOutletContext } from 'react-router-dom';

const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_MODEL_API });
const main = async (input, setAnswerLoading) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: input,
    });
    return response.text;
  } catch (err) {
    console.log(err, 'Error');
    setAnswerLoading(false);
  }

}


const Home = () => {
  const { startNewSession, setSessions, sessions, currentSessionId, input, setInput } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [answerLoading, setAnswerLoading] = useState(false);
  const [answer, setAnswer] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [answer, answerLoading]);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setAnswerLoading(true);
    const response = await main(userMessage, setAnswerLoading);

    if (response) {
      const entry = {
        userText: userMessage,
        aiText: response,
        timestamp: new Date(),
      };

      setAnswer(prev => [...prev, entry]); // for current UI

      // Update session history
      setSessions(prev =>
        prev.map(session =>
          session.id === currentSessionId
            ? { ...session, history: [...session.history, entry] }
            : session
        )
      );

      setAnswerLoading(false);
    }
  };
  return (
    <>
      <Box className="el" sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />

      {(sessions.find(s => s.id === currentSessionId)?.history.length===0) && (
        <Typography variant={isMobile ? 'h4' : 'h2'} className='h1' sx={{ textAlign: 'center', mt: 4 }}>
          Discuss Ai.
        </Typography>
      )}

      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          pb: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            width: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column-reverse',
            alignItems: 'center',
            mt:8,
            pt: 2,
            px: isMobile ? 1 : 2,
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
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '800px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 2,
              py: 2,
            }}
          >

            {(() => {
              const currentSession = sessions.find(s => s.id === currentSessionId);
              const allMessages = [...(currentSession?.history || [])];

              return allMessages.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                  <Box sx={{ maxWidth: isMobile ? 300 : 900, background: '#494848', borderRadius: 2, p: 2 }}>
                    <FormattedText text={item.userText} />
                    <Typography color='#fff' fontSize={10} sx={{ opacity: 0.5, textAlign: 'right', mt: 1 }}>
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                  <Box sx={{ maxWidth: isMobile ? 300 : 900, background: '#252525', borderRadius: 2, p: 2 }}>
                    <FormattedText text={item.aiText} />
                    <Typography color='#fff' fontSize={10} sx={{ opacity: 0.5, textAlign: 'right', mt: 1 }}>
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                </Box>
              ));
            })()}

            {answerLoading && (
              <Skeleton variant='rectangular' animation="wave" sx={{ borderRadius: 2, opacity: 0.7, background: '#333232e3' }} width={isMobile ? 300 : 500} height={60} />
            )}

            <div ref={messagesEndRef} />
          </Box>
        </Box>

        <Box
          component={'form'}
          onSubmit={onSubmit}
          display='flex'
          alignItems='center'
          gap={1}
          justifyContent='center'
          p={1}
          width={isMobile ? 300 : 600}
          mt={2}
        >
          <Box
            aria-label='input'
            sx={{
              flex: 1,
              background: '#252525',
              borderRadius: 2,
              maxHeight: 90,
              overflow: 'auto',
              scrollbarColor: '#888 transparent',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: 10,
              },
            }}
            ref={inputRef}
          >
            <OutlinedInput
              fullWidth
              multiline
              placeholder="Please enter text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              size="small"
              sx={{
                width: '100%',
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.MuiOutlinedInput-root': {
                  border: 'none',
                },
              }}
            />
          </Box>

          <Buttons.LoadingIconButton setInput={setInput} loading={answerLoading} />
        </Box>
      </Box>
    </>
  );
}

export default Home;
