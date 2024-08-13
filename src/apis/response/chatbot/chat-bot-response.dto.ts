import ResponseDto from "../Response.dto";

export default interface ChatBotResponseDto extends ResponseDto {
    response: string;
}