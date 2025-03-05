// candidateFiltersVideo.js

/**
 * Фильтрует кандидатов по статусу видеопрезентации.
 * @param {Array} people - Список кандидатов.
 * @param {Object} videoPresentations - Объект с данными о видеопрезентациях.
 * @returns {Array} - Отфильтрованный список кандидатов с видеопрезентациями.
 */
export const filterCandidatesWithVideo = (people, videoPresentations) => {
    console.log("Фильтрация кандидатов с видео...");
return people.filter((person) => {
  const videoStatus = videoPresentations[person.user_id]?.status;
  console.log(`Проверяем ${person.full_name} (ID: ${person.user_id}) - статус: ${videoStatus}`);
  return videoStatus && videoStatus !== "Запрос не отправлен";
  });
};