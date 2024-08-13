import WevityActivity from "types/interface/wevity-activities-entity.interface";
import ResponseDto from "../Response.dto";

export default interface GetWevityActivitiesListResponseDto extends ResponseDto {
    activities: WevityActivity[];
}