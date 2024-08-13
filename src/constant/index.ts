export const MAIN_PATH = () => '/';
export const AUTH_PATH = () =>'/auth';
export const SEARCH_PATH = (searchWord: string) => `/search/${searchWord}`;
export const USER_PATH = (userId: string) => `/user/${userId}`;

export const BOARD_PATH = (category_id: number | string) => `/board/${category_id}`;
export const BOARD_DETAIL_PATH = (boardNumber: string | number) => `detail/${boardNumber}`;
export const BOARD_WRITE_PATH = () => 'write';
export const BOARD_UPDATE_PATH = (boardNumber: string | number) => `update/${boardNumber}`;
export const BOARD_CRAWLING_DETAIL_PATH = (boardNumber: string | number) => `crawling-detail/${boardNumber}`;

