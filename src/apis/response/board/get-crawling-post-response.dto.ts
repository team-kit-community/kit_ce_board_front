import { CrawlingPostEntity } from "types/interface";
import ResponseDto from "../Response.dto";

export default interface GetCrawlingPostDetailResponseDto extends ResponseDto {
    crawlingEntity: CrawlingPostEntity;
};