import { getCommentListRequest, postCommentRequest, postSubCommentRequest } from "apis";
import { PostCommentRequestDto, PostSubCommentRequestDto } from "apis/request/board";
import { ResponseDto } from "apis/response";
import { GetCommentListResponseDto, PostCommentResponseDto, PostSubCommentResponseDto } from "apis/response/board";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import CommentListItem from "types/interface/comment-list-item-interface";

const useComments = (categoryId: string | number, boardNumber: string | number) => {
    const [totalList, setTotalList] = useState<CommentListItem[]>([]);
    const [totalCommentCount, setTotalCommentCount] = useState<number>(0);
    const [content, setContent] = useState<string>("");
    const [isButtonVisible, setButtonVisible] = useState<boolean>(false);
    const [ cookie ] = useCookies();

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
    }

    const PostCommentResponse = (
      responseBody: PostCommentResponseDto | ResponseDto | null
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
    }

    const postComment = () => {
        if (!categoryId || !totalList || !cookie.accessToken || !boardNumber) return;
        const requestBody: PostCommentRequestDto = {
            content: content,
        };
        postCommentRequest(categoryId, boardNumber, requestBody, cookie.accessToken).then(PostCommentResponse);
    }

    const subPostComment = (parentCommentId: number) => {
        if (!categoryId || !cookie.accessToken || !boardNumber) return;
        console.log("대댓글 달기")
        const requestBody: PostSubCommentRequestDto = {
            content: content,
            parent_comment_id: parentCommentId
        };
        postSubCommentRequest(categoryId, boardNumber, requestBody, cookie.accessToken).then(PostSubCommentResponse);
    }

    useEffect(() => {
        if(!categoryId || !boardNumber) return;
        getCommentListRequest(categoryId, boardNumber).then(GetCommentListResponse);
    }, [categoryId, boardNumber]);

    return {
        totalList,
        setTotalList,
        totalCommentCount,
        setTotalCommentCount,
        content,
        setContent,
        isButtonVisible,
        setButtonVisible,
        postComment,
        subPostComment,
    }
};

export default useComments;