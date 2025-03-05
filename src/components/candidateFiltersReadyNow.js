
// candidateFilters.js
const normalizeName = (name) => {
  return name
    ? name.replace(/ё/g, "е").toLowerCase().trim().replace(/\s+/g, " ") // Удаляем лишние пробелы
    : name;
};

export const filterReadyNowCandidates = (people, incassatorsData) => {
    return people.filter((person) => {
      const answers = Array.isArray(person.answers) ? person.answers : [];
  
      // 1️⃣ Проверяем стаж работы
      const hasExperience = checkExperience(answers);
  
      // 2️⃣ Проверяем готовность к релокации
      const isRelocationReady = checkRelocation(answers);
  
      // 3️⃣ Проверяем классность
      const hasValidClass = checkClass(person, incassatorsData);
  
      // 4️⃣ Проверяем подразделение
      const isCorrectDepartment = checkDepartment(answers);
  
      return hasExperience && isRelocationReady && hasValidClass && isCorrectDepartment;
    });
  };
  
  const checkExperience = (answers) => {
    const experienceAnswer = answers.find((ans) =>
      ans.question_text.includes("Стаж работы в Сбере")
    );
  
    if (experienceAnswer) {
      const match = experienceAnswer.answer_text.match(/\d+/);
      if (match) {
        const experienceNumber = parseInt(match[0], 10);
  
        // Если в ответе есть "год" или "лет", считаем, что это годы
        if (
          experienceAnswer.answer_text.includes("год") ||
          experienceAnswer.answer_text.includes("лет")
        ) {
          return experienceNumber * 12 >= 12; // Переводим годы в месяцы
        }
        // Если в ответе только цифра, считаем, что это годы
        else if (/^\d+$/.test(experienceAnswer.answer_text.trim())) {
          return experienceNumber * 12 >= 12; // Переводим годы в месяцы
        }
        // Иначе считаем, что это месяцы
        else {
          return experienceNumber >= 12;
        }
      }
    }
    return false;
  };
  
  const checkRelocation = (answers) => {
    return answers.some((ans) => {
      if (ans.question_text.includes("Готовы ли Вы к релокации")) {
        const normalizedAnswer = ans.answer_text.trim().toLowerCase();
        
        // Условие: ответ содержит "да", "готов", "возможно", но НЕ "нет"
        return (
          normalizedAnswer.includes("да") ||
          normalizedAnswer.includes("готов") ||
          normalizedAnswer.includes("возможно")
        ) && !normalizedAnswer.includes("не готов");
      }
      return false;
    });
  };
  
  
  const checkClass = (person, incassatorsData) => {
    const incassatorInfo = Array.isArray(incassatorsData)
      ? incassatorsData.find(
          (inc) =>
            normalizeName(inc.full_name) === normalizeName(person.full_name)
        )
      : null;
  
    // Если сотрудник не найден в incassatorsData — пропускаем его.
    if (!incassatorInfo) {
      return true; 
    }
  
    // Если нашли, проверяем класс. Допускаем класс "1" или "2" или пустой:
    const category = incassatorInfo.class_category; // строка "1", "2", "3" и т.д.
    if (!category || ["1", "2"].includes(category)) {
      return true;
    }
  
    // Если класс есть, но он 3 или выше — не проходим
    return false;
  };
  
  const checkDepartment = (answers) => {
    const departmentAnswer = answers.find((ans) =>
      ans.question_text.includes("Наименование Вашего подразделения")
    );
  
    return departmentAnswer
      ? /к[иi]ц/i.test(departmentAnswer.answer_text) ||
        /цундо/i.test(departmentAnswer.answer_text) ||
        /кассово-инкассаторский центр/i.test(departmentAnswer.answer_text) ||
        /инкассаци(и|я|ей)/i.test(departmentAnswer.answer_text)
      : false;
  };