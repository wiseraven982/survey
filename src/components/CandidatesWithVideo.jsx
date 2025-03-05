import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CandidateAdditionalInfo from './CandidateAdditionalInfo';
import ManagerComments from './ManagerComments';

const CandidatePhoto = ({ photoUrl, fullName }) => {
  return photoUrl ? (
    <img
      src={photoUrl}
      alt={fullName}
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
  );
};

const VideoStatusIndicator = ({ status }) => {
  if (status === "Запрос не отправлен") return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
      <Typography variant="body2" sx={{ mr: 1 }}>📹</Typography>
      {status === "Ожидание" && <Typography variant="body2">⌛</Typography>}
      {status === "Загружено" && <Typography variant="body2">✅</Typography>}
    </Box>
  );
};

const CandidatesWithVideo = ({ candidates, incassatorsData = [], employeeScores, videoPresentations }) => {
  const filteredCandidates = candidates?.filter((person) => {
    const videoStatus = videoPresentations[String(person.user_id)]?.status;
    return videoStatus && videoStatus !== "Запрос не отправлен";
  }) || [];

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
        📹 Кандидаты с видеопрезентациями
      </Typography>

      {filteredCandidates.length > 0 ? (
        filteredCandidates.map((person) => {
          const incassatorInfo = incassatorsData.find(
            (inc) => inc.full_name?.toLowerCase() === person.full_name?.toLowerCase()
          );
          const videoStatus = videoPresentations[String(person.user_id)]?.status || "Запрос не отправлен";
          const videoUrl = videoPresentations[String(person.user_id)]?.url;

          return (
            <Accordion key={`person-${person.user_id}`} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <CandidatePhoto photoUrl={person.photo_url} fullName={person.full_name} />
                  <Typography variant="h6">{person.full_name}</Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <VideoStatusIndicator status={videoStatus} />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
  {person.answers.length > 0 && (
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
        })
      ) : (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          Нет кандидатов с видеопрезентациями
        </Typography>
      )}
    </Paper>
  );
};

export default CandidatesWithVideo;