import React, { useState, useMemo, useEffect } from 'react';
import { useFetchData } from './hooks/useFetchData';
import CandidatesAll from './components/CandidatesAll';
import CandidatesReadyNow from './components/CandidatesReadyNow';
import CandidatesReadySoon from './components/CandidatesReadySoon';
import CandidatesReadyFuture from './components/CandidatesReadyFuture';
import StagesColumn from './components/StagesColumn';
import ChatBot from './components/ChatBot';
import { Container, Grid, Box, Typography, CircularProgress } from '@mui/material';
import { normalizeName } from './utils/utils';
import { filterReadyNowCandidates } from './components/candidateFiltersReadyNow';
import { filterReadySoonCandidates } from './components/candidateFiltersReadySoon';
import { filterFutureCandidates } from './components/candidateFiltersReadyFuture';
import CandidatesWithVideo from './components/CandidatesWithVideo';
import ChatWithCandidates from './components/ChatWithCandidates';
import { fetchVideoStatuses } from './services/api';

export default function App() {
  const {
    data,
    incassatorsData,
    usersData,
    employeeScoresData,
    isLoading,
  } = useFetchData();

  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [displayMode, setDisplayMode] = useState('all');
  const [showVideoPresentations, setShowVideoPresentations] = useState(false);
  const [videoPresentations, setVideoPresentations] = useState({});
  const [readyNowCandidates, setReadyNowCandidates] = useState([]);
  const [readySoonCandidates, setReadySoonCandidates] = useState([]);
  const [futureCandidates, setFutureCandidates] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);

  useEffect(() => {
    const loadVideoStatuses = async () => {
      try {
        const data = await fetchVideoStatuses();
        console.log("Загруженные статусы видео:", data);
        if (Array.isArray(data)) {
          const statuses = {};
          data.forEach((user) => {
            statuses[user.id] = { status: user.video_status, url: user.video_url };
          });
          setVideoPresentations(statuses);
        } else {
          console.error("Ошибка: полученные данные не являются массивом.", data);
        }
      } catch (error) {
        console.error("Ошибка загрузки видео статусов:", error);
      }
    };

    loadVideoStatuses();
  }, []);

  const people = useMemo(() => {
    if (isLoading || !usersData || !data) return [];
    if (!usersData.length || !data.length) return [];

    console.log("Формирование списка кандидатов...");

    return Object.values(
      data.reduce((acc, item) => {
        const { full_name, user_id, photo_url } = item;
        const user = usersData.find((user) => Number(user.user_id) === Number(user_id));
        if (!user || user.survey_completed !== 1) return acc;

        const userResponses = data.filter((d) => Number(d.user_id) === Number(user_id));
        if (userResponses.length === 0 || userResponses.length < 18) return acc;

        if (!acc[user_id]) {
          acc[user_id] = {
            user_id,
            full_name,
            photo_url: user.photo_url || photo_url,
            answers: [],
            videoStatus: user.video_status || "Запрос не отправлен",
          };
        }

        acc[user_id].answers.push({
          question_text: item.question_text,
          answer_text: item.answer_text,
        });

        return acc;
      }, {})
    );
  }, [data, usersData, isLoading]);

  useEffect(() => {
    if (people.length > 0) {
      console.log("Фильтрация кандидатов...");
      setAllCandidates(people);
      setReadyNowCandidates(filterReadyNowCandidates(people, incassatorsData));
      setReadySoonCandidates(filterReadySoonCandidates(people, incassatorsData));
      setFutureCandidates(filterFutureCandidates(people, incassatorsData));
    }
  }, [people, incassatorsData]);

  const handleReadyNowClick = () => {
    console.log("Переключение на вкладку 'Ready Now'");
    setDisplayMode('readyNow');
    setShowVideoPresentations(false);
  };

  const handleReadySoonClick = () => {
    console.log("Переключение на вкладку 'Ready Soon'");
    setDisplayMode('readySoon');
    setShowVideoPresentations(false);
  };

  const handleReadyFutureClick = () => {
    console.log("Переключение на вкладку 'Ready Future'");
    setDisplayMode('future');
    setShowVideoPresentations(false);
  };

  const handleAllCandidatesClick = () => {
    console.log("Переключение на вкладку 'Все кандидаты'");
    setDisplayMode('all');
    setShowVideoPresentations(false);
  };

  const handleVideoPresentationClick = () => {
    console.log("Переключение на вкладку 'Видеопрезентация'");
    setDisplayMode('video');
    setShowVideoPresentations(true);
  };

  const handleChatClick = () => {
    console.log("Переключение на вкладку 'Чат'");
    setDisplayMode('chat');
    setShowVideoPresentations(false);
  };

  const getDisplayedCandidates = () => {
    console.log("Определение отображаемых кандидатов...");
    console.log("showVideoPresentations:", showVideoPresentations);
    console.log("displayMode:", displayMode);

    if (showVideoPresentations) {
      return allCandidates.filter(
        (person) =>
          videoPresentations[person.user_id]?.status === "Ожидание" ||
          videoPresentations[person.user_id]?.status === "Загружено"
      );
    }

    switch (displayMode) {
      case 'readyNow':
        return readyNowCandidates;
      case 'readySoon':
        return readySoonCandidates;
      case 'future':
        return futureCandidates;
      case 'chat':
        return allCandidates; // Для чата отображаем всех кандидатов
      default:
        return allCandidates;
    }
  };

  const displayedCandidates = getDisplayedCandidates();
  console.log("Отображаемые кандидаты:", displayedCandidates);
  
  if (isLoading || allCandidates.length === 0) {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Box
          sx={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: '5px solid rgba(0, 0, 0, 0.1)',
            borderTopColor: '#000',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </Box>
    );
  }
  
  return (
    <Container
      maxWidth={false}
      sx={{
        padding: 0,
        height: '100vh',
        overflowY: 'hidden', // Чтобы не было скачков при смене вкладок
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Grid
        container
        spacing={1}
        sx={{
          width: '100%',
          margin: '0 auto',
          height: '100%',
          paddingLeft: '10px',
          paddingRight: '10px',
          alignItems: 'stretch',
          flexWrap: 'nowrap', // Запрещаем перенос строк
        }}
      >
        {/* Левая колонка (Чат) */}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minWidth: '280px',
            maxWidth: '400px',
            padding: 0,
            margin: 0,
          }}
        >
          <ChatBot />
        </Grid>
  
        {/* Центральная колонка (Кандидаты) */}
        <Grid
  item
  xs={12}
  md={6}
  sx={{
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    minWidth: '800px', // Добавьте минимальную ширину
    margin: '0 auto',
    overflowY: 'auto',
    flexGrow: 1,
  }}
>
          {showVideoPresentations ? (
            <CandidatesWithVideo
              candidates={allCandidates}
              incassatorsData={incassatorsData}
              employeeScores={employeeScoresData}
              videoPresentations={videoPresentations}
            />
          ) : (
            <>
              {displayMode === 'all' && (
                <CandidatesAll
                  filteredPeople={displayedCandidates}
                  expandedAccordion={expandedAccordion}
                  setExpandedAccordion={setExpandedAccordion}
                  findIncassatorInfo={(fullName) =>
                    incassatorsData.find(
                      (incassator) =>
                        normalizeName(incassator.full_name) === normalizeName(fullName)
                    )
                  }
                  employeeScores={employeeScoresData}
                  videoPresentations={videoPresentations}
                />
              )}
              {displayMode === 'readyNow' && (
                <CandidatesReadyNow
                  filteredPeople={displayedCandidates}
                  incassatorsData={incassatorsData}
                  employeeScores={employeeScoresData}
                  videoPresentations={videoPresentations}
                />
              )}
              {displayMode === 'readySoon' && (
                <CandidatesReadySoon
                  filteredPeople={displayedCandidates}
                  incassatorsData={incassatorsData}
                  employeeScores={employeeScoresData}
                  videoPresentations={videoPresentations}
                />
              )}
              {displayMode === 'future' && (
                <CandidatesReadyFuture
                  people={displayedCandidates}
                  incassatorsData={incassatorsData}
                  employeeScores={employeeScoresData}
                  videoPresentations={videoPresentations}
                />
              )}
              {displayMode === 'chat' && (
                <ChatWithCandidates
                  candidates={displayedCandidates}
                  onSendMessage={async (candidateId, message) => {
                    try {
                      const response = await fetch('/api/send-message', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ candidateId, message }),
                      });
                      return response.json();
                    } catch (error) {
                      console.error('Ошибка отправки сообщения:', error);
                    }
                  }}
                />
              )}
            </>
          )}
        </Grid>
  
        {/* Правая колонка (Фильтры и этапы) */}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minWidth: '280px',
            maxWidth: '400px',
            padding: 0,
            margin: 0,
          }}
        >
          <StagesColumn
            onAllCandidatesClick={handleAllCandidatesClick}
            onReadyNowClick={handleReadyNowClick}
            onReadySoonClick={handleReadySoonClick}
            onReadyFutureClick={handleReadyFutureClick}
            onVideoPresentationClick={handleVideoPresentationClick}
            onChatClick={handleChatClick}
            candidateCount={displayedCandidates.length}
          />
        </Grid>
      </Grid>
    </Container>
  )}