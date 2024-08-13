import ResponseDto from "../Response.dto";

export default interface ChatBotSearchRequestDto extends ResponseDto{
    text: string;
}