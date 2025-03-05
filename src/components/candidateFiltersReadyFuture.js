// Функция для проверки стажа работы (менее или равно 1 году)
const checkExperienceForFuture = (answers) => {
  const experienceAnswer = answers.find((ans) =>
    ans.question_text.includes("Стаж работы в Сбере")
  );

  if (experienceAnswer) {
    const answerText = experienceAnswer.answer_text.toLowerCase().trim();

    // Проверяем точное значение "1 год"
    if (answerText === "1 год") {
      return true; // Попадает в "Future", так как стаж равен 1 году
    }

    // Проверяем текстовые варианты, указывающие на стаж менее 1 года
    if (
      answerText.includes("менее года") ||
      answerText.includes("менее 1 года") ||
      answerText.includes("меньше года") ||
      answerText.includes("меньше 1 года") ||
      answerText.includes("-1 год") || // Добавлен вариант "-1 год"
      answerText === "1" // Добавлен вариант "1"
    ) {
      return true; // Попадает в "Future"
    }

    // Регулярное выражение для поиска чисел в тексте
    const numbers = answerText.match(/\d+/g);

    if (numbers) {
      const years = answerText.includes("год") || answerText.includes("лет");
      const months = answerText.includes("месяц") || answerText.includes("месяцев");

      // Если указаны годы и месяцы (например, "1 год и 3 месяца")
      if (years && months) {
        const yearValue = parseInt(numbers[0], 10);
        const monthValue = parseInt(numbers[1], 10);

        // Если год равен 1 и месяцы больше 0, то стаж больше 1 года
        if (yearValue === 1 && monthValue > 0) {
          return false; // Не попадает в "Future"
        }
        // Если год равен 0, то месяцы должны быть меньше или равны 12
        else if (yearValue === 0 && monthValue <= 12) {
          return true; // Попадает в "Future"
        }
        return false;
      }
      // Если указаны только годы (например, "1 год")
      else if (years) {
        const yearValue = parseInt(numbers[0], 10);
        return yearValue <= 1; // Меньше или равно 1 году
      }
      // Если указаны только месяцы (например, "12 месяцев")
      else if (months) {
        const monthValue = parseInt(numbers[0], 10);
        return monthValue <= 12; // Меньше или равно 12 месяцам
      }
      // Если указано только число без единиц измерения (например, "10" или "12")
      else {
        const value = parseInt(numbers[0], 10);

        // Если в ответе нет слова "месяц" или "месяцев", считаем, что это годы
        return value <= 1; // Меньше или равно 1 году
      }
    }
  }
  return false; // Если стаж не указан или не соответствует условиям
};

// Основная функция фильтрации для "Future"
export const filterFutureCandidates = (people) => {
  if (!people || !Array.isArray(people)) {
    console.error('People is not defined or not an array');
    return [];
  }

  // Фильтруем кандидатов по стажу работы (менее или равно 1 году)
  const futureCandidates = people.filter((person) => {
    const answers = Array.isArray(person.answers) ? person.answers : [];
    return checkExperienceForFuture(answers);
  });

  return futureCandidates;
};