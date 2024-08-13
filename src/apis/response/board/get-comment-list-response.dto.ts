import CommentListItem from "types/interface/comment-list-item-interface";
import ResponseDto from "../Response.dto";

export default interface GetCommentListResponseDto extends ResponseDto {
    comments: CommentListItem[]
}