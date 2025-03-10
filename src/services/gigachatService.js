import axios from "axios";

/**
 * Вместо прямого обращения к GigaChat, мы шлём запрос
 * к нашему серверу (Node/Express), у которого есть
 * маршрут POST /api/gigachat
 * 
 * На бэкенде этот маршрут добавлен в server.js
 * и там хранится токен GigaChat.
 */
export const sendMessageToGigaChat = async (userMessage) => {
  try {
    // Шлём POST-запрос на наш БЭКЕНД
    const response = await axios.post(
      "/api/gigachat",
      { message: userMessage }, // Пакуем текст
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // На сервере мы отвечаем { reply: "Ответ бота" }
    const botReply = response.data?.reply ?? "Нет ответа";
    return botReply;
  } catch (error) {
    console.error("Ошибка при запросе к нашему бэкенду:", error);
    throw error;
  }
};
