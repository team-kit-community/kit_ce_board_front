import dayjs from "dayjs";
import CommentListItem from "types/interface/comment-list-item-interface";
import defaultProfileImage from "assets/image/default-profile-image.png";
import "./style.css";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useComments } from "hooks";
import { useParams } from "react-router-dom";
import { getCommentListRequest, postSubCommentRequest } from "apis";
import { useCookies } from "react-cookie";
import { PostSubCommentRequestDto } from "apis/request/board";
import { GetCommentListResponseDto, PostSubCommentResponseDto } from "apis/response/board";
import { ResponseDto } from "apis/response";

interface Props {
    commentListItem: CommentListItem;
}

export default function CommentItem({ commentListItem }: Props) {
  const { categoryId, boardNumber } = useParams();
  const [ cookie ] = useCookies();
  const [totalList, setTotalList] = useState<CommentListItem[]>([]);
  const [totalCommentCount, setTotalCommentCount] = useState<number>(0);
  const [subcomment, setSubcomment] = useState<CommentListItem[]>([]);

  const {
    content,
    setContent,
    isButtonVisible,
    setButtonVisible,
    subPostComment,
  } = useComments(categoryId ?? "", boardNumber ?? "");

  //            state: properties           //
  const { comment_id, userNickname, profileImage, writeDatetime, contents, subcomments } =
    commentListItem;

  const [showComment, setShowComment] = useState<boolean>(false);

  //              function: 댓글 작성 함수             //
  const onClickSubmentButtonClickHandler = () => {
    setButtonVisible(!isButtonVisible);
  };

  //           function: 작성일 경과시간 함수          //
  const getElapsedTime = () => {
    const now = dayjs().add(9, "hour");
    const writeTime = dayjs(writeDatetime);

    const gap = now.diff(writeTime, "s");
    if (gap < 60) return `${gap}초 전`;
    if (gap < 3600) return `${Math.floor(gap / 60)}분 전`;
    if (gap < 86400) return `${Math.floor(gap / 3600)}시간 전`;
    return `${Math.floor(gap / 86400)}일 전`;
  };

  const onShowCommentClickHandler = () => {
    console.log(subcomments?.length);
    setShowComment(!showComment);
  };

  //                  state: 댓글 TextArea참조 상태           //
  const commentRef = useRef<HTMLTextAreaElement | null>(null);

  const onCommentCancelButtonClickHandler = () => {
    setButtonVisible(true);
  };

  const GetCommentListResponse = (
    responseBody: GetCommentListResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "NEB") alert("존재하지 않는 게시물이다.");
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") return;

    const { comments } = responseBody as GetCommentListResponseDto;
    setTotalList(comments);
    setTotalCommentCount(comments.length);
  };

  const PostSubCommentResponse = (
    responseBody: PostSubCommentResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "VF") alert("잘못된 접근입니다.");
    if (code === "NEU") alert("존재하지 않는 유저입니다.");
    if (code === "NEB") alert("존재하지 않는 게시물입니다.");
    if (code === "AF") alert("인증에 실패하였습니다.");
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") return;

    setContent("");
    if (!categoryId || !boardNumber) return;
    getCommentListRequest(categoryId, boardNumber).then(GetCommentListResponse);
  };

  const onCommentSubmitButtonClickHandler = () => {
    if (!categoryId || !boardNumber) return;
    const requestBody: PostSubCommentRequestDto = {
      content: content,
      parent_comment_id: comment_id,
    };
    postSubCommentRequest(categoryId, boardNumber, requestBody, cookie.accessToken).then(PostSubCommentResponse);
    setButtonVisible(false);
    setContent("");
    window.location.reload();
  };

  const onCommentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setContent(value);
    if (!commentRef.current) return;
    commentRef.current.style.height = "auto";
    commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;
  };

  useEffect(() => {
    if (!categoryId || !boardNumber) return;
    getCommentListRequest(categoryId, boardNumber).then(GetCommentListResponse);
  }, [categoryId, boardNumber, setContent]);

  return (
    <div className="comment-list-item">
      <div className="comment-list-item-top">
        <div className="comment-list-item-profile-box">
          <div
            className="comment-list-item-profile-image"
            style={{
              backgroundImage: `url(${
                profileImage ? profileImage : defaultProfileImage
              })`,
            }}
          ></div>
        </div>
        <div className="comment-list-item-nickname">{userNickname}</div>
        <div className="comment-list-item-divider">{"|"}</div>
        <div className="comment-list-item-time">{getElapsedTime()}</div>
      </div>
      <div className="comment-list-item-main">
        <div className="comment-list-item-content">{contents}</div>
      </div>
      <div className="comment-list-item-button-group">
        <div
          className="comment-list-item-button"
          onClick={onClickSubmentButtonClickHandler}
        >
          {"답글"}
        </div>

        {subcomments?.length !== 0 && (
          <div className="sub-comment-list-item">
            <div className="icon-button" onClick={onShowCommentClickHandler}>
              {showComment ? (
                <div className="icon up-light-icon"></div>
              ) : (
                <div className="icon down-light-icon"></div>
              )}
            </div>
            <div className="comment-list-item-subcomment-list">
              {`답글 리스트 (${subcomments?.length})`}
              {showComment &&
                subcomments?.map((subComment) => (
                  <CommentItem
                    key={subComment.subcomment_id}
                    commentListItem={subComment}
                  />
                ))}
            </div>
          </div>
        )}

        {isButtonVisible && (
          <div className="comment-list-item-input-box">
            <div className="comment-list-item-input-container">
              <textarea
                ref={commentRef}
                className="board-detail-bottom-comment-textarea"
                placeholder="댓글을 작성해주세요."
                value={content}
                onClick={() => setButtonVisible(true)}
                onChange={onCommentChangeHandler}
              />
              <div className="board-detail-bottom-comment-button-box">
                <div
                  className="black-button"
                  onClick={onCommentCancelButtonClickHandler}
                >
                  {"취소"}
                </div>
                <div
                  className={content === "" ? "disable-button" : "black-button"}
                  onClick={onCommentSubmitButtonClickHandler}
                >
                  {"댓글 달기"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}