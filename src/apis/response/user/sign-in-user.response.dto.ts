import { User } from "types/interface";
import ResponseDto from "../Response.dto";

export default interface GetSignInUserResponseDto extends ResponseDto, User {
    
}