import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useTheme, useMediaQuery } from "@mui/material";
import { Typography, Box, Link } from '@mui/material';

const CodeBlock = ({ inline, className, children, ...props }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDarkMode = "dark";
  
    // Extract language from className
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "text";
  
    // Inline code styling
    if (inline) {
      return (
        <Typography
          component="span"
          sx={{
            fontFamily: "monospace",
            bgcolor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            color: isDarkMode ? "#FF79C6" : "#D6336C",
            p: "0.2em 0.4em",
            borderRadius: "4px",
            fontSize: isMobile ? "0.8em" : "0.9em",
          }}
          {...props}
        >
          {children}
        </Typography>
      );
    }
  
    // Full code block with syntax highlighting
    return (
      <Box sx={{ overflowX: 'scroll' }}>
        <SyntaxHighlighter
          language={language}
          style={materialDark}
          customStyle={{
            borderRadius: "8px",
            padding: isMobile ? "12px" : "16px",
            margin: isMobile ? "8px 0" : "16px 0",
            fontSize: isMobile ? "0.8rem" : "0.9rem",
            lineHeight: "1.5",
            background: "#011627",
          }}
          showLineNumbers={!isMobile} // Hide line numbers on mobile to save space
          wrapLines={isMobile} // Wrap lines on mobile
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </Box>
    );
};

const FormattedText = ({ text }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{
      maxWidth: isMobile? 300: 700,
      overflowX: 'auto',
      '& img': {
        maxWidth: '100%',
        height: 'auto'
      }
    }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Paragraphs
          p: ({ node, ...props }) => (
            <Typography sx={{ 
              fontSize: isMobile ? 13 : 14, 
              color: '#ffffffe8', 
              whiteSpace: 'pre-wrap', 
              mb: isMobile ? 1 : 2,
              lineHeight: 1.6
            }} {...props} />
          ),
          // Headers
          h1: ({ node, ...props }) => (
            <Typography variant="h1" sx={{ 
              fontSize: isMobile ? '1.8rem' : '2.2rem',
              mt: isMobile ? 2 : 3,
              mb: isMobile ? 1 : 2,
              fontWeight: 600
            }} {...props} />
          ),
          h2: ({ node, ...props }) => (
            <Typography variant="h2" sx={{ 
              fontSize: isMobile ? '1.5rem' : '1.8rem',
              mt: isMobile ? 2 : 3,
              mb: isMobile ? 1 : 2,
              fontWeight: 600
            }} {...props} />
          ),
          h3: ({ node, ...props }) => (
            <Typography variant="h3" sx={{ 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              mt: isMobile ? 1.5 : 2,
              mb: isMobile ? 0.5 : 1,
              fontWeight: 600
            }} {...props} />
          ),
          // Emphasis/italic
          em: ({ node, ...props }) => (
            <Typography component="em" sx={{ 
              fontSize: isMobile ? 13 : 14, 
              fontStyle: 'italic' 
            }} {...props} />
          ),
          // Strong/bold
          strong: ({ node, ...props }) => (
            <Typography component="strong" sx={{ 
              fontSize: isMobile ? 13 : 14, 
              color: '#ffffff', 
              fontWeight: 'bold' 
            }} {...props} />
          ),
          // Links
          a: ({ node, ...props }) => (
            <Link 
              href={props.href} 
              target="_blank" 
              rel="noopener" 
              color="primary" 
              sx={{
                wordBreak: 'break-word' // Prevent long URLs from breaking layout
              }} 
              {...props} 
            />
          ),
          // Lists
          ul: ({ node, ...props }) => (
            <Box 
              component="ul" 
              sx={{ 
                pl: isMobile ? 2 : 3,
                my: isMobile ? 0.5 : 1
              }} 
              {...props} 
            />
          ),
          ol: ({ node, ...props }) => (
            <Box 
              component="ol" 
              sx={{ 
                pl: isMobile ? 2 : 3,
                my: isMobile ? 0.5 : 1
              }} 
              {...props} 
            />
          ),
          li: ({ node, ...props }) => (
            <Box component="li" sx={{ 
              fontSize: isMobile ? 13 : 14, 
              color: '#ffffffe8',
              mb: isMobile ? 0.5 : 1,
              '& p': {
                margin: 0 // Remove paragraph margin inside list items
              }
            }}>
              <Typography sx={{ 
                fontSize: isMobile ? 13 : 14, 
                color: '#ffffffe8',
                display: 'inline'
              }} component="span" {...props} />
            </Box>
          ),
          // Code blocks
          code: CodeBlock,
          // Tables
          table: ({ node, ...props }) => (
            <Box sx={{ overflowX: 'auto', my: isMobile ? 1 : 2 }}>
              <Box 
                component="table" 
                sx={{ 
                  width: '100%',
                  minWidth: isMobile ? '500px' : 'auto',
                  borderCollapse: 'collapse',
                  backgroundColor: '#2d2d2d',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }} 
                {...props} 
              />
            </Box>
          ),
          thead: ({ node, ...props }) => (
            <Box 
              component="thead" 
              sx={{ 
                backgroundColor: '#3a3a3a',
              }} 
              {...props} 
            />
          ),
          tbody: ({ node, ...props }) => (
            <Box 
              component="tbody" 
              sx={{ 
                '& tr:not(:last-child)': {
                  borderBottom: '1px solid #444',
                },
              }} 
              {...props} 
            />
          ),
          tr: ({ node, ...props }) => (
            <Box 
              component="tr" 
              sx={{ 
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }} 
              {...props} 
            />
          ),
          th: ({ node, ...props }) => (
            <Typography 
              component="th" 
              sx={{ 
                fontSize: isMobile ? 12 : 14,
                color: '#ffffff',
                fontWeight: 'bold',
                p: isMobile ? 1 : 1.5,
                textAlign: 'left',
                borderBottom: '2px solid #555',
              }} 
              {...props} 
            />
          ),
          td: ({ node, ...props }) => (
            <Typography 
              component="td" 
              sx={{ 
                fontSize: isMobile ? 12 : 14,
                color: '#ffffffe8',
                p: isMobile ? 1 : 1.5,
                wordBreak: 'break-word', // Prevent content overflow
              }} 
              {...props} 
            />
          ),
          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <Box
              component="blockquote"
              sx={{
                borderLeft: '4px solid #555',
                pl: isMobile ? 2 : 3,
                my: isMobile ? 1 : 2,
                ml: isMobile ? 1 : 2,
                color: '#aaaaaa',
                fontStyle: 'italic',
                '& p': {
                  margin: 0
                }
              }}
              {...props}
            />
          ),
          // Images
          img: ({ node, ...props }) => (
            <Box
              component="img"
              sx={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
                my: isMobile ? 1 : 2,
                borderRadius: '4px'
              }}
              {...props}
            />
          )
        }}
      >
        {text}
      </ReactMarkdown>
    </Box>
  );
};

export default FormattedText;