import React, { useState } from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';

const StagesColumn = ({
  onAllCandidatesClick,
  onReadyNowClick,
  onReadySoonClick,
  onReadyFutureClick,
  onVideoPresentationClick,
  onChatClick, // Пропс для обработки нажатия на кнопку "Чат с кандидатами"
  candidateCount,
}) => {
  const [activeButton, setActiveButton] = useState("all");

  const handleButtonClick = (buttonName, callback) => {
    setActiveButton(buttonName);
    if (callback) callback();
  };

  return (
    <Paper
      sx={{
        p: 2,
        flex: 1,
        overflowY: 'auto',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: '#333' }}>
        🔎 Talent Pipeline
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<span>📄</span>}
          onClick={() => handleButtonClick("all", onAllCandidatesClick)}
          sx={{
            border: activeButton === "all" ? "2px solid black" : "none",
            backgroundColor: activeButton === "all" ? "#d3d3d3" : "primary.main",
            color: activeButton === "all" ? "black" : "white",
          }}
        >
          Все анкеты
        </Button>
        <Button
          variant="contained"
          fullWidth
          startIcon={<span>🔥</span>}
          onClick={() => handleButtonClick("readyNow", onReadyNowClick)}
          sx={{
            border: activeButton === "readyNow" ? "2px solid black" : "none",
            backgroundColor: activeButton === "readyNow" ? "#d3d3d3" : "primary.main",
            color: activeButton === "readyNow" ? "black" : "white",
          }}
        >
          Ready Now
        </Button>
        <Button
          variant="contained"
          fullWidth
          startIcon={<span>⏳</span>}
          onClick={() => handleButtonClick("readySoon", onReadySoonClick)}
          sx={{
            border: activeButton === "readySoon" ? "2px solid black" : "none",
            backgroundColor: activeButton === "readySoon" ? "#d3d3d3" : "primary.main",
            color: activeButton === "readySoon" ? "black" : "white",
          }}
        >
          Ready Soon
        </Button>
        <Button
          variant="contained" // Исправлено: убрана лишняя буква "d"
          fullWidth
          startIcon={<span>🌱</span>}
          onClick={() => handleButtonClick("readyFuture", onReadyFutureClick)}
          sx={{
            border: activeButton === "readyFuture" ? "2px solid black" : "none",
            backgroundColor: activeButton === "readyFuture" ? "#d3d3d3" : "primary.main",
            color: activeButton === "readyFuture" ? "black" : "white",
          }}
        >
          Ready in the Future
        </Button>
        <Button
          variant="contained"
          fullWidth
          startIcon={<span>🎥</span>}
          onClick={() => handleButtonClick("video", onVideoPresentationClick)}
          sx={{
            border: activeButton === "video" ? "2px solid black" : "none",
            backgroundColor: activeButton === "video" ? "#d3d3d3" : "primary.main",
            color: activeButton === "video" ? "black" : "white",
          }}
        >
          Видеопрезентации
        </Button>
        <Button
          variant="contained"
          fullWidth
          startIcon={<span>✉️</span>}
          onClick={() => handleButtonClick("message", onChatClick)} // Обработчик для кнопки "Чат с кандидатами"
          sx={{
            border: activeButton === "message" ? "2px solid black" : "none",
            backgroundColor: activeButton === "message" ? "#d3d3d3" : "primary.main",
            color: activeButton === "message" ? "black" : "white",
          }}
        >
          Чат с кандидатами
        </Button>
      </Box>

      {/* Счетчик кандидатов */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Всего кандидатов: {candidateCount}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StagesColumn;