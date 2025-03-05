import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

const CandidateAdditionalInfo = ({ incassatorInfo, candidateScores }) => {
  if (!incassatorInfo && !candidateScores) {
    return <Typography variant="body1">Дополнительная информация не найдена</Typography>;
  }

  // Функция для выделения букв "D" и "B" цветом
  const renderScore = (score) => {
    if (!score) return 'Нет данных';

    return score.split('').map((char, index) => { // Разбиваем строку на символы
      if (char === 'D') {// Если символ "D"
        return (// Возвращаем компонент Typography с цветом текста "Orange"
          <Typography key={index} component="span" sx={{ color: 'red' }}>
            {char} 
          </Typography>
        );
      } else if (char === 'B') {// Если символ "B"
        return (
          <Typography key={index} component="span" sx={{ color: 'green' }}>
            {char}
          </Typography>
        );
      } else if (char === 'C') {// Если символ "C"
        return (
          <Typography key={index} component="span" sx={{ color: 'black' }}>
            {char}
          </Typography>
        );
      } else if (char === 'A') {// Если символ "A"
        return (
          <Typography key={index} component="span" sx={{ color: 'blue' }}>
            {char}
          </Typography>
        );
      } else {
        return (
          <Typography key={index} component="span">
            {char}
          </Typography>
        );
      }
    });
  };

  return (
    <Box sx={{ mt: 2, borderTop: '1px solid #eee', pt: 2 }}>
      {/* Дополнительная информация об инкассаторе */}
      {incassatorInfo && (
        <>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Дополнительная информация:
          </Typography>
          <Typography variant="body1">
            <b>Подразделение:</b> {incassatorInfo?.department || 'Не указано'}
          </Typography>
          <Typography variant="body1">
            <b>Должность:</b> {incassatorInfo?.position || 'Не указана'}
          </Typography>
          <Typography variant="body1">
            <b>Физическая подготовка:</b> {incassatorInfo?.physical_training_score || 'Не указана'}
          </Typography>
          <Typography variant="body1">
            <b>Правильные ответы (спец. тест):</b> {incassatorInfo?.spec_training_correct_answers || 'Не указано'}
          </Typography>
          <Typography variant="body1">
            <b>Оценка за спец. обучение:</b> {incassatorInfo?.spec_training_score || 'Не указана'}
          </Typography>
          <Typography variant="body1">
            <b>Стрелковая подготовка:</b> {incassatorInfo?.shooting_training_score || 'Не указана'}
          </Typography>
          <Typography variant="body1">
            <b>Рейтинг стрельбы:</b> {incassatorInfo?.shooting_rating || 'Не указан'}
          </Typography>
          <Typography variant="body1">
            <b>Классность:</b> {incassatorInfo?.class_category || 'Не указана'}
          </Typography>
        </>
      )}

      {/* Оценки сотрудника */}
      {candidateScores && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Оценка 5+
          </Typography>
          <Typography variant="body1">
            <b>1 квартал:</b> {renderScore(candidateScores["1Q_result"] || 'Нет данных')}{renderScore(candidateScores["1Q_values"] || 'Нет данных')}
          </Typography>
          <Typography variant="body1">
            <b>2 квартал:</b> {renderScore(candidateScores["2Q_result"] || 'Нет данных')}{renderScore(candidateScores["2Q_values"] || 'Нет данных')}
          </Typography>
          <Typography variant="body1">
            <b>3 квартал:</b> {renderScore(candidateScores["3Q_result"] || 'Нет данных')}{renderScore(candidateScores["3Q_values"] || 'Нет данных')}
          </Typography>
          <Typography variant="body1">
            <b>4 квартал:</b> {renderScore(candidateScores["4Q_result"] || 'Нет данных')}{renderScore(candidateScores["4Q_values"] || 'Нет данных')}
          </Typography>
          <Typography variant="body1">
            <b>Годовая оценка:</b> {renderScore(candidateScores["year_result"] || 'Нет данных')}{renderScore(candidateScores["year_values"] || 'Нет данных')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

CandidateAdditionalInfo.propTypes = {
  incassatorInfo: PropTypes.object,
  candidateScores: PropTypes.object,
};

export default CandidateAdditionalInfo;