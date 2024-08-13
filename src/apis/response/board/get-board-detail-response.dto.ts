import { BoardEntity } from "types/interface";
import ResponseDto from "../Response.dto";

export default interface GetBoardDetailResponseDto extends ResponseDto {
    boardEntity: BoardEntity;
};