import ImageEntity from "./imageEntity.interface";

export default interface BoardEntity {
    post_number: number;
    title: string;
    contents: string;
    write_datetime: string;
    favorite_count: number;
    comment_count: number;
    view_count: number;
    user_id: number;
    category_id: number;
    images: ImageEntity[];
    writeNickname: string;
}