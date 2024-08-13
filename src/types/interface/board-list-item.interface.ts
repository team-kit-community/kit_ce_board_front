export default interface BoardListItem {
    post_number: number;
    title: string;
    contents: string;
    titleImage: string | null;
    comment_count: number;
    favorite_count: number;
    view_count: number;
    category_id: number;
    writeNickname: string;
    writeDatetime: string;
    writeProfileImage: string | null;
    categoryName: string | null;
};