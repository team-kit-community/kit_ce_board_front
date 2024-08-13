import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import { BoardListItem, CombineCrawlingListItem } from "types/interface";
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from "constant";
import defaultProfileImage from "assets/image/default-profile-image.png";
import { useState } from "react";
import { useLoginUserStore } from "stores";
import { ResponseDto } from "apis/response";
import { DeleteBoardItemResponseDto } from "apis/response/board";
import { deleteBoardItemRequest } from "apis";
import { useCookies } from "react-cookie";

interface Props {
  boardListItem: BoardListItem;
}

//                          component: Board List Item  컴포넌트                    //
export default function BoardItem({ boardListItem }: Props) {
  const { pathname } = useLocation();
  //                     properties                    //
  const { post_number, title, contents, titleImage } = boardListItem;
  const {
    comment_count,
    favorite_count,
    view_count,
    category_id,
    categoryName,
  } = boardListItem;
  const { writeNickname, writeDatetime, writeProfileImage } = boardListItem;

  const { loginUser } = useLoginUserStore();

  const [cookie] = useCookies();

  //               state: more 버튼 상태                    //
  const [showMore, setShowMore] = useState<boolean>(false);

  const isSearchPage = pathname.startsWith("/search");
  const isMainPage = pathname === MAIN_PATH();
  const isUserPage = pathname.startsWith("/user");
  const isWriter = loginUser && loginUser.nickName === writeNickname && isUserPage;

  //                       function: 네비게이트 함수                         //
  const navigator = useNavigate();

  //                 event handler: 게시물 아이템 클릭 이벤트 처리 함수                          //
  const onClickBoardItemHandler = () => {
    if (!loginUser) {
      alert("로그인이 필요합니다.");
      navigator(AUTH_PATH());
      return;
    }
    navigator(BOARD_PATH(category_id) + "/" + BOARD_DETAIL_PATH(post_number));
  };

  //             event handler: more 버튼 클릭 이벤트 핸들러              //
  const onMoreButtonClickHandler = () => {
    setShowMore(!showMore);
  };

  //             event handler: 수정 버튼 클릭 이벤트 핸들러              //
  const onUpdateButtonClickHandler = () => {
    if (!loginUser || loginUser.nickName !== writeNickname) return;
    navigator(BOARD_PATH(category_id) + "/" + BOARD_UPDATE_PATH(post_number));
  };

  //                     function: 게시물 삭제 응답 처리 함수                     //
  const deleteBoardItemResponse = (responseBody: DeleteBoardItemResponseDto | ResponseDto | null) => {
    
  };

  //             event handler: 삭제 버튼 클릭 이벤트 핸들러              //
  const onDeleteButtonClickHandler = () => {
    if (!loginUser || loginUser.nickName !== writeNickname || !cookie.accessToken) return;
    navigator(MAIN_PATH());
    deleteBoardItemRequest(category_id, post_number, cookie.accessToken).then(deleteBoardItemResponse);
  };

  //  render: Board List Item 컴포넌트 렌더링 //
  return (
    <div>
      {isMainPage ? (
        <div className="main-board-list-item" onClick={onClickBoardItemHandler}>
          <div className="main-board-list-item-box">
            <div className="main-board-list-item-title">{title}</div>
            <div className="main-board-list-item-write-datetime">
              {writeDatetime}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`board-list-item ${
            isSearchPage || isUserPage ? "has-category" : ""
          }`}
          onClick={onClickBoardItemHandler}
        >
          <div className="board-list-item-main-box">
            {(isSearchPage || isUserPage) && (
                <div className="board-list-item-category">{categoryName}</div>
              )}
            <div className="board-list-item-top-wrapper">
              <div className="board-list-item-top">
                <div className="board-list-item-profile-box">
                  <div
                    className="board-list-item-profile-image"
                    style={{
                      backgroundImage: `url(${
                        writeProfileImage
                          ? writeProfileImage
                          : defaultProfileImage
                      })`,
                    }}
                  ></div>
                </div>
                <div className="board-list-item-write-box">
                  <div className="board-list-item-nickname">
                    {writeNickname}
                  </div>
                  <div className="board-list-item-write-datetime">
                    {writeDatetime}
                  </div>
                </div>
              </div>
              {isWriter && (
                <div
                  className="icon-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoreButtonClickHandler();
                  }}
                >
                  <div className="icon more-icon"></div>
                </div>
              )}
              {showMore && (
                <div className="board-detail-more-box" onClick={(e) => e.stopPropagation()}>
                  <div
                    className="board-detail-update-button"
                    onClick={(e) => { e.stopPropagation(); onUpdateButtonClickHandler(); }}
                  >
                    {"수정"}
                  </div>
                  <div
                    className="board-detail-delete-button"
                    onClick={(e) => { e.stopPropagation(); onDeleteButtonClickHandler(); }}
                  >
                    {"삭제"}
                  </div>
                </div>
              )}
            </div>
            <div className="board-list-item-middle">
              <div className="board-list-item-title">{title}</div>
              <div className="board-list-item-content">{contents}</div>
            </div>
            <div className="board-list-item-bottom">
              <div className="board-list-item-counts">
                {`댓글 ${comment_count} | 좋아요 ${favorite_count} | 조회수 ${view_count}`}
              </div>
            </div>
          </div>
          {titleImage !== null && (
            <div className="board-list-item-image-box">
              <div
                className="board-list-item-image"
                style={{ backgroundImage: `url(${titleImage})` }}
              ></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
