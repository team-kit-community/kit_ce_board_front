import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import { useBoardStore, useLoginUserStore } from "stores";
import { ResponseDto } from "apis/response";
import { GetBoardDetailResponseDto, GetCommentListResponseDto, PostCommentResponseDto, PutFavoriteResponseDto } from "apis/response/board";
import { getBoardDetailRequest, getCommentListRequest, getFavoriteListRequest, postCommentRequest, putFavoriteRequest } from "apis";
import { BoardEntity, User } from "types/interface";
import dayjs from "dayjs";
import { AUTH_PATH, MAIN_PATH, USER_PATH } from "constant";
import ImageEntity from "types/interface/imageEntity.interface";
import { useComments, usePagination } from "hooks";
import CommentListItem from "types/interface/comment-list-item-interface";
import { useCookies } from "react-cookie";
import { PostCommentRequestDto } from "apis/request/board";
import CommentItem from "components/CommnetItem";
import Pagination from "components/Pagination";
import GetFavoriteListResponseDto from "apis/response/board/get-favorite-list-response.dto";
import FavoriteListItem from "types/interface/favorite-list-item.interface";

export default function Detail() {
  //                      state: 게시물 번호path variable 상태 관리             //
  const { categoryId, boardNumber } = useParams();

  //                   state: 로그인 user 상태 관리                       //
  const { loginUser } = useLoginUserStore();

  //                           function: 네비게이트 함수                  //
  const navigator = useNavigate();

  //                             component: 게시물 상세 화면 컴포넌트                     //
  const BoardDetailTop = () => {
    //               state: baord 버튼 상태                    //
    const [board, setBoard] = useState<BoardEntity | null>(null);

    //                   function: 작성일 포멧 변경 처리 함수                   //
    const getWriteDatetime = () => {
      if (!board) return;
      const date = dayjs(board.write_datetime);
      return date.format("YYYY-MM-DD HH:mm:ss");
    };

    //                     function: get board response 처리 함수         //
    const getBoardDetailResponse = (
      responseBody: GetBoardDetailResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === "NEB") alert("존재하지 않는 게시물이다.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") {
        // navigator(MAIN_PATH());
        return;
      }

      const { boardEntity } = responseBody as GetBoardDetailResponseDto;
      setBoard(boardEntity);

      if (!loginUser) {
        alert("로그인이 필요합니다.");
        navigator(AUTH_PATH());
        return;
      }
    };

    //                       Effect: 게시물 번호 path variable 상태가 변경될 때 board 상태 변경 effect   //
    const isInitialMount = useRef(true);

    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      
      if(!loginUser) return;
      if (!categoryId || !boardNumber) return;
    
      getBoardDetailRequest(categoryId, boardNumber).then(getBoardDetailResponse);
    }, [categoryId, boardNumber, loginUser]);

    if (!board) return null;
    return (
      <div className="board-detail-top">
        <div className="board-detail-header">
          <div className="board-detail-title">{board.title}</div>
          <div className="board-detail-top-sub-box">
            <div className="board-detail-write-info-box">
              <div className="board-detail-writer-nickname">
                <div className="icon anonymity-icon"></div>
                <div
                  className="board-detail-writer-nickname-text"
                >
                  {board.writeNickname}
                </div>
              </div>
              <div className="board-detail-write-datetime">
                <div className="icon clock-icon"></div>
                <div className="board-detail-write-datetime-text">
                  {getWriteDatetime()}
                </div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="board-detail-main">
            <div className="board-detail-main-text">{board.contents}</div>
            {board.images.map((images: ImageEntity) => (
              <img className="board-detail-main-image" src={images.image} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  //                              component: 게시물 상세 하단 컴포넌트                    //
  const BoardDetailBottom = () => {
    //                  state: 댓글 TextArea참조 상태           //
    const commentRef = useRef<HTMLTextAreaElement | null>(null);

    const {
      totalList,
      totalCommentCount,
      content,
      setContent,
      isButtonVisible,
      setButtonVisible,
      setTotalCommentCount,
      postComment,
    } = useComments(categoryId ?? "", boardNumber ?? "");

    //                  state: 좋아요 리스트 상태                    //
    const [favoriteList, setFavoriteList] = useState<FavoriteListItem[]>([]);

    //              state: 페이지네이션 관리 상태            //
    const {
      currentPage,
      currentSection,
      viewList,
      viewPageList,
      totalSection,
      setCurrentPage,
      setCurrentSection,
      setTotalList,
    } = usePagination<CommentListItem>(3);

    //                  state: 좋아요 상태                         //
    const [isFavorite, setFavorite] = useState<boolean>(false);
    //                     state: cookie 상태 관리           //
    const [cookie, setCookie] = useCookies();

    const GetFavoriteListResponse = (responseBody: GetFavoriteListResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const { code } = responseBody;
      if (code === "NEB") alert("존재하지 않는 게시물이다.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") return;

      const { favoriteList } = responseBody as GetFavoriteListResponseDto;
      setFavoriteList(favoriteList);
      if (!loginUser) {
        setFavorite(false);
        return;
      }

      const isFavorite =
        favoriteList.findIndex(
          (favorite) => favorite.userId === loginUser.userId
        ) !== -1;

      setFavorite(isFavorite);
    }

    const GetCommentListResponse = (responseBody: GetCommentListResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const { code } = responseBody;
      if (code === "NEB") alert("존재하지 않는 게시물이다.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") return;

      const { comments } = responseBody as GetCommentListResponseDto;
      setTotalList(comments);
      setTotalCommentCount(comments.length);
    }

    //                     function: put favorite response 처리 함수               //
    const PutFavoriteResponse = (
      responseBody: PutFavoriteResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === "VF") alert("잘못된 접근입니다.");
      if (code === "NEU") alert("존재하지 않는 유저입니다.");
      if (code === "NEB") alert("존재하지 않는 게시물입니다.");
      if (code === "AF") alert("인증에 실패하였습니다.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") return;

      if (!categoryId || !boardNumber) return;
      getFavoriteListRequest(categoryId, boardNumber).then(GetFavoriteListResponse);
    };

    //                        event handler: 좋아요 버튼 클릭 이벤트 핸들러              //
    const onFavoriteClickHandler = () => {
      if (!categoryId || !loginUser || !cookie.accessToken || !boardNumber)
        return;
      putFavoriteRequest(categoryId, boardNumber, cookie.accessToken).then(
        PutFavoriteResponse
      );
    };

    //                        event handler: 댓글 작성 버튼 클릭 이벤트 핸들러              //
    const onCommentSubmitButtonClickHandler = () => {
      setButtonVisible(false);
      setContent("");
      postComment();
      window.location.reload();
    };

    //                        event handler: 댓글 변경 이벤트 핸들러              //
    const onCommentChangeHandler = (
      event: ChangeEvent<HTMLTextAreaElement>
    ) => {
      const { value } = event.target;
      setContent(value);
      if (!commentRef.current) return;
      commentRef.current.style.height = "auto";
      commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;
    };

    //                        event handler: 댓글 취소 이벤트 핸들러              //
    const onCommentCancelButtonClickHandler = () => {
      setContent("");
      setButtonVisible(false);
    };

    useEffect(() => {
      if (!categoryId || !boardNumber) return;
      getFavoriteListRequest(categoryId, boardNumber).then(GetFavoriteListResponse);
      getCommentListRequest(categoryId, boardNumber).then(GetCommentListResponse);
    }, [categoryId, boardNumber, setContent]);

    return (
      <div className="board-detail-bottom">
        <div className="board-detail-bottom-button-box">
          <div className="board-detail-bottom-button-group">
            <div className="icon-button" onClick={onFavoriteClickHandler}>
              {isFavorite ? (
                <div className="icon favorite-fill-icon"></div>
              ) : (
                <div className="icon favorite-light-icon"></div>
              )}
            </div>
            <div className="board-detail-bottom-button-text">{`좋아요${favoriteList.length}`}</div>
          </div>
          <div className="board-detail-bottom-button-group">
            <div className="icon-button">
              <div className="icon comment-icon"></div>
            </div>
            <div className="board-detail-bottom-button-text">
              {`댓글${totalCommentCount ? totalCommentCount : 0}`}
            </div>
          </div>
        </div>
        <div className="board-detail-bottom-comment-box">
          <div className="board-detail-bottom-comment-container">
            <div className="board-detail-bottom-comment-title">
              <span className="emphasis">{`댓글${
                totalCommentCount ? totalCommentCount : 0
              }`}</span>
            </div>
            <div className="board-detail-bottom-comment-input-box">
              <div className="board-detail-bottom-comment-input-container">
                <textarea
                  ref={commentRef}
                  className="board-detail-bottom-comment-textarea"
                  placeholder="댓글을 작성해주세요."
                  value={content}
                  onClick={() => setButtonVisible(true)}
                  onChange={onCommentChangeHandler}
                />
                {isButtonVisible && (
                  <div className="board-detail-bottom-comment-button-box">
                    <div
                      className="black-button"
                      onClick={onCommentCancelButtonClickHandler}
                    >
                      {"취소"}
                    </div>
                    <div
                      className={
                        content === "" ? "disable-button" : "black-button"
                      }
                      onClick={onCommentSubmitButtonClickHandler}
                    >
                      {"댓글 달기"}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="board-detail-bottom-comment-list-container">
              {viewList &&
                viewList.map((item) => <CommentItem commentListItem={item} />)}
            </div>
          </div>
          <div className="divider"></div>
          <div className="board-detail-bottom-comment-pagination-box">
            <Pagination
              currentPage={currentPage}
              currentSection={currentSection}
              setCurrentPage={setCurrentPage}
              setCurrentSection={setCurrentSection}
              viewPageList={viewPageList}
              totalSection={totalSection}
            />
          </div>
        </div>
      </div>
    );
  };

  //                    effect: 게시물 번호 path variable이 바뀔때 마다 게시물 조회수 증가      //
  let effectFlag = true;
  useEffect(() => {
    if(!loginUser) return;
    if (!boardNumber) return;
    if (effectFlag) {
      effectFlag = false;
      return;
    }
  }, [categoryId, boardNumber, loginUser]);

  return( 
    <div className="board-detail-wrapper">
        <div className="board-detail-container">
            <BoardDetailTop />
            <BoardDetailBottom />
        </div>
    </div>
  );
}