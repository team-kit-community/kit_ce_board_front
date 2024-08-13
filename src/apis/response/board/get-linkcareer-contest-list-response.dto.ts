import LinkCareerContest from "types/interface/linkcareer-contest-entity.interface";
import ResponseDto from "../Response.dto";

export default interface GetLinkCareerContestListResponseDto extends ResponseDto {
    contests: LinkCareerContest[];
}

