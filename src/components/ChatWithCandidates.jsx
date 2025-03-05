import React, { useState, useEffect } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Paper,
    Box,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    IconButton, // Добавляем IconButton для кнопки сброса
    InputAdornment, // Добавляем InputAdornment для размещения иконки внутри TextField
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close"; // Иконка крестика
import { createWebSocketConnection } from "../services/api";

const ChatWithCandidates = ({ candidates }) => {
    const [expanded, setExpanded] = useState(null); // Состояние для открытого аккордеона
    const [messages, setMessages] = useState({}); // Хранилище сообщений для каждого кандидата
    const [newMessage, setNewMessage] = useState(""); // Текущее сообщение для отправки
    const [ws, setWs] = useState(null); // Состояние для WebSocket
    const [searchQuery, setSearchQuery] = useState(""); // Состояние для поискового запроса

    // Обработчик для открытия/закрытия аккордеона
    const handleChange = (panel, candidateId) => (event, isExpanded) => {
        setExpanded(isExpanded ? `panel-${candidateId}` : null);
        if (isExpanded) {
            fetchIncomingMessages(candidateId); // Загружаем сообщения при открытии аккордеона
        }
    };

    // Функция для получения сообщений через WebSocket
    const fetchIncomingMessages = async (candidateId) => {
        try {
            console.log(`📩 Загрузка сообщений для кандидата ${candidateId}...`);

            // Отправляем запрос на загрузку истории через WebSocket
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(
                    JSON.stringify({
                        type: "load_history",
                        candidateId: candidateId,
                    })
                );
            } else {
                console.error("❌ WebSocket не установлен или закрыт");
            }
        } catch (error) {
            console.error("❌ Ошибка при загрузке сообщений:", error);
        }
    };

    // Подключение к WebSocket при монтировании компонента
    useEffect(() => {
        const userId = 1; // ID администратора
        const handleMessage = (message) => {
            console.log("Получено новое сообщение через WebSocket:", message);
    
            if (message.type === "history") {
                // Обновляем состояние messages с историей переписки
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [message.candidateId]: message.history.map((msg) => ({
                        ...msg,
                        sender: msg.sender_id === userId ? "admin" : "candidate",
                    })),
                }));
            } else if (message.type === "message") {
                // Обновляем состояние messages с новым сообщением
                setMessages((prevMessages) => {
                    const updatedMessages = { ...prevMessages };
    
                    // Определяем, куда добавить сообщение (в зависимости от receiver_id или sender_id)
                    const chatId = message.receiver_id === userId ? message.sender_id : message.receiver_id;
    
                    // Добавляем новое сообщение в соответствующий чат
                    updatedMessages[chatId] = [
                        ...(updatedMessages[chatId] || []),
                        {
                            id: Date.now(), // Генерируем уникальный ID для сообщения
                            text: message.text,
                            timestamp: message.timestamp,
                            sender: message.sender_id === userId ? "admin" : "candidate",
                        },
                    ];
    
                    return updatedMessages;
                });
            }
        };
    
        const socket = createWebSocketConnection(userId, handleMessage);
        setWs(socket);
    
        // Закрытие соединения при размонтировании компонента
        return () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, []);

    // Отправка сообщения через WebSocket
    const handleSendMessage = (receiverId) => {
      if (!newMessage.trim()) return;
  
      try {
          const messageData = {
              type: "message",
              receiver_id: parseInt(receiverId, 10),
              text: newMessage,
          };
  
          console.log("Отправка сообщения через WebSocket:", messageData);
  
          if (ws && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify(messageData));
          } else {
              console.error("❌ WebSocket не установлен или закрыт");
          }
  
          // Добавляем сообщение в локальное состояние
          setMessages((prevMessages) => ({
              ...prevMessages,
              [receiverId]: [
                  ...(prevMessages[receiverId] || []),
                  {
                      id: Date.now(),
                      text: newMessage,
                      timestamp: new Date().toISOString(),
                      sender: "admin",
                  },
              ],
          }));
  
          setNewMessage("");
      } catch (error) {
          console.error("❌ Ошибка при отправке сообщения через WebSocket:", error);
      }
  };

    // Фильтрация кандидатов по фамилии
    const filteredCandidates = candidates.filter((candidate) =>
        candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Функция для сброса поискового запроса
    const handleClearSearch = () => {
        setSearchQuery("");
    };

    return (
        <Paper
            sx={{
                p: 2,
                flex: 1,
                overflowY: "auto",
                "::-webkit-scrollbar": { width: "6px" },
                "::-webkit-scrollbar-thumb": {
                    backgroundColor: "#aaa",
                    borderRadius: "3px",
                },
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
            }}
        >
            {/* Заголовок */}
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center", color: "#333" }}>
                📧 Чат с кандидатами
            </Typography>

            {/* Поле поиска с кнопкой сброса */}
            <TextField
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по фамилии..."
                sx={{ mb: 2 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {searchQuery && ( // Показываем крестик только если есть текст в поле поиска
                                <IconButton onClick={handleClearSearch} size="small">
                                    <CloseIcon />
                                </IconButton>
                            )}
                        </InputAdornment>
                    ),
                }}
            />

            {/* Если есть кандидаты, отображаем их список */}
            {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => (
                    <Accordion
                        key={candidate.user_id}
                        sx={{ mb: 2, maxHeight: "400px", overflowY: "auto" }} // Ограничиваем высоту и добавляем прокрутку
                        expanded={expanded === `panel-${candidate.user_id}`}
                        onChange={handleChange(`panel-${candidate.user_id}`, candidate.user_id)}
                    >
                        {/* Заголовок аккордеона */}
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                {candidate.photo_url ? (
                                    <img
                                        src={candidate.photo_url}
                                        alt={candidate.full_name}
                                        onError={(e) => (e.target.style.display = "none")}
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            marginRight: "15px",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                        }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "50%",
                                            backgroundColor: "#ccc",
                                            
                                        }}
                                    />
                                )}
                                <Typography variant="h6">{candidate.full_name}</Typography>
                            </Box>
                        </AccordionSummary>

                        {/* Содержимое аккордеона */}
                        <AccordionDetails>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {/* Список сообщений */}
                                <List>
    {messages[candidate.user_id]?.length > 0 ? (
        messages[candidate.user_id].map((message) => (
            <React.Fragment key={message.id}>
                {/* Сообщение администратора */}
                {message.sender === "admin" && (
                    <ListItem
                        key={message.id}
                        sx={{
                            alignSelf: "flex-end",
                            bgcolor: "#dcf8c6",
                            borderRadius: "10px",
                            maxWidth: "70%",
                            ml: "auto",
                            mr: 0,
                            py: 0.5, // Уменьшаем вертикальные отступы
                            px: 1.5, // Уменьшаем горизонтальные отступы
                            my: 0.5, // Добавляем небольшой отступ между сообщениями
                            
                        }}
                    >
                        <ListItemText
                            primary={message.text}
                            primaryTypographyProps={{ style: { fontSize: "0.875rem" } }} // Уменьшаем размер текста
                            secondary={`Вы - ${new Date(message.timestamp).toLocaleTimeString()}`}
                            secondaryTypographyProps={{ style: { fontSize: "0.75rem" } }} // Уменьшаем размер текста времени
                        />
                    </ListItem>
                )}

                {/* Сообщение кандидата */}
                {message.sender === "candidate" && (
                    <ListItem
                        key={message.id}
                        sx={{
                            alignSelf: "flex-start",
                            bgcolor: "#f0f0f0",
                            borderRadius: "10px",
                            maxWidth: "70%",
                            ml: 0,
                            mr: "auto",
                            py: 0.5, // Уменьшаем вертикальные отступы
                            px: 1.5, // Уменьшаем горизонтальные отступы
                            my: 0.5, // Добавляем небольшой отступ между сообщениями
                            
                        }}
                    >
                        <ListItemText
                            primary={message.text}
                            primaryTypographyProps={{ style: { fontSize: "0.875rem" } }} // Уменьшаем размер текста
                            secondary={`${candidate.full_name} - ${new Date(message.timestamp).toLocaleTimeString()}`}
                            secondaryTypographyProps={{ style: { fontSize: "0.75rem" } }} // Уменьшаем размер текста времени
                        />
                    </ListItem>
                )}

                {/* Разделитель между сообщениями */}
                <Divider key={`divider-${message.id}`} />
            </React.Fragment>
        ))
    ) : (
        <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
            Нет сообщений
        </Typography>
    )}
</List>

                                {/* Поле ввода и кнопка отправки */}
                                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                handleSendMessage(candidate.user_id);
                                            }
                                        }}
                                        placeholder="Введите сообщение..."
                                        InputProps={{
                                            style: { fontSize: "1rem" },
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={() => handleSendMessage(candidate.user_id)}
                                        sx={{ height: "100%", fontSize: "1rem" }}
                                    >
                                        Отправить
                                    </Button>
                                </Box>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))
            ) : (
                <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
                    Нет данных
                </Typography>
            )}
        </Paper>
    );
};

export default ChatWithCandidates;