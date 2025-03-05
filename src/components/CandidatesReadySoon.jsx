import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CandidateAdditionalInfo from './CandidateAdditionalInfo';
import ManagerComments from './ManagerComments';

const CandidatesReadySoon = ({ filteredPeople, incassatorsData, employeeScores, showVideoPresentations }) => {
  const [expanded, setExpanded] = useState(null); // Состояние для отслеживания открытого аккордеона
  const [selectedCandidates, setSelectedCandidates] = useState([]); // Состояние для выбранных кандидатов
  const [videoPresentations, setVideoPresentations] = useState({}); // Состояние для статусов видеопрезентаций
  const [openConfirmation, setOpenConfirmation] = useState(false); // Состояние для модального окна подтверждения

  // Обработчик для открытия/закрытия аккордеона
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  // Функция для поиска информации об инкассаторе по имени
  const findIncassatorInfo = (fullName) => {
    if (!Array.isArray(incassatorsData)) {
      console.error('incassatorsData не загружен или не является массивом');
      return null;
    }

    return incassatorsData.find(
      (incassator) =>
        incassator.full_name.toLowerCase() === fullName.toLowerCase()
    );
  };

  // Функция для запроса видеопрезентации
  const requestVideoPresentation = async (userId) => {
    console.log(`🟢 Нажата кнопка "Запросить видеопрезентацию" для пользователя с ID: ${userId}`);

    try {
      const response = await fetch('http://195.133.38.138:5005/api/send-video-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setVideoPresentations((prev) => ({
          ...prev,
          [userId]: { status: "Ожидание", url: null },
        }));

        startCheckingVideoLink(userId);
      } else {
        console.error(`🔴 Ошибка при отправке запроса на видео для пользователя с ID: ${userId}`);
      }
    } catch (error) {
      console.error(`🔴 Ошибка при отправке запроса на видео для пользователя с ID: ${userId}:`, error);
    }
  };

  // Функция для периодической проверки статуса видеопрезентации
  const startCheckingVideoLink = (userId) => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`http://195.133.38.138:5005/api/get-video-link?userId=${userId}`);
        const data = await response.json();

        if (data.status === "Загружено") {
          setVideoPresentations((prev) => ({
            ...prev,
            [userId]: { status: "Загружено", url: data.videoUrl },
          }));
          clearInterval(intervalId);
        } else if (data.status === "Ожидание") {
          console.log("🟡 Видео еще не загружено, продолжаем проверку...");
        } else {
          console.error(`Ошибка: ${data.error}`);
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error(`Ошибка при проверке ссылки на видео: ${error}`);
        clearInterval(intervalId);
      }
    }, 5000);
  };

  // Обработчик для выбора кандидатов
  const handleCheckboxChange = (userId) => {
    setSelectedCandidates((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Обработчик для отправки запросов на видеопрезентацию
  const handleSendVideoRequests = () => {
    setOpenConfirmation(true); // Открываем модальное окно подтверждения
  };

  // Обработчик подтверждения отправки запросов
  const handleConfirmSend = () => {
    selectedCandidates.forEach(requestVideoPresentation); // Отправляем запросы
    setSelectedCandidates([]); // Сбрасываем выбранные чекбоксы
    setOpenConfirmation(false); // Закрываем модальное окно
  };

  // Обработчик отмены отправки запросов
  const handleCancelSend = () => {
    setOpenConfirmation(false); // Закрываем модальное окно без отправки
  };

  // Фильтрация кандидатов по статусу видеопрезентации
  const filteredCandidates = showVideoPresentations
    ? filteredPeople.filter((person) => videoPresentations[person.user_id]?.status !== "Запрос не отправлен")
    : filteredPeople;

  return (
    <Paper
      sx={{
        p: 2,
        flex: 1,
        overflowY: 'auto',
        '::-webkit-scrollbar': { width: '6px' },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#aaa',
          borderRadius: '3px',
        },
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: '#333' }}>
        🔜 Ready Soon
      </Typography>

      {/* Кнопка для запроса видеопрезентации */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          disabled={selectedCandidates.length === 0}
          onClick={handleSendVideoRequests} // Используем новый обработчик
        >
          🎥 Запросить видеопрезентацию
        </Button>
      </Box>

      {/* Модальное окно подтверждения */}
      <Dialog open={openConfirmation} onClose={handleCancelSend}>
        <DialogTitle>Подтверждение</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите отправить запрос на видеопрезентацию для выбранных кандидатов?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSend} color="primary">
            Отмена
          </Button>
          <Button onClick={handleConfirmSend} color="secondary" variant="contained">
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>

      {filteredCandidates.map((person, idx) => {
        const incassatorInfo = findIncassatorInfo(person.full_name);
        const videoStatus = videoPresentations[person.user_id]?.status || "Запрос не отправлен";
        const videoUrl = videoPresentations[person.user_id]?.url;

        return (
          <Accordion
            key={`person-${idx}`}
            sx={{ mb: 2 }}
            expanded={expanded === `panel-${idx}`}
            onChange={handleChange(`panel-${idx}`)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Checkbox
                  checked={selectedCandidates.includes(person.user_id)}
                  onChange={() => handleCheckboxChange(person.user_id)}
                  onClick={(e) => e.stopPropagation()} // Предотвращаем открытие/закрытие аккордеона при клике на чекбокс
                />
                {person.photo_url ? (
                  <img
                    src={person.photo_url}
                    alt={person.full_name}
                    onError={(e) => { e.target.style.display = 'none'; }}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: '15px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#ccc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Typography variant="body2">?</Typography>
                  </Box>
                )}
                <Typography variant="h6">{person.full_name}</Typography>
                <Box sx={{ flexGrow: 1 }} /> {/* Этот Box занимает все свободное пространство */}
                {videoStatus !== "Запрос не отправлен" && (
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    {videoStatus === "Ожидание" && (
                      <>
                        <Typography variant="body2" sx={{ mr: 1 }}>📹</Typography>
                        <Typography variant="body2">⌛</Typography>
                      </>
                    )}
                    {videoStatus === "Загружено" && (
                      <>
                        <Typography variant="body2" sx={{ mr: 1 }}>📹</Typography>
                        <Typography variant="body2">✅</Typography>
                      </>
                    )}
                  </Box>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {person.answers && person.answers.length > 0 && (
                <Paper
                  sx={{
                    p: 2,
                    mt: 1,
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {person.answers.map((ans, i) => (
                    <Box key={`answer-${i}`} sx={{ mb: 1 }}>
                      <Typography variant="body1">
                        <b>{ans.question_text}:</b> {ans.answer_text}
                      </Typography>
                    </Box>
                  ))}

                  {/* Вставляем CandidateAdditionalInfo перед блоком с видео */}
                  <CandidateAdditionalInfo
                    incassatorInfo={incassatorInfo}
                    candidateScores={employeeScores.find(score => score.fio === person.full_name)}
                  />

                  {/* Блок с видео в самом конце */}
                  {videoStatus === 'Загружено' && videoUrl && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Видеопрезентация
                      </Typography>
                      <video controls width="100%" style={{ borderRadius: '8px' }}>
                        <source src={videoUrl} type="video/mp4" />
                        Ваш браузер не поддерживает воспроизведение видео.
                      </video>
                    </Box>
                  )}
                  {/* Блок с комментариями руководителя */}
<ManagerComments userId={person.user_id} initialComment={person.managerComment} />
                </Paper>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Paper>
  );
};

export default CandidatesReadySoon;