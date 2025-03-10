import React, { useState, useEffect } from 'react';
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
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CandidateAdditionalInfo from './CandidateAdditionalInfo';
import ManagerComments from './ManagerComments';

const CandidatesReadySoon = ({ filteredPeople, incassatorsData, employeeScores, showVideoPresentations, videoPresentations }) => {
  const [expanded, setExpanded] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [videoStatusData, setVideoStatusData] = useState(videoPresentations || {});
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openMessageConfirmation, setOpenMessageConfirmation] = useState(false);
  const [messageText, setMessageText] = useState('');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

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

  const requestVideoPresentation = async (userId) => {
    console.log(`🟢 Отправка запроса на видеопрезентацию для userId: ${userId}`);

    try {
      const response = await fetch('http://195.133.38.138:5005/api/send-video-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setVideoStatusData((prev) => ({
          ...prev,
          [userId]: { status: 'Ожидание', url: null },
        }));

        console.log(`🟡 Статус обновлен: Ожидание для userId: ${userId}`);

        startCheckingVideoLink(userId);
      } else {
        console.error(`🔴 Ошибка запроса видеопрезентации для userId: ${userId}`);
      }
    } catch (error) {
      console.error(`🔴 Ошибка при запросе видео для userId: ${userId}:`, error);
    }
  };

  const startCheckingVideoLink = (userId) => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`http://195.133.38.138:5005/api/get-video-link?userId=${userId}`);
        const data = await response.json();

        console.log(`📡 Проверка видео для userId: ${userId} -> Ответ:`, data);

        if (data.status === 'Загружено') {
          setVideoStatusData((prev) => ({
            ...prev,
            [userId]: { status: 'Загружено', url: data.videoUrl },
          }));

          console.log(`✅ Видео загружено для userId: ${userId}, URL: ${data.videoUrl}`);

          clearInterval(intervalId);
        }
      } catch (error) {
        console.error(`Ошибка при проверке видео userId: ${userId}:`, error);
        clearInterval(intervalId);
      }
    }, 5000);
  };

  const handleCheckboxChange = (userId) => {
    setSelectedCandidates((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSendVideoRequests = () => {
    setOpenConfirmation(true);
  };

  const handleConfirmSend = () => {
    selectedCandidates.forEach(requestVideoPresentation);
    setSelectedCandidates([]);
    setOpenConfirmation(false);
  };

  const handleCancelSend = () => {
    setOpenConfirmation(false);
  };

  const handleSendMessage = () => {
    setOpenMessageConfirmation(true);
  };

  const handleConfirmMessageSend = () => {
    selectedCandidates.forEach((userId) => sendMessageToUser(userId, messageText));
    setSelectedCandidates([]);
    setMessageText('');
    setOpenMessageConfirmation(false);
  };

  const handleCancelMessageSend = () => {
    setOpenMessageConfirmation(false);
  };

  const sendMessageToUser = async (candidateId, message) => {
    try {
        const response = await fetch('http://195.133.38.138:5005/api/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ candidateId, message }),
        });

        if (response.ok) {
            console.log(`✅ Сообщение отправлено пользователю с ID: ${candidateId}`);
        } else {
            console.error(`🔴 Ошибка при отправке сообщения пользователю с ID: ${candidateId}`);
        }
    } catch (error) {
        console.error(`🔴 Ошибка при отправке сообщения пользователю с ID: ${candidateId}:`, error);
    }
  };

  useEffect(() => {
    setVideoStatusData(videoPresentations || {});
  }, [videoPresentations]);

  const filteredCandidates = showVideoPresentations
    ? filteredPeople.filter((person) => videoStatusData[person.user_id]?.status !== "Запрос не отправлен")
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

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          disabled={selectedCandidates.length === 0}
          onClick={handleSendVideoRequests}
        >
          🎥 Запросить видеопрезентацию
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedCandidates.length === 0}
          onClick={handleSendMessage}
        >
          📩 Отправить сообщение
        </Button>
      </Box>

      {selectedCandidates.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Введите сообщение..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
        </Box>
      )}

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

      <Dialog open={openMessageConfirmation} onClose={handleCancelMessageSend}>
        <DialogTitle>Подтверждение</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите отправить сообщение выбранным кандидатам?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelMessageSend} color="primary">
            Отмена
          </Button>
          <Button onClick={handleConfirmMessageSend} color="primary" variant="contained">
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>

      {filteredCandidates.map((person, idx) => {
        const incassatorInfo = findIncassatorInfo(person.full_name);
        const videoStatus = videoStatusData[person.user_id]?.status || "Запрос не отправлен";
        const videoUrl = videoStatusData[person.user_id]?.url;

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
                  onClick={(e) => e.stopPropagation()}
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
                <Box sx={{ flexGrow: 1 }} />
                {videoStatus !== 'Запрос не отправлен' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    {videoStatus === 'Ожидание' && (
                      <>
                        <Typography variant="body2" sx={{ mr: 1 }}>📹</Typography>
                        <Typography variant="body2">⌛</Typography>
                      </>
                    )}
                    {videoStatus === 'Загружено' && (
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

                  <CandidateAdditionalInfo
                    incassatorInfo={incassatorInfo}
                    candidateScores={employeeScores.find(score => score.fio === person.full_name)}
                  />

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