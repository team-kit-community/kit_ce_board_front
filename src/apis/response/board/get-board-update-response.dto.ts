import { BoardEntity } from "types/interface";
import ResponseDto from "../Response.dto";

export default interface GetBoardUpdateResponseDto extends ResponseDto {
    boardEntity: BoardEntity;
}