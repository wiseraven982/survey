import React, { useState, useRef, useEffect } from "react";
import { Button, Typography, Paper, Box, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { sendMessageToGigaChat } from "../services/api";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
  
    const userMessage = input.trim();
    setMessages([...messages, { text: userMessage, sender: "user" }]);
    setLoading(true);
  
    try {
      const botResponse = await sendMessageToGigaChat(userMessage);
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Ошибка:", error);
      setMessages((prev) => [
        ...prev,
        { text: `Ошибка: ${error.message}`, sender: "bot" },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        height: "100%",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          padding: "12px",
          background: "linear-gradient(45deg, #1e42f7, #4a90e2)",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "8px 8px 0 0",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6">🤖 Gen-AI GigaChat</Typography>
      </Box>

      <Box
        sx={{
          p: 2,
          flex: 1,
          overflowY: "auto",
          padding: "12px",
          backgroundColor: "#fff",
          minHeight: "200px",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: msg.sender === "user" ? "row-reverse" : "row",
              mb: 1,
            }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: "8px",
                maxWidth: "80%",
                wordBreak: "break-word",
                backgroundColor: msg.sender === "user" ? "#e3f2fd" : "#f5f5f5",
              }}
            >
              <Typography variant="body2">
                <strong>{msg.sender === "user" ? "Вы" : "Bot"}:</strong> {msg.text}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={chatEndRef} />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "12px",
          borderTop: "1px solid #ddd",
          backgroundColor: "#fff",
        }}
      >
        <TextField
          fullWidth
          multiline
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Задайте вопрос..."
          disabled={loading}
          sx={{ mb: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          onClick={sendMessage}
          startIcon={<SendIcon />}
        >
          {loading ? "Отправка..." : "Отправить"}
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatBot;