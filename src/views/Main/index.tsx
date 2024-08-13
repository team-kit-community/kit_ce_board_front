import { useEffect, useRef, useState } from "react";
import "./style.css";
import ChatBot from "views/ChatBot";
import { BoardListItem } from "types/interface";
import { ResponseDto } from "apis/response";
import { GetCategoryListItemResponseDto, GetLatestBoardListResponseDto, GetTop3BoardListResponseDto } from "apis/response/board";
import { getCategoryListItemRequest, getLatestBoardListRequest, getTop3BoardListRequest } from "apis";
import Top3Item from "components/Top3Item";
import { useBoardStore, useLoginUserStore } from "stores";
import defaultProfileImage from "assets/image/default-profile-image.png";
import { useCookies } from "react-cookie";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { BOARD_PATH, BOARD_WRITE_PATH, MAIN_PATH, USER_PATH } from "constant";
import { usePagination } from "hooks";
import BoardItem from "components/BoardItem";
import Pagination from "components/Pagination";
import BoardMain from "views/Board/BoardMain";
import CategoryOfBoardList from "types/interface/category-of-board-list.interface";
import CategoryBoardList from "components/CategoryBoardList";

export default function Main() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardPosition, setCardPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const { category, setCategory } = useBoardStore();
  //                    state: cookie 상태                //
  const [cookies, setCookie] = useCookies();
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
  const { pathname } = useLocation();
  const { categoryId } = useParams();
  const isMainPage = pathname === MAIN_PATH();
  const isBoardPage = pathname === BOARD_PATH(Number(categoryId));
  //                       function: 네비게이트 함수                   //
  const navigator = useNavigate();

  //                         component: 메인 화면 상단 컴포넌트                      //
  const MainTop = () => {
    //                        state: 카테고리 리스트 상태                     //
    const [categoryOfBoardList, setCategoryOfBoardList] = useState<CategoryOfBoardList[]>([]);

    //                         function: get category list response 처리 함수                      //
    const getCategoryListItemResponse = (
      responseBody: GetCategoryListItemResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") return;

      const { categoryOfBoardList } = responseBody as GetCategoryListItemResponseDto;
      setCategoryOfBoardList(categoryOfBoardList);
    };

    //                          effect: 첫 마운트 시 실행될 함수                              //
    useEffect(() => {
      getCategoryListItemRequest().then(getCategoryListItemResponse);
    }, []);

    return (
      <div className="main-top-container">
          <div className="main-top-category-item">
            {categoryOfBoardList.map((categoryItem) => (
              <CategoryBoardList
                categoryName={categoryItem.categoryName}
                boardListEntities={categoryItem.boardListEntities}
              />
            ))}
          </div>
      </div>
    );
  };

  //                           component: 메인 화면 하단 컴포넌트                      //
  const MainBottom = () => {
    //                      state: 주간 Top3 게시물 리스트 상태                    //
    const [top3BoardList, setTop3BoardList] = useState<BoardListItem[]>([]);

    //                      function: get top3 board list response 처리 함수     //
    const getTop3BoardListResponse = (
      responseBody: GetTop3BoardListResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") return;

      const { boardListEntities } = responseBody as GetTop3BoardListResponseDto;
      setTop3BoardList(boardListEntities);
    };

    //                  effect : 첫 마운트 시 실행될 함수                   //
    useEffect(() => {
      getTop3BoardListRequest(category.category_id).then(
        getTop3BoardListResponse
      );
    }, [category]);

    return (
      <div className="main-bottom-wrapper">
        <div className="main-bottom-container">
          <div className="main-bottom-contents-box">
            <div className="main-bottom-contents-title"></div>
            <div className="main-bottom-contents">
              {top3BoardList.map((top3ListItem) => (
                <Top3Item top3ListItem={top3ListItem} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  //                            component: 메인 유저 컴포넌트                            //
  const MainUser = () => {
    //        state: userEmail path variable 상태                 //
    const { userId } = useParams();
    const navigate = useNavigate();

    //                         event handler: 프로필 버튼 클릭 시 실행 함수                       //
    const onCLickProfileButtonHandler = () => {
      if (!loginUser) return;
      const { userId } = loginUser;
      navigate(USER_PATH(userId));
    };

    //                         event handler: 로그아웃 버튼 클릭 시 실행 함수                       //
    const onClickLogoutButtonHandler = () => {
      setCookie("accessToken", "", { path: "/" });
      resetLoginUser();
    };

    useEffect(() => {
      if (!loginUser) return;
    }, [loginUser]);

    return (
      <div className="main-user-card">
        <div
          className="main-user-card-profileImage"
          style={{
            backgroundImage: `url(${
              !loginUser?.profileImage
                ? loginUser?.profileImage
                : defaultProfileImage
            })`,
          }}
        ></div>
        <div className="main-user-card-simple-data">
          <div className="main-user-card-nickname">{loginUser?.nickName}</div>
          <div className="main-user-card-userId">{loginUser?.userId}</div>
        </div>
        <div className="main-user-card-button-box">
          <div className="white-button" onClick={onCLickProfileButtonHandler}>
            {"프로필"}
          </div>
          <div className="white-button" onClick={onClickLogoutButtonHandler}>
            {"로그아웃"}
          </div>
        </div>
      </div>
    );
  };

  //                           component: 메인 챗봇 화면 컴포넌트                         //
  const ChatBots = () => {
    return <div className=""></div>;
  };

  useEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCardPosition({ top: rect.top, left: rect.left });
    }
    if (!cookies.accessToken) {
      resetLoginUser();
      return;
    }
    if(isMainPage) {
      setCategory({ category_id: 0, name: "", sortStatus: "", searchCount: 0, pagingStartOffset: 0});
    }
  }, []);

  return (
    <div className="main-page-wrapper">
      {isMainPage && (
        <div className="main-page-container">
          <div className="main-page-container-box">
            <div className="main-page-user-box">
              {loginUser && <MainUser />}
            </div>
            <div className="main-page-main-top-box">
              <MainTop />
            </div>
            <div className="main-page-main-chat-box">
              <ChatBot cardPosition={cardPosition} />
            </div>
          </div>
          <div className="main-page-main-bottom-box">
            <MainBottom />
          </div>
        </div>
      )} 
      {isBoardPage && (
        <div className="main-page-main-board-container">
          <div className="main-page-main-board-bottom-box">
            <MainBottom />
          </div>
          <div className="main-page-main-board-container-box">
            <div className="main-page-main-board-box">
              <BoardMain />
            </div>
            <div className="main-page-main-board-chat-box">
              <ChatBot cardPosition={cardPosition} />
            </div>
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
}