import axios from "axios";

export const sendMessageToGigaChat = async (userMessage) => {
  try {
    const response = await axios.post(
      "http://195.133.38.138:5005/api/gigachat", // Укажите полный URL
      { message: userMessage },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const botReply = response.data?.reply ?? "Нет ответа";
    return botReply;
  } catch (error) {
    console.error("Ошибка при запросе к нашему бэкенду:", error);
    if (error.response) {
      throw new Error(`Ошибка сервера: ${error.response.status} ${error.response.data}`);
    } else if (error.request) {
      throw new Error("Сервер недоступен. Проверьте подключение к интернету.");
    } else {
      throw new Error("Произошла ошибка при отправке запроса.");
    }
  }
};