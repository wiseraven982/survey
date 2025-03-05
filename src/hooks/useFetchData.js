import { useState, useEffect, useCallback } from 'react';
import {
  fetchUsers,
  fetchResponses,
  fetchIncassators,
  fetchEmployeeScores,
} from '../services/api';

export const useFetchData = () => {
  const [data, setData] = useState([]); // Ответы из анкет
  const [usersData, setUsersData] = useState([]); // Пользователи
  const [incassatorsData, setIncassatorsData] = useState([]); // Инкассаторы
  const [employeeScoresData, setEmployeeScores] = useState([]); // Оценки 5+ инкассаторов
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Ошибки

  const fetchData = useCallback(async () => {
    const abortController = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      // Загружаем пользователей, ответы, инкассаторов и оценки сотрудников
      const [usersRes, responsesRes, incassatorsRes, employeeScoresRes] = await Promise.all([
        fetchUsers({ signal: abortController.signal }),
        fetchResponses({ signal: abortController.signal }),
        fetchIncassators({ signal: abortController.signal }),
        fetchEmployeeScores({ signal: abortController.signal }), // Загружаем оценки сотрудников
      ]);

      console.log('Данные пользователей загружены:', usersRes);
      console.log('Ответы загружены:', responsesRes);
      console.log('Инкассаторы загружены:', incassatorsRes);
      console.log('Оценки сотрудников загружены:', employeeScoresRes);

      setUsersData(usersRes);
      setData(responsesRes);
      setIncassatorsData(incassatorsRes);
      setEmployeeScores(employeeScoresRes); // Сохраняем данные оценок сотрудников
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('❌ Ошибка при загрузке данных:', error);
        setError(error);
      }
    } finally {
      setIsLoading(false);
    }

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    data, 
    usersData, 
    incassatorsData, 
    employeeScoresData, // Возвращаем данные оценок сотрудников
    isLoading, 
    error, 
    refetch: fetchData 
  };
};