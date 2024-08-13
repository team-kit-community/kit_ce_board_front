import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import "./style.css";
import { useBoardStore, useLoginUserStore } from "stores";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from "constant";
import CategoryList from "types/interface/category-list.interface";
import GetCategoryListResponseDto from "apis/response/category/get-category-list.response.dto";
import { ResponseDto } from "apis/response";
import { fileUploadRequest, getCategoryListRequest, patchBoardRequest, postBoardRequest } from "apis";
import CategoryName from "components/CategoryItem";
import { PatchBoardResponseDto, PostBoardResponseDto } from "apis/response/board";
import { PatchBoardRequestDto, PostBoardRequestDto } from "apis/request/board";

//                           component: 헤더 컴포넌트                        //
export default function Header() {
  //              state: 로그인 유저 상태           //
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
  const { category, setCategory, resetCategory } = useBoardStore();

  //                     state: 카테고리 id path variable 상태               //
  const { categoryId } = useParams();

  //                state: 게시물 번호 path variable          //
  const { boardNumber } = useParams();

  //              state: path 상태              //
  const { pathname } = useLocation();

  //            state: cookie 상태              //
  const [cookies, setCookie] = useCookies();

  //              state: 로그인 상태           //
  const [isLogin, setLogin] = useState<boolean>(false);

  const isAuthPage = pathname === AUTH_PATH();
  const isMainPage = pathname === MAIN_PATH();
  const isBoardPage = pathname === BOARD_PATH(category.category_id);
  const isSearchPage = pathname.startsWith(SEARCH_PATH(""));
  const isBoardDetailPage = pathname.includes("detail");
  const isBoardWritePage = pathname.includes("write");
  const isBoardUpdatePage = pathname.includes("update");
  const isUserPage = pathname.startsWith(USER_PATH(""));

  //                function: 네비게이트 함수              //
  const navigate = useNavigate();

  //              event handler: 로고 클릭 이벤트 핸들러              //
  const onLogoClickHandler = () => {
    resetCategory();
    localStorage.removeItem("selectedCategory");
    navigate(MAIN_PATH());
  };

  //             component: 검색 버튼 컴포넌트              //
  const SearchButton = () => {
    //            state: 검색어 버튼 요소 참조 상태           //
    const searchButtonRef = useRef<HTMLDivElement | null>(null);

    //            state: 검색 버튼 상태           //
    const [status, setStatus] = useState<boolean>(false);

    //               state: 검색어 상태                  //
    const [Word, setWord] = useState<string>("");

    //               state: 검색어 path variable상태                  //
    const { searchWord } = useParams();

    //                   event handler: 검색 변경 이벤트 처리 함수            //
    const onSearchWordChangeHandler = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const value = event.target.value;
      setWord(value);
    };

    //                   event handler: 검색 키 이벤트 처리 함수            //
    const onSearchWordKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== "Enter") return;
      if (!searchButtonRef.current) return;
      searchButtonRef.current.click();
    };

    //                   event handler: 검색 아이콘 클릭 이벤트 처리 함수            //
    const onSearchButtonClickHandler = () => {
      navigate(SEARCH_PATH(Word));
    };

    //                   effect: 검색어 path variable 변경될 때 마다 실행될 함수            //
    useEffect(() => {
      if (searchWord) {
        setWord(searchWord);
        setStatus(true);
      }
    }, [searchWord]);

    //                render: 검색 버튼 컴포넌트 렌더링 함수 (true)           //
    return (
      <div className="header-search-input-box">
        <input
          className="header-search-input"
          type="text"
          placeholder="검색어를 입력해주세요."
          value={Word}
          onChange={onSearchWordChangeHandler}
          onKeyDown={onSearchWordKeyDownHandler}
        />
        <div
          ref={searchButtonRef}
          className="icon-button"
          onClick={onSearchButtonClickHandler}
        >
          <div className="icon search-light-icon"></div>
        </div>
      </div>
    );
  };

  //           component: 로그인 또는 마이페이지 버튼 컴포넌트        //
  const MyPageButton = () => {
    //        state: userEmail path variable 상태                 //
    const { userId } = useParams();

    //            event handler: 마이페이지 버튼 클릭 이벤트 처리 함수             //
    const onMyPageButtonClickHandler = () => {
      if (!loginUser) return;
      const { userId } = loginUser;
      navigate(USER_PATH(userId));
    };

    //            event handler: 로그아웃 버튼 클릭 이벤트 처리 함수             //
    const onSignOutButtonClickHandler = () => {
      resetLoginUser();
      setCookie("accessToken", "", { path: MAIN_PATH(), expires: new Date() });
      navigate(MAIN_PATH());
    };

    //            event handler: 로그인 버튼 클릭 이벤트 처리 함수             //
    const onSignInButtonClickHandler = () => {
      navigate(AUTH_PATH());
    };

    //           render: 로그아웃 버튼 컴포넌트 렌더링              //
    if (isLogin && userId === loginUser?.userId) {
      return (
        <div className="white-button" onClick={onSignOutButtonClickHandler}>
          {"로그아웃"}
        </div>
      );
    }

    if (isLogin) {
      //           render: 마이페이지 버튼 컴포넌트 렌더링              //
      return (
        <div className="white-button" onClick={onMyPageButtonClickHandler}>
          {"마이페이지"}
        </div>
      );
    }

    //           render: 로그인 버튼 컴포넌트 렌더링              //
    return (
      <div className="black-button" onClick={onSignInButtonClickHandler}>
        {"로그인"}
      </div>
    );
  };

  //           component: 업로드 클릭 버튼 컴포넌트        //
  const UploadButton = () => {
    //                 state:  게시물 상태               //
    const { title, content, boardImageFileList, category, resetBoard } =
      useBoardStore();

    //                 function: post Board response 처리 함수               //
    const postBoardResponse = (
      responseBody: PostBoardResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === "AF" || code === "NEU") navigate(AUTH_PATH());
      if (code === "VF") alert("제목과 내용은 필수입니다.");
      if (code === "DBE") alert("데이터 베이스 오류입니다.");
      if (code !== "SU") return;

      resetBoard();
      if (!loginUser) return;
      const { userId } = loginUser;
      navigate(USER_PATH(userId));
    };

    //                 function: patch Board response 처리 함수               //
    const patchBoardResponse = (
      responseBody: PatchBoardResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === "AF" || code === "NEU" || code === "NEB" || code === "NP")
        navigate(AUTH_PATH());
      if (code === "VF") alert("제목과 내용은 필수입니다.");
      if (code === "DBE") alert("데이터 베이스 오류입니다.");
      if (code !== "SU") return;

      if (!boardNumber || !categoryId) return;
      navigate(BOARD_PATH(categoryId) + "/" + BOARD_DETAIL_PATH(boardNumber));
    };

    //                 event handler: 업로드 버튼 클릭 이벤트 처리 함수          //
    const onUploadButtonClickHandler = async () => {
      const accessToken = cookies.accessToken;
      if (!accessToken) return;

      const boardImageList: string[] = [];
      for (const file of boardImageFileList) {
        const data = new FormData();
        data.append("file", file);

        const url = await fileUploadRequest(data);
        if (url) boardImageList.push(url);
      }

      if (isBoardWritePage) {
        const requestBody: PostBoardRequestDto = {
          title,
          content,
          boardImageList,
        };
        if (!categoryId) return;
        postBoardRequest(categoryId, requestBody, accessToken).then(
          postBoardResponse
        );
      } else if (isBoardUpdatePage) {
        if (!boardNumber) return;
        const requestBody: PatchBoardRequestDto = {
          title,
          content,
          boardImageList,
        };
        if (!categoryId) return;
        patchBoardRequest(
          categoryId,
          boardNumber,
          requestBody,
          accessToken
        ).then(patchBoardResponse);
      }
    };

    //           render: 업로드 버튼 컴포넌트 렌더링              //
    if (title && content) {
      return (
        <div className="black-button" onClick={onUploadButtonClickHandler}>
          {"업로드"}
        </div>
      );
    }

    //           render: 업로드 불가 버튼 컴포넌트 렌더링              //
    return <div className="disable-button">{"업로드"}</div>;
  };

  //            component: 카테고리 버튼 컴포넌트            //
  const CategoryButton = () => {
    //              state: 카테고리 버튼 상태           //
    const [inputCategory, setInputCategory] = useState<CategoryList[]>([]);

    //                    function: get category list response 처리 함수              //
    const getCategoryListResponse = (
      responseBody: GetCategoryListResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code !== "SU") return;

      const { categoryList } = responseBody as GetCategoryListResponseDto;
      setInputCategory(categoryList);
    };

    //                    effect: 첫 마운트 시 실행될 함수                     //
    useEffect(() => {
      getCategoryListRequest().then(getCategoryListResponse);
    }, []);

    //                    event handler: 카테고리 클릭 이벤트 처리 함수              //
    const onCategoryClickHandler = (category: CategoryList) => {
      navigate(BOARD_PATH(category.category_id));
      setCategory(category);
      localStorage.setItem("selectedCategory", JSON.stringify(category));
    };

    //              render: 카테고리 버튼 컴포넌트 렌더링 함수           //
    return (
      <div className="wrap">
        {inputCategory.map((categoryList) => (
          <div onClick={() => onCategoryClickHandler(categoryList)}>
            <CategoryName categoryList={categoryList} />
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    setLogin(loginUser !== null);
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
      const category = JSON.parse(savedCategory);
      setCategory(category);
    }
  }, [loginUser, isBoardWritePage]);

  //           render: 헤더 컴포넌트의 렌더링 함수           //
  return (
    <div className="header">
      <div className="header-container">
        <div className="header-left-box" onClick={onLogoClickHandler}>
          <div className="icon-box">
            <div className="icon kumoh-signature-icon"></div>
          </div>
          <div className="header-logo">{"Kumoh Board"}</div>
        </div>
        <div className="header-active-box">
          {(isMainPage ||
            isSearchPage ||
            isBoardDetailPage ||
            isUserPage ||
            isBoardPage ||
            isBoardWritePage) && <CategoryButton />}
        </div>
        <div className="header-right-box">
          {(isAuthPage ||
            isMainPage ||
            isSearchPage ||
            isBoardDetailPage ||
            isBoardPage) && <SearchButton />}
          {(isMainPage ||
            isSearchPage ||
            isBoardDetailPage ||
            isUserPage ||
            isBoardPage) && <MyPageButton />}
          {(isBoardWritePage || isBoardUpdatePage) && <UploadButton />}
        </div>
      </div>
    </div>
  );
}