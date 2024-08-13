export default interface CommentListItem {
    comment_id: number;
    contents: string;
    writeDatetime: string;
    subcomment_id: number | null;
    userNickname: string;
    profileImage: string | null;
    subcomments: CommentListItem[];
}

