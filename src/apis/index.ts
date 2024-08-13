import { SignInRequestDto, SignUpEmailCertificationRequestDto, SignUpRequestDto, UserIdCheckRequestDto } from "./request/auth";
import { ResponseDto } from "./response";
import axios, { AxiosResponse } from 'axios';
import { SignInResponseDto, SignUpEmailCertificationResponseDto, SignUpResponseDto, UserIdCheckResponseDto } from "./response/auth";
import { GetSignInUserResponseDto, NicknameChangeResponseDto, PatchPasswordResponseDto } from "./response/user";
import { GetCategoryListResponseDto } from "./response/category";
import ChatBotRequestDto from "./request/chatbot/chat-bot-request.dto";
import { ChatBotResponseDto, ChatBotSearchResponseDto } from "./response/chatbot";
import { ChatBotSearchRequestDto } from "./request/chatbot";
import { DeleteBoardItemResponseDto, GetBoardDetailResponseDto, GetBoardUpdateResponseDto, GetCategoryListItemResponseDto, GetCommentListResponseDto, GetLatestBoardListResponseDto, GetLinkCareerActivitiesListResponseDto, GetLinkCareerContestListResponseDto, GetTop3BoardListResponseDto, GetUserBoardListResponseDto, GetWevityActivitiesListResponseDto, GetWevityContestListResponseDto, PatchBoardResponseDto, PostBoardResponseDto, PostCommentResponseDto, PostSubCommentResponseDto, PutFavoriteResponseDto } from "./response/board";
import { PatchBoardRequestDto, PostBoardRequestDto, PostCommentRequestDto, PostSubCommentRequestDto } from "./request/board";
import { NicknameChangeRequestDto, PatchPasswordRequestDto } from "./request/user";
import { GetSearchBoardListResponseDto } from "./response/search";
import GetFavoriteListResponseDto from "./response/board/get-favorite-list-response.dto";
import GetCrawlingPostDetailResponseDto from "./response/board/get-crawling-post-response.dto";

const responseHandler = <T>(response: AxiosResponse<any, any>) => {
    const responseBody: T = response.data;
    return responseBody;
}

const errorHandler = (error: any) => {
    if(!error.response || !error.response.data) return null;
    const responseBody: ResponseDto = error.response.data;
    return responseBody;
}

const DOMAIN = 'http://localhost:4000';
const CHAT_DOMAIN = 'http://34.64.246.212:8000';
const API_DOMAIN = `${DOMAIN}/api/v1`;
const FILE_DOMAIN = `${DOMAIN}/file`;

const authorization = (accessToken: string) => {
    return {headers: {Authorization: `Bearer ${accessToken}`}}
};

const multipartFormData = {headers: {'Content-Type': 'multipart/form-data'}};

const SIGN_IN_URL = () => `${API_DOMAIN}/auth/signIn`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/signUp`;
const SIGN_UP_EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/emailCertification`;
const USER_ID_CHECK_URL = () => `${API_DOMAIN}/auth/checkUserId`;
const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;
const GET_CATEGORY_LIST_URL = () => `${API_DOMAIN}/category`;
const CHAT_BOT_URL = () => `${CHAT_DOMAIN}/query`;
const CHAT_BOT_SEARCH_URL = () => `${CHAT_DOMAIN}/chatbot/search`;
const GET_TOP3_BOARD_LIST_URL = (categoryId: number) => `${API_DOMAIN}/board/${categoryId}/Top_3`;
const PATCH_BOARD_URL = (category_id: number | string, post_number: number | string) => `${API_DOMAIN}/board/${category_id}/${post_number}`;
const POST_BOARD_URL = (category_id: number| string) => `${API_DOMAIN}/board/${category_id}/register`;
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;
const GET_LATEST_BOARD_LIST_URL = (category_id: number) => `${API_DOMAIN}/board/${category_id}/latest_list`;
const GET_USER_BOARD_LIST_URL = (userId: string) => `${API_DOMAIN}/board/user-board-list/${userId}`;
const NICKNAME_CHANGE_URL = () => `${API_DOMAIN}/auth/changeNickname`;
const PATCH_PASSWORD_URL = () => `${API_DOMAIN}/auth/changePassword`;
const GET__SEARCH_BOARD_LIST_URL = (searchWord: string) => `${API_DOMAIN}/board/Search_list/${searchWord}`;
const GET_BOARD_DETAIL_URL = (category_id: number | string, post_number: number | string) => `${API_DOMAIN}/board/${category_id}/${post_number}`;
const GET_CATEGORY_LIST_ITEM_URL = () => `${API_DOMAIN}/board/main-list`;
const PUT_FAVORITE_URL = (category_id: number | string, boardNumber: number | string) => `${API_DOMAIN}/board/${category_id}/${boardNumber}/favorite`;
const GET_FAVORITE_LIST_URL = (category_id: number | string, boardNumber: number | string) => `${API_DOMAIN}/board/${category_id}/${boardNumber}/favorite-list`;
const POST_COMMENT_URL = (category_id: number | string, boardNumber: number | string) => `${API_DOMAIN}/board/${category_id}/${boardNumber}/comment`;
const POST_SUB_COMMENT_URL = (category_id: number | string, boardNumber: number | string) => `${API_DOMAIN}/board/${category_id}/${boardNumber}/subComment`;
const GET_COMMENT_LIST_URL = (category_id: number | string, boardNumber: number | string) => `${API_DOMAIN}/board/${category_id}/${boardNumber}/comment-list`;
const DELETE_BOARD_ITEM_URL = (category_id: number | string, boardNumber: number | string) => `${API_DOMAIN}/board/${category_id}/${boardNumber}/delete`;
const GET_BOARD_UPDATE_URL = (category_id: number | string, boardNumber: number | string) => `${API_DOMAIN}/board/${category_id}/${boardNumber}`;
const GET_WEVITY_CONTEST_LIST_URL = () => `${API_DOMAIN}/crawling/crawlContestsFromWevityList`;
const GET_WEVITY_ACTIVITIES_LIST_URL = () => `${API_DOMAIN}/crawling/crawlActivitiesFromWevityList`;
const GET_LINKCAREER_CONTEST_LIST_URL = () => `${API_DOMAIN}/crawling/crawlContestsFromLinkCareerList`;
const GET_LINKCAREER_ACTIVITIES_LIST_URL = () => `${API_DOMAIN}/crawling/crawlActivitiesFromLinkCareerList`;
const GET_CRAWLING_POST_DETAIL_URL = (category_id: number | string, post_number: number | string, type: string) => `${API_DOMAIN}/crawling/${category_id}/${post_number}/crawlPostDetail/${type}`;

export const getCrawlingBoardDetailRequest = async (category_id: number | string, post_number: number | string, type: string) => {
    const result = await axios.get(GET_CRAWLING_POST_DETAIL_URL(category_id, post_number, type))
    .then(responseHandler<GetCrawlingPostDetailResponseDto>)
    .catch(errorHandler);
    return result;
}

export const getLinkCareerActivitiesListRequest = async () => {
    const result = await axios.get(GET_LINKCAREER_ACTIVITIES_LIST_URL())
    .then(responseHandler<GetLinkCareerActivitiesListResponseDto>)
    .catch(errorHandler);
    return result;
}

export const getLinkCareerContestListRequest = async () => {
    const result = await axios.get(GET_LINKCAREER_CONTEST_LIST_URL())
    .then(responseHandler<GetLinkCareerContestListResponseDto>)
    .catch(errorHandler);
    return result;
}

export const getWevityActivitiesListRequest = async () => {
    const result = await axios.get(GET_WEVITY_ACTIVITIES_LIST_URL())
    .then(responseHandler<GetWevityActivitiesListResponseDto>)
    .catch(errorHandler);
    return result;
}

export const getWevityContestListRequest = async () => {
    const result = await axios.get(GET_WEVITY_CONTEST_LIST_URL())
    .then(responseHandler<GetWevityContestListResponseDto>)
    .catch(errorHandler);
    return result;
}

export const postSubCommentRequest = async (category_id: number | string, boardNumber: number | string, requestBody: PostSubCommentRequestDto, accessToken: string) => {
    const result = await axios.post(POST_SUB_COMMENT_URL(category_id, boardNumber), requestBody, authorization(accessToken))
    .then(responseHandler<PostSubCommentResponseDto>)
    .catch(errorHandler);
    return result;
}

export const getFavoriteListRequest = async (category_id: number | string, boardNumber: number | string) => {
    const result = await axios.get(GET_FAVORITE_LIST_URL(category_id, boardNumber))
    .then(responseHandler<GetFavoriteListResponseDto>)
    .catch(errorHandler);
    return result;
}

export const getBoardUpdateRequest = async (category_id: number | string, boardNumber: number | string, accessToken: string) => {
    const result = await axios.get(GET_BOARD_UPDATE_URL(category_id, boardNumber), authorization(accessToken))
    .then(responseHandler<GetBoardUpdateResponseDto>)
    .catch(errorHandler);
    return result;
}

export const deleteBoardItemRequest = async (category_id: number | string, boardNumber: number | string, accessToken: string) => {
    const result = await axios.delete(DELETE_BOARD_ITEM_URL(category_id, boardNumber), authorization(accessToken))
    .then(responseHandler<DeleteBoardItemResponseDto>)
    .catch(errorHandler);
    return result;
}

export const getCommentListRequest = async (category_id: number | string, boardNumber: number | string) => {
    const result = await axios.get(GET_COMMENT_LIST_URL(category_id, boardNumber))
    .then(responseHandler<GetCommentListResponseDto>)
    .catch(errorHandler);
    return result;
}

export const postCommentRequest = async (category_id: number | string, boardNumber: number | string, requestBody: PostCommentRequestDto, accessToken: string) => {
    const result = await axios.post(POST_COMMENT_URL(category_id, boardNumber), requestBody, authorization(accessToken))
    .then(responseHandler<PostCommentResponseDto>)
    .catch(errorHandler);
    return result;
}

export const putFavoriteRequest = async (category_id: number | string, boardNumber: number | string, accessToken: string) => {
    const result = await axios.put(PUT_FAVORITE_URL(category_id, boardNumber), {}, authorization(accessToken))
    .then(responseHandler<PutFavoriteResponseDto>)
    .catch(errorHandler);
    return result;
}

export const getCategoryListItemRequest = async () => {
    const result = await axios.get(GET_CATEGORY_LIST_ITEM_URL())
    .then(responseHandler<GetCategoryListItemResponseDto>)
    .catch(errorHandler);
    return result;
}

export const getBoardDetailRequest = async (category_id: number | string, post_number: number | string) => {
    const result = await axios.get(GET_BOARD_DETAIL_URL(category_id, post_number))
    .then(responseHandler<GetBoardDetailResponseDto>)
    .catch(errorHandler);
    return result;
}

export const getSearchBoardListRequest = async (searchWord: string, accessToken: string) => {
    const result = await axios.get(GET__SEARCH_BOARD_LIST_URL(searchWord), authorization(accessToken))
    .then(responseHandler<GetSearchBoardListResponseDto>)
    .catch(errorHandler);
    return result;
}

export const patchPasswordRequest = async (requestBody: PatchPasswordRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_PASSWORD_URL(), requestBody, authorization(accessToken))
    .then(responseHandler<PatchPasswordResponseDto>)
    .catch(errorHandler);
    return result;
};

export const nicknameChangeRequest = async (requestBody: NicknameChangeRequestDto, accessToken: string) => {
    const result = await axios.patch(NICKNAME_CHANGE_URL(), requestBody, authorization(accessToken))
    .then(responseHandler<NicknameChangeResponseDto>)
    .catch(errorHandler);
    return result;
};

export const getUserBoardListRequest = async (userId: string) => {
    const result = await axios.get(GET_USER_BOARD_LIST_URL(userId))
    .then(responseHandler<GetUserBoardListResponseDto>)
    .catch(errorHandler);
    return result;
};

export const getLatestBoardListRequest = async (category_id: number) => {
    const result = await axios.get(GET_LATEST_BOARD_LIST_URL(category_id))
    .then(responseHandler<GetLatestBoardListResponseDto>)
    .catch(errorHandler);
    return result;
};

export const fileUploadRequest = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_URL(), data, multipartFormData)
    .then(responseHandler<string>)
    .catch(null);
    return result;
}

export const postBoardRequest = async (category_id: number | string, requestBody: PostBoardRequestDto, accessToken: string) => {
    const result = await axios.post(POST_BOARD_URL(category_id), requestBody, authorization(accessToken))
    .then(responseHandler<PostBoardResponseDto>)
    .catch(errorHandler);
    return result;
}

export const patchBoardRequest = async (category_id: number | string, post_number: number | string, requestBody: PatchBoardRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_BOARD_URL(category_id, post_number), requestBody, authorization(accessToken))
    .then(responseHandler<PatchBoardResponseDto>)
    .catch(errorHandler);
    return result;
}

export const getTop3BoardListRequest = async (categoryId: number) => {
    const result = await axios.get(GET_TOP3_BOARD_LIST_URL(categoryId))
    .then(responseHandler<GetTop3BoardListResponseDto>)
    .catch(errorHandler);
    return result;
}

export const chatBotSearchRequest = async (requestBody: ChatBotSearchRequestDto) => {
    const result = await axios.post(CHAT_BOT_SEARCH_URL(), requestBody)
    .then(responseHandler<ChatBotSearchResponseDto>)
    .catch(errorHandler);
    return result;
}

export const chatBotRequest = async (requestBody: ChatBotRequestDto) => {
    const result = await axios.post(CHAT_BOT_URL(), requestBody)
    .then(responseHandler<ChatBotResponseDto>)
    .catch(errorHandler);
    return result;
}

export const signInRequest = async (requestBody: SignInRequestDto) => {
    const result = await axios.post(SIGN_IN_URL(), requestBody)
    .then(responseHandler<SignInResponseDto>)
    .catch(errorHandler);
    return result;
}

export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody)
    .then(responseHandler<SignUpResponseDto>)
    .catch(errorHandler);
    return result;
}

export const signUpEmailCertificationRequest = async (requestBody: SignUpEmailCertificationRequestDto) => {
    const result = await axios.post(SIGN_UP_EMAIL_CERTIFICATION_URL(), requestBody)
    .then(responseHandler<SignUpEmailCertificationResponseDto>)
    .catch(errorHandler);
    return result;
}

export const userIdCheckRequest = async (requestBody: UserIdCheckRequestDto) => {
    const result = await axios.post(USER_ID_CHECK_URL(), requestBody)
    .then(responseHandler<UserIdCheckResponseDto>)
    .catch(errorHandler);
    return result;
}

export const getSignInUserRequest = async (accessToken: string) => {
    const result = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken))
    .then(responseHandler<GetSignInUserResponseDto>)
    .catch(errorHandler);
    return result;
}

export const getCategoryListRequest = async () => {
    const result = await axios.get(GET_CATEGORY_LIST_URL())
    .then(responseHandler<GetCategoryListResponseDto>)
    .catch(errorHandler);
    return result;
}