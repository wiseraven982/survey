import { filterReadyNowCandidates } from './candidateFiltersReadyNow';
import { filterFutureCandidates } from './candidateFiltersReadyFuture';

// Основная функция фильтрации для "Ready Soon"
export const filterReadySoonCandidates = (people, incassatorsData) => {
  if (!people || !Array.isArray(people)) {
    console.error('People is not defined or not an array');
    return [];
  }

  if (!incassatorsData || !Array.isArray(incassatorsData)) {
    console.error('IncassatorsData is not defined or not an array');
    return [];
  }

  // Получаем кандидатов для "Ready Now" и "Future"
  const readyNowCandidates = filterReadyNowCandidates(people, incassatorsData);
  const futureCandidates = filterFutureCandidates(people);

  // Собираем ID кандидатов, которые уже попали в "Ready Now" и "Future"
  const excludedIds = new Set([
    ...readyNowCandidates.map((candidate) => candidate.user_id),
    ...futureCandidates.map((candidate) => candidate.user_id),
  ]);

  // Фильтруем кандидатов, которые не попали в "Ready Now" и "Future"
  const readySoonCandidates = people.filter((person) => {
    return !excludedIds.has(person.user_id);
  });

  return readySoonCandidates;
};