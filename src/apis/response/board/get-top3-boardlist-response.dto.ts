import { BoardListItem } from "types/interface";
import ResponseDto from "../Response.dto";

export default interface GetTop3BoardListResponse extends ResponseDto{
    boardListEntities: BoardListItem[];
}