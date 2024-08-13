import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import './style.css'
import { ResponseDto } from 'apis/response';
import ChatBotResponseDto from 'apis/response/chatbot/chat-bot-response.dto';
import ChatBotRequestDto from 'apis/request/chatbot/chat-bot-request.dto';
import { chatBotRequest, chatBotSearchRequest } from 'apis';
import InputChat from 'components/InputChat';
import ChatBotSearchRequestDto from 'apis/request/chatbot/chat-bot-search-request.dto';
import { ChatBotSearchResponseDto } from 'apis/response/chatbot';
import { ChatBotHistoryList, ChatBotMessageList } from 'types/interface';

const mockMessages: ChatBotMessageList[] = [
  
];

export default function ChatBotBox(props: any) {
  //                state: 대화 상태              //
  const [message, setMessage] = useState<ChatBotMessageList[]>(mockMessages);
  //                state: 대화 기록 상태              //
  const [history, setHistory] = useState<ChatBotHistoryList[]>([]);
  //                state: 대화 기록 인덱스 상태              //
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  //                state: 대화 기록 표시 상태              //
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  //                state: 대화 기록 제목 상태               //
  const [historyTitleUpdate, setHistoryTitleUpdate] = useState<boolean>(false);
  //                  state: 입력 요소 참조 상태                  //
  const historyInputRef = useRef<HTMLInputElement | null>(null);
  //                    state: 현재 대화 세션 상태                    //
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  //                 component: 대화 기록 컴포넌트                 //
  const ChatHistory = () => {
    //                state: 검색 입력 상태              //
    const [input, setInput] = useState<string>("");
    //                     state: 대화 기록 제목 업데이트 상태                     //
    const [historyInput, setHistoryInput] = useState<string>("");
    //                  state: 입력 요소 참조 상태                  //
    const inputRef = useRef<HTMLInputElement | null>(null);

    const onChangeInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setInput(value);
    };

    //                function: 챗봇 대화 기록 검색 요청              //
    const chatBotSearchResponse = (
      responseBody: ChatBotSearchResponseDto | ResponseDto | null
    ) => {};

    //                event handler: 검색 입력 키 다운              //
    const onInputKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") return;
      if (!inputRef.current) return;
      const requestBody: ChatBotSearchRequestDto = {
        text: input,
      };

      chatBotSearchRequest(requestBody).then(chatBotSearchResponse);
      setInput("");
    };

    //                event handler: 대화 기록 삭제              //
    const onClickHistoryListDeleteHandler = (index: number) => {
      const newHistory = history.filter((_, i) => i !== index);
      setHistory(newHistory);
    };

    //                event handler: 대화 기록 제목 업데이트              //
    const onClickHistoryListTitleUpdateHandler = (index: number) => {
      setHistoryIndex(index);
      setHistoryTitleUpdate(true);
    };

    //                event handler: 대화 기록 카드 닫기              //
    const onClickHistoryCardCloseHandler = () => {
      setHistoryVisible(false);
      setHistoryTitleUpdate(false);
    };

    const onChangeHistoryTitleHandler = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const { value } = event.target;
      setHistoryInput(value);
      historyInputRef.current?.focus();
    };

    const onKeyDownHistoryTitleHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== "Enter") return;
      if (!historyInputRef.current) return;

      const updatedHistory = history.map((item, i) => {
        if (i === historyIndex) {
          return { ...item, title: historyInput };
        }
        return item;
      });
      setHistory(updatedHistory);
      setHistoryInput("");
      setHistoryTitleUpdate(false);
    };

    const onClickHistoryItemHandler = (historyItem: ChatBotHistoryList) => {
      if (message.length > 0) {
        const existingHistoryItem = history.find(item => item.id === currentSessionId);
        if (!existingHistoryItem && currentSessionId !== null) {
          const newHistoryItem = {
            id: currentSessionId, // 새로운 ID 할당
            title:
              message[0].message.slice(0, 10) +
              (message[0].message.length > 10 ? "..." : ""),
            messages: [...message],
          };
          setHistory([...history, newHistoryItem]);
          setCurrentSessionId(newHistoryItem.id);
        }
      }
      setMessage(historyItem.messages);
      setHistoryVisible(false);
    };

    return (
      <div className="chat-history-card">
        <div className="chat-history-card-top">
          <div className="chat-history-card-title">All Chats</div>
          <div
            className="chat-history-card-close"
            onClick={onClickHistoryCardCloseHandler}
          >
            <div className="icon cross-small-icon"></div>
          </div>
        </div>
        <InputChat
          className="chat-history-input-box"
          ref={inputRef}
          type="text"
          value={input}
          onChange={onChangeInputHandler}
          onKeyDown={onInputKeyDownHandler}
          placeholder="검색 기록..."
        />
        <div className="chat-history-card-list">
          {history.map((historyItem, index) => (
            <div
              className="chat-history-card-list-item"
              onClick={() => onClickHistoryItemHandler(historyItem)}
            >
              <div className="chat-history-card-list-message-icon">
                <div className="icon comment-icon"></div>
              </div>
              <div className="chat-history-card-list-message-title">
                {historyTitleUpdate && historyIndex === index ? (
                  <InputChat
                    className="chat-history-card-list-message-title-input"
                    ref={historyInputRef}
                    type="text"
                    value={historyInput}
                    onChange={onChangeHistoryTitleHandler}
                    onKeyDown={onKeyDownHistoryTitleHandler}
                    placeholder="새 제목을 입력하세요: "
                  />
                ) : (
                  historyItem.title
                )}
              </div>
              <div
                className="chat-history-card-list-message-title-update"
                onClick={() => onClickHistoryListTitleUpdateHandler(index)}
              >
                <div className="icon pencil-icon"></div>
              </div>
              <div
                className="chat-history-card-list-message-delete"
                onClick={() => onClickHistoryListDeleteHandler(index)}
              >
                <div className="icon trash-icon"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  //                   component: 챗봇 헤더 컴포넌트                   //
  const ChatBotHeader = () => {
    const onClickResetHandler = () => {
      if (message.length > 0) {
        const existingHistoryItem = history.find(item => item.id === currentSessionId);
        if (!existingHistoryItem) {
            const newHistoryItem = {
                id: history.length + 1,
                title: message[0].message.slice(0, 10) + (message[0].message.length > 10 ? "..." : ""),
                messages: [...message],
            };
            setHistory([...history, newHistoryItem]);
            setCurrentSessionId(newHistoryItem.id);
        }
        setMessage([]);
      }
    };

    const onClickHistoryCardHandler = () => {
      setHistoryVisible(!historyVisible);
    };

    return (
      <div className="chat-header">
        <div className="chat-header-title">Kumoh bot</div>
        <div className="chat-header-right-box">
          <div
            className="chat-header-right-box-reset-button"
            onClick={onClickResetHandler}
          >
            <div className="icon plus-icon"></div>
          </div>
          <div
            className="chat-header-right-box-history-button"
            onClick={onClickHistoryCardHandler}
          >
            <div className="icon time-past-icon"></div>
          </div>
        </div>
      </div>
    );
  };

  //                   component: 챗봇 푸터 컴포넌트                   //
  const ChatBotFooter = () => {
    //                state: 입력 상태              //
    const [input, setInput] = useState<string>("");
    //                  state: 입력 요소 참조 상태                  //
    const inputRef = useRef<HTMLInputElement | null>(null);
    //                state: 타이핑 메시지 상태              //
    const [typingMessage, setTypingMessage] = useState<string>("");
    //                  state: 메시지 끝 참조 상태                  //
    const messageEndRef = useRef<HTMLDivElement | null>(null);

    const onChangeInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setInput(value);
    };

    const chatBotResponse = (
      responseBody: ChatBotResponseDto | ResponseDto | null
    ) => {
      console.log(responseBody);
      if (responseBody) {
        const response = responseBody as ChatBotResponseDto;
        const newMessage: ChatBotMessageList = { type: "bot", message: response.response };
        setMessage((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    const onInputKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        const newMessage: ChatBotMessageList = { type: "user", message: input };
        setMessage((prevMessages) => [...prevMessages, newMessage]);
        setInput("");
        setTypingMessage(input);

        const requestBody: ChatBotRequestDto = {
          query: input,
        };

        chatBotRequest(requestBody).then(chatBotResponse);
      }
      if (!inputRef.current) return;
    };

    useEffect(() => {
      if (historyTitleUpdate) {
        historyInputRef.current?.focus();
      } else if (inputRef.current) inputRef.current.focus();
      
    }, [message]); // 메시지가 업데이트 될 때마다 스크롤

    useEffect(() => {
      if (messageEndRef.current?.scrollTop) {
        messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
      }
    }, [typingMessage]);

    return (
      <>
        <div className="chat-body">
          {message.map((msg, index) =>
            msg ? ( // msg가 undefined가 아닌지 확인
              <div key={index} className={`chat-body-message ${msg.type}`}>
                {msg.message}
              </div>
            ) : null
          )}
          <div className="chat-body-message-box">{typingMessage}</div>
        </div>
        <div className="chat-footer">
          <InputChat
            className="chat-footer-input-box"
            ref={inputRef}
            type="text"
            value={input}
            onChange={onChangeInputHandler}
            onKeyDown={onInputKeyDownHandler}
            placeholder="메시지를 입력하세요..."
          />
        </div>
      </>
    );
  };

  return (
    <>
      {historyVisible && (
        <div
          className="chat-history-card-overlay"
          style={{ top: `${props.top}px`, left: `${props.left}px` }}
        >
          <ChatHistory />
        </div>
      )}
      <div className="card">
        <ChatBotHeader />
        <ChatBotFooter />
      </div>
    </>
  );
}