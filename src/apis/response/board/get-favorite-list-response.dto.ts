import FavoriteListItem from "types/interface/favorite-list-item.interface";
import ResponseDto from "../Response.dto";

export default interface GetFavoriteListResponseDto extends ResponseDto {
    favoriteList : FavoriteListItem[];
}