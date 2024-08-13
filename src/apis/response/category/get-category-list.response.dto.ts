import CategoryList from "types/interface/category-list.interface";
import ResponseDto from "../Response.dto";

export default interface GetCategoryListResponseDto extends ResponseDto{
    categoryList: CategoryList[];
};