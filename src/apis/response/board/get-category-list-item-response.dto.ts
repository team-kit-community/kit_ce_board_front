import CategoryOfBoardList from "types/interface/category-of-board-list.interface";
import ResponseDto from "../Response.dto";

export default interface GetCategoryListItemResponseDto extends ResponseDto{
    categoryOfBoardList: CategoryOfBoardList[];
};