import ChatBotMessageList from "./chat-bot-message-list.interface";

export default interface ChatBotHistoryList {
    id: number;
    title: string;
    messages: ChatBotMessageList[];
}
