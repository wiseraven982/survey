import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const ManagerComments = ({ userId, initialComment }) => {
  const [comment, setComment] = useState(initialComment || '');
  const [isEditing, setIsEditing] = useState(false);

  // Функция для сохранения комментария
  const handleSaveComment = async () => {
    try {
      const response = await fetch('http://195.133.38.138:5005/api/save-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, comment }),
      });

      if (response.ok) {
        setIsEditing(false);
        console.log('Комментарий успешно сохранен');
      } else {
        console.error('Ошибка при сохранении комментария');
      }
    } catch (error) {
      console.error('Ошибка при сохранении комментария:', error);
    }
  };

  // Функция для загрузки комментария
  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await fetch(`http://195.133.38.138:5005/api/get-comment?userId=${userId}`);
        const data = await response.json();
        if (data.comment) {
          setComment(data.comment);
        }
      } catch (error) {
        console.error('Ошибка при загрузке комментария:', error);
      }
    };

    fetchComment();
  }, [userId]);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Комментарии руководителя
      </Typography>
      {isEditing ? (
        <Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Введите комментарий..."
            sx={{ 
              wordWrap: 'break-word', // Автоматический перенос текста
              whiteSpace: 'pre-wrap', // Сохраняет пробелы и переносы строк
            }}
          />
          <Button onClick={handleSaveComment} variant="contained" sx={{ mt: 1 }}>
            Сохранить
          </Button>
          <Button onClick={() => setIsEditing(false)} sx={{ mt: 1, ml: 1 }}>
            Отмена
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 1, 
              wordWrap: 'break-word', // Автоматический перенос текста
              whiteSpace: 'pre-wrap', // Сохраняет пробелы и переносы строк
            }}
          >
            {comment || 'Комментариев пока нет.'}
          </Typography>
          <Button onClick={() => setIsEditing(true)} variant="outlined">
            {comment ? 'Редактировать' : 'Добавить комментарий'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ManagerComments;