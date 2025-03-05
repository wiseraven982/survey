import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
  Box,
  TextField, // Добавляем TextField для поиска
  IconButton, // Добавляем IconButton для кнопки сброса
  InputAdornment, // Добавляем InputAdornment для размещения иконки внутри TextField
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close'; // Иконка крестика

const CandidatesAll = ({ filteredPeople }) => {
  const [expanded, setExpanded] = useState(null); // Состояние для отслеживания открытого аккордеона
  const [searchQuery, setSearchQuery] = useState(''); // Состояние для поискового запроса

  // Обработчик для открытия/закрытия аккордеона
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  // Функция для сброса поискового запроса
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Фильтрация кандидатов по фамилии
  const filteredCandidates = filteredPeople.filter((person) =>
    person.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <Typography
        variant="h6"
        sx={{ mb: 2, textAlign: 'center', color: '#333' }}
      >
        📝 All Profiles
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

      {filteredCandidates.length > 0 ? (
        filteredCandidates.map((person, idx) => (
          <Accordion
            key={`person-${idx}`}
            sx={{ mb: 2 }}
            expanded={expanded === `panel-${idx}`} // Управление состоянием открытия
            onChange={handleChange(`panel-${idx}`)} // Обработчик изменения состояния
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {/* Фото + ФИО */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {person.photo_url ? (
                  <img
                    src={person.photo_url}
                    alt={person.full_name}
                    onError={(e) => {
                      e.target.style.display = 'none'; // Скрыть изображение, если оно не загрузилось
                    }}
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
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {/* Вопросы и ответы */}
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
                </Paper>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          Нет данных для отображения
        </Typography>
      )}
    </Paper>
  );
};

export default CandidatesAll;