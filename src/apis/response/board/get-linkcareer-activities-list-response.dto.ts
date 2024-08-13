import LinkCareerActivity from "types/interface/linkcareer-activities-entity.interface";
import ResponseDto from "../Response.dto";

export default interface GetLinkCareerActivitiesListResponseDto extends ResponseDto {
    activities: LinkCareerActivity[];
}