import React, { useEffect } from 'react';
import './App.css';
import { useBoardStore, useLoginUserStore } from 'stores';
import { useCookies } from 'react-cookie';
import { Route, Routes } from 'react-router-dom';
import { AUTH_PATH, BOARD_CRAWLING_DETAIL_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import Update from 'views/Board/Update';
import Detail from 'views/Board/Detail';
import Write from 'views/Board/Write';
import Search from 'views/Search';
import Authentication from 'views/Authentication';
import Main from 'views/Main';
import Container from 'layouts/Container';
import UserPage from 'views/User';
import { ResponseDto } from 'apis/response';
import { User } from 'types/interface';
import { getSignInUserRequest } from 'apis';
import { GetSignInUserResponseDto } from 'apis/response/user';
import CrawlingDetail from 'views/Board/CrawlingDetail';

//            component: Application 컴포넌트                    //
function App() {
  //                    state: 로그인 유저 전역 상태                //
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();

  //                    state: cookie 상태                //
  const [cookies, setCookie] = useCookies();

  //                   function: get sign in user response 처리 함수    //
  const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if (code === "AF" || code === "NEU" || code === "DBE") {
      resetLoginUser();
      return;
    }
    const loginUser: User = { ...responseBody as GetSignInUserResponseDto};
    setLoginUser(loginUser);
  };

  useEffect(() => {
    if (!cookies.accessToken) {
      resetLoginUser();
      return;
    }
    getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
  }, [cookies.accessToken]);

  return (
    <Routes>
      <Route element={<Container />}>
        <Route path={MAIN_PATH()} element={<Main />} />
        <Route path={AUTH_PATH()} element={<Authentication />} />
        <Route path={SEARCH_PATH(":searchWord")} element={<Search />} />
        <Route path={USER_PATH(":userEmail")} element={<UserPage />}>
          <Route path="change-password" element={<UserPage />} />
          <Route path="change-nickname" element={<UserPage />} />
        </Route>
        <Route path={BOARD_PATH(":categoryId")} element={<Main />}>
          <Route path={BOARD_WRITE_PATH()} element={<Write />} />
          <Route
            path={BOARD_UPDATE_PATH(":boardNumber")}
            element={<Update />}
          />
          <Route
            path={BOARD_DETAIL_PATH(":boardNumber")}
            element={<Detail />}
          />
          <Route
            path={BOARD_CRAWLING_DETAIL_PATH(":boardNumber")}
            element={<CrawlingDetail />}
          />
        </Route>
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Route>
    </Routes>
  ); 
}

export default App;
