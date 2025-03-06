import axios from "axios";

// Базовый URL для REST API
const API_BASE_URL = "http://195.133.38.138:5005/api";

// Базовый URL для WebSocket
const WS_BASE_URL = "ws://195.133.38.138:5005";

// Функция для создания WebSocket-соединения
export const createWebSocketConnection = (userId, onMessageCallback) => {
    // Создаем WebSocket-соединение
    const socket = new WebSocket(`${WS_BASE_URL}/?user_id=${userId}`);

    // Обработка входящих сообщений через WebSocket
    socket.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);
            console.log("Получено сообщение через WebSocket:", message);

            // Вызываем callback для обработки сообщения
            onMessageCallback(message);
        } catch (error) {
            console.error("Ошибка при обработке входящего сообщения:", error);
        }
    };

    // Обработка ошибок
    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    // Возвращаем объект WebSocket для дальнейшего использования
    return socket;
};

export const sendMessageThroughTelegram = async (candidateId, message) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/send-message`, {
            candidateId, // Исправлено с userId на candidateId
            message,
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при отправке сообщения через Telegram:", error);
        throw error;
    }
};


// Обертка для отправки сообщения (удобно использовать в компонентах)
export const sendMessageToUser = async (userId, message) => {
    return sendMessageThroughTelegram(userId, message);
};

// Функция для загрузки истории переписки
export const fetchChatHistory = async (candidateId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chat-history`, {
            params: { candidateId },
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке истории переписки:", error);
        throw error;
    }
};

// Загрузка данных пользователей
export const fetchUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке данных пользователей:", error);
        throw error;
    }
};

// Загрузка данных инкассаторов
export const fetchIncassators = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/incassators`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке данных инкассаторов:", error);
        throw error;
    }
};

// Загрузка ответов
export const fetchResponses = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/responses`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке ответов:", error);
        throw error;
    }
};

// Загрузка годовых оценок
export const fetchEmployeeScores = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/employee_scores`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке годовых оценок:", error);
        throw error;
    }
};

// Загрузка статусов видеопрезентаций
export const fetchVideoStatuses = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get-video-statuses`);
        console.log("Ответ API (fetchVideoStatuses):", response.data);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке статусов видеопрезентаций:", error);
        throw error;
    }
};

// Загрузка данных о видеопрезентациях
export const fetchVideoPresentations = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/video-presentations`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке данных о видеопрезентациях:", error);
        throw error;
    }
};

// Отправка запроса на видеопрезентацию
export const requestVideoPresentation = async (userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/send-video-request`, { userId });
        return response.data;
    } catch (error) {
        console.error("Ошибка при отправке запроса на видеопрезентацию:", error);
        throw error;
    }
};

// Проверка статуса видеопрезентации
export const checkVideoLink = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get-video-link`, {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при проверке статуса видеопрезентации:", error);
        throw error;
    }
};

// Получение комментария руководителя
export const getComment = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get-comment`, {
            params: { userId },
        });
        return response.data.comment;
    } catch (error) {
        console.error("Ошибка при получении комментария:", error);
        throw error;
    }
};

// Сохранение комментария руководителя
export const saveComment = async (userId, comment) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/save-comment`, {
            userId,
            comment,
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при сохранении комментария:", error);
        throw error;
    }
};