import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./style.css";
import { useLoginUserStore } from "stores";
import { useCookies } from "react-cookie";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { usePagination } from "hooks";
import { BoardListItem } from "types/interface";
import Pagination from "components/Pagination";
import BoardItem from "components/BoardItem";
import defaultProfileImage from "assets/image/default-profile-image.png";
import { MAIN_PATH, USER_PATH } from "constant";
import { ResponseDto } from "apis/response";
import { GetUserBoardListResponseDto } from "apis/response/board";
import { getUserBoardListRequest, nicknameChangeRequest, patchPasswordRequest } from "apis";
import InputBox from "components/InputBox";
import { NicknameChangeResponseDto, PatchPasswordResponseDto } from "apis/response/user";
import { NicknameChangeRequestDto, PatchPasswordRequestDto } from "apis/request/user";

export default function UserPage() {
  //                            state: 유저 path variable 상태                            //
  const { userId } = useParams();

  //                          state: 로그인 유저 상태                            //
  const { loginUser } = useLoginUserStore();

  //                           state: 쿠키 상태                         //
  const [cookie, setCookie] = useCookies();

  const { pathname } = useLocation();

  //                            state: 마이페이지 여부 상태                  //
  const isMyPage = loginUser?.userId ? pathname === USER_PATH(loginUser?.userId) : false;

  const isPasswordChangePage = loginUser?.userId
    ? pathname === USER_PATH(loginUser?.userId) + "/change-password"
    : false;
  const isNicknameChangePage = loginUser?.userId
    ? pathname === USER_PATH(loginUser?.userId) + "/change-nickname"
    : false;

  //                           function: 네비게이트 함수                        //
  const navigator = useNavigate();

  //                              component: 유저 정보 컴포넌트                             //
  const UserInfo = () => {
    //                        state: 이미지 파일 인풋 참조 상태                  //
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    //                   state: 닉네임 변경 여부 상태                   //
    const [isNicknameChange, setNicknameChange] = useState<boolean>(false);

    //                   state: 닉네임 상태                   //
    const [nickname, setNickname] = useState<string>("");

    //                    state: 변경 닉네임 상태                 //
    const [changeNickname, setChangeNickname] = useState<string>("");

    //                   state: 프로필 이미지 상태                   //
    const [profileImage, setProfileImage] = useState<string | null>(null);

    //                      event handler: 비밀번호 변경 버튼 클릭 시 실행될 함수                     //
    const onClickPasswordChangeHandler = () => {
      navigator(`/user/${loginUser?.userId}/change-password`);
    };

    //                      event handler: 닉네임 변경 버튼 클릭 시 실행될 함수                     //
    const onClickNicknameChangeHandler = () => {
      navigator(`/user/${loginUser?.userId}/change-nickname`);
    };

    const onClickLogoutHandler = () => {
      setCookie("accessToken", "");
      navigator(MAIN_PATH());
    };

    return (
      <div className="user-info-container">
        <div className="user-info-top-box">
          <div className="user-info-top-box-left">{"내 정보"}</div>
          <div className="user-info-top-box-right-logout-button" onClick={onClickLogoutHandler}>
            {"로그아웃"}
          </div>
        </div>
        <div className="user-info-detail-box">
          <div
            className="user-info-detail-box-user-image"
            style={{
              backgroundImage: `url(${
                !loginUser?.profileImage
                  ? loginUser?.profileImage
                  : defaultProfileImage
              })`,
            }}
          ></div>
          <div className="user-info-detail-box-userinfo">
            <div
              className="user-info-detail-box-userinfo-nickname"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              닉네임: {loginUser?.nickName}
            </div>
            <div
              className="user-info-detail-box-userinfo-userId"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              유저 아이디: {loginUser?.userId}
            </div>
          </div>
        </div>
        <div className="user-info-change-box">
          <div
            className="user-info-change-box-password-button"
            onClick={onClickPasswordChangeHandler}
          >
            {"비밀번호 변경"}
          </div>
          <div
            className="user-info-change-box-nickname-button"
            onClick={onClickNicknameChangeHandler}
          >
            {"닉네임 변경"}
          </div>
        </div>
      </div>
    );
  };

  //                           component: 유저 게시물 컴포넌트                          //
  const UserBoard = () => {
    //                   state: 게시물 개수 상태                  //
    const [count, setCount] = useState<number>(2);

    //               state: Pagination 상태 관리                 //
    const {
      currentPage,
      setCurrentPage,
      currentSection,
      setCurrentSection,
      viewList,
      viewPageList,
      totalSection,
      setTotalList,
    } = usePagination<BoardListItem>(10);

    const getUserBoardListResponse = (responseBody: GetUserBoardListResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if (code === "NEU") {
          alert("사용자가 존재하지 않습니다.");
          navigator(MAIN_PATH());
          return;
        };
        if (code === "DBE") alert("데이터베이스 오류입니다.");
        if (code !== "SU") return;
        const { boardListEntities } =
          responseBody as GetUserBoardListResponseDto;
        if (!boardListEntities) return;
        setTotalList(boardListEntities);
        setCount(boardListEntities.length);
    }

    //                             effect: 유저 아이디가 변경될 시 실행될 함수                //
    useEffect(() => {
        if(!loginUser?.userId) return;
        getUserBoardListRequest(loginUser?.userId).then(getUserBoardListResponse);
    }, [loginUser?.userId]);

    return (
      <div className="user-board-wrapper">
        <div className="user-board-container">
          <div className="user-board-title">
            {isMyPage ? "내 게시물" : "게시물"}
          </div>
          <span className="emphasis">{count}</span>
          <div className="user-board-contents-box">
            {count === 0 ? (
              <div className="user-board-contents-nothing">
                {"작성한 게시물이 없어요!"}
              </div>
            ) : (
              <div className="user-board-content-box">
                {viewList.map((boardListItem) => (
                  <BoardItem boardListItem={boardListItem} />
                ))}
              </div>
            )}
          </div>
          <div className="user-board-pagination-box">
            {count !== 0 && (
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
                totalSection={totalSection}
                viewPageList={viewPageList}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  //                           component: 유저 닉네임 변환 컴포넌트                          //
  const UserNicknameChange = () => {
    //                      state: 닉네임 상태                        //
    const [nickname, setNickname] = useState<string>("");              

    //                          function: 닉네임 변경 응답 함수                      //
    const nicknameChangeResponse = (responseBody: NicknameChangeResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === "NEU") alert("사용자가 존재하지 않습니다.");
      if (code === "DN") alert("닉네임이 이미 존재합니다.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") return;

      if (!loginUser) return;
      navigator(USER_PATH(loginUser?.userId));
      window.location.reload();
    };

    //                        event handler: 닉네임 변경 이벤트 함수                   //
    const onClickNicknameChangeHandler = () => {
      console.log("클릭");
      const accessToken = cookie.accessToken;
      if (!accessToken) return;
      if(nickname.length < 3 || nickname.length > 10) {
        alert("닉네임은 3~10자로 설정해주세요.");
        return;
      }
      const nicknameChangeRequestDto: NicknameChangeRequestDto = {
        newNickname: nickname,
      };

      nicknameChangeRequest(nicknameChangeRequestDto, accessToken).then(nicknameChangeResponse);
    };

    //                          event handler: 닉네임 입력창 변경 이벤트 함수                      //
    const onChangeNicknameHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setNickname(value);
    };

    if(!loginUser) return (<div></div>);
    
    return (
      <div className="user-nickname-change-container">
        <div className="user-nickname-change-title">{"닉네임 설정"}</div>
        <div className="user-nickname-change-input-box">
          <InputBox
            label="닉네임"
            type="text"
            value={nickname}
            placeholder={loginUser?.nickName}
            onChange={onChangeNicknameHandler}
            error={nickname.length < 3 || nickname.length > 10}
          />
        </div>
        <div
          className="user-nickname-change-button-box"
          onClick={onClickNicknameChangeHandler}
        >
          {"닉네임 설정"}
        </div>
      </div>
    );
  };

  //                         component: 유저 비밀번호 변경 컴포넌트                          //
  const UserPasswordChange = () => {
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>("");
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
    const [passwordCheckError, setPasswordCheckError] = useState<boolean>(false);
    const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>("");

    const onChangeCurrentPasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setCurrentPassword(value);
    };

    const onChangeNewPasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setNewPassword(value);
    };

    const onChangeNewPasswordConfirmHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setNewPasswordConfirm(value);
    };

    const patchPasswordResponse = (responseBody: PatchPasswordResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const { code } = responseBody;
      if(code === "NEU") alert("사용자가 존재하지 않습니다.");
      if(code === "NEP") alert("현재 비밀번호가 일치하지 않습니다.");
      if(code === "DBE") alert("데이터베이스 오류입니다.");
      if(code !== "SU") return;

      if (!loginUser) return;
      navigator(USER_PATH(loginUser?.userId));
    };

    const onClickPasswordChangeHandler = () => {
      const accessToken = cookie.accessToken;
      if (!accessToken) return;
      const PasswordPattern =
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[#@$!%\\?&])[A-Za-z0-9#@$!%\\?&]{8,13}$/;
      const isPasswordPattern = PasswordPattern.test(newPassword);
      if (!isPasswordPattern) {
        setPasswordError(true);
        setPasswordErrorMessage("비밀번호는 영문자, 숫자, 특수문자 포함이어야 합니다.");
        return;
      }
      const isCheckPassword = newPassword.trim().length >= 8;
      if (!isCheckPassword) {
        setPasswordError(true);
        setPasswordErrorMessage("비밀번호는 8자 이상이어야 합니다.");
        return;
      }

      const isEqualPassword = newPassword === newPasswordConfirm;
      if (!isEqualPassword) {
        setPasswordCheckError(true);
        setPasswordCheckErrorMessage("비밀번호가 일치하지 않습니다.");
        return;
      }

      const patchPasswordRequestDto: PatchPasswordRequestDto = {
        oldPassword: currentPassword,
        newPassword: newPassword,
      };

      if ( !isCheckPassword || !isEqualPassword) return;
      patchPasswordRequest(patchPasswordRequestDto, accessToken).then(patchPasswordResponse);
    };

    return (
      <div className="user-password-change-container">
        <div className="user-password-change-title">{"비밀번호 변경"}</div>
        <div className="user-password-change-input-box">
          <InputBox
            label="현재 비밀번호"
            type="password"
            placeholder="8~13 영문, 숫자, 특수문자"
            value={currentPassword}
            onChange={onChangeCurrentPasswordHandler}
            error={passwordError}
            message={passwordErrorMessage}
          />
          <InputBox
            label="새 비밀번호"
            type="password"
            placeholder="8~13 영문, 숫자, 특수문자"
            value={newPassword}
            onChange={onChangeNewPasswordHandler}
            error={passwordError}
            message={passwordErrorMessage}
          />
          <InputBox
            label="새 비밀번호 확인"
            type="password"
            placeholder="8~13 영문, 숫자, 특수문자"
            value={newPasswordConfirm}
            onChange={onChangeNewPasswordConfirmHandler}
            error={passwordCheckError}
            message={passwordCheckErrorMessage}
          />
        </div>
        <div
          className="user-password-change-button-box"
          onClick={onClickPasswordChangeHandler}
        >
          {"비밀번호 변경"}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!loginUser) return;
    if (!loginUser.userId) navigator(MAIN_PATH());
  }, [loginUser, userId]);

  return (
    <div className="user-page-wrapper">
      {isPasswordChangePage ? (
        <div className="user-page-password-change">
          <UserPasswordChange />
        </div>
      ) : isNicknameChangePage ? (
        <div className="user-page-nickname-change">
          <UserNicknameChange />
        </div>
      ) : (
        <div className="user-page-container">
          <div className="user-page-user-info">
            <UserInfo />
          </div>
          <div className="user-page-user-user-board">
            <UserBoard />
          </div>
        </div>
      )}
    </div>
  );
}