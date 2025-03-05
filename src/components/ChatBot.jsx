import React, { useState, useRef, useEffect } from "react";
import { Button, Typography, Paper, Box, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Токен доступа к GigaChat API
  const GIGACHAT_API_TOKEN = "ZTY2NmJhNzEtMjQ5Ny00YTI3LTk1NmUtYmQxYWY0MDE4MGUyOjI2Y2U2ZDMyLTI2MjgtNDQ5OC05YmY0LTQ2MmExOTkxZjc3Nw=="; // Замените на ваш токен

  // Скроллим вниз при обновлении сообщений
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Функция отправки сообщения
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Отправляем запрос к GigaChat API
      const response = await fetch("https://gigachat.devices.sberbank.ru/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GIGACHAT_API_TOKEN}`,
        },
        body: JSON.stringify({
          messages: [
            { role: "user", content: input },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;
      setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Ошибка при запросе к GigaChat API:", error);
      setMessages([
        ...newMessages,
        { text: `Ошибка: ${error.message}`, sender: "bot" },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  // Отправка по Enter (без Shift)
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
      {/* Заголовок "Gen-AI GigaChat" */}
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

      {/* Контейнер с сообщениями */}
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
                <strong>{msg.sender === "user" ? "Вы" : "Bot"}:</strong>{" "}
                {msg.text}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={chatEndRef} />
      </Box>

      {/* Поле ввода и кнопка отправки */}
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