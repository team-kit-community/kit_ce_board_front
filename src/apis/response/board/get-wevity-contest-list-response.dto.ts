import WevityContest from "types/interface/wevity-contest-entity.interface";
import ResponseDto from "../Response.dto";

export default interface GetWevityContestListResponseDto extends ResponseDto {
    contests: WevityContest[];
}