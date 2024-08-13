export default interface ChatBotMessageList {
    type: 'user' | 'bot';
    message: string;
}