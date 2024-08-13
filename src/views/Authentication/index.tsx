import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import "./style.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import InputBox from "components/InputBox";
import { SignInResponseDto, SignUpEmailCertificationResponseDto, SignUpResponseDto, UserIdCheckResponseDto } from "apis/response/auth";
import { ResponseDto } from "apis/response";
import { MAIN_PATH } from "constant";
import { SignInRequestDto, SignUpEmailCertificationRequestDto, SignUpRequestDto, UserIdCheckRequestDto } from "apis/request/auth";
import { signInRequest, signUpEmailCertificationRequest, signUpRequest, userIdCheckRequest } from "apis";

//                component: 인증 화면 컴포넌트                     //
export default function Authentication() {
  //               state: 화면 상태                        //
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");

  //                state: 쿠키 상태                       //
  const [cookie, setCookie] = useCookies();

  //                function: 화면 이동 함수                    //
  const navigator = useNavigate();

  //               component: sign in card 컴포넌트                //
  const SignInCard = () => {
    //                       state: 이메일 요소 참조 상태                    //
    const userIdRef = useRef<HTMLInputElement | null>(null);

    //                       state: 패스워드 요소 참조 상태                    //
    const passwordRef = useRef<HTMLInputElement | null>(null);

    //                        state: 이메일 상태                    //
    const [userId, setUserId] = useState<string>("");

    //                       state: 패스워드 상태                  //
    const [password, setPassword] = useState<string>("");

    //                       state: 패스워드 타입 상태                //
    const [passwordType, setPasswordType] = useState<"password" | "text">(
      "password"
    );

    //                      state: 에러 상태                     //
    const [error, setError] = useState<boolean>(false);

    //                     state: 패스워드 버튼 아이콘 상태             //
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<
      "eye-light-off-icon" | "eye-light-on-icon"
    >("eye-light-off-icon");

    //                    function: sign in response 처리 함수             //
    const signInResponse = ( responseBody: SignInResponseDto | ResponseDto | null) => {
      if (!responseBody) {
        alert("네트워크 이상입니다.");
        return;
      }
      const { code } = responseBody;
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code === "VF" || code === "SF") setError(true);
      if (code !== "SU") return;

      const { token, expirationTime } = responseBody as SignInResponseDto;
      const now = new Date().getTime();
      const expires = new Date(now + expirationTime * 1000);

      setCookie("accessToken", token, { expires, path: MAIN_PATH() });
      navigator(MAIN_PATH());
    };

    //               event handler: 이메일 변경 이벤트 처리            //
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setUserId(value);
    };

    //               event handler: 비밀번호 변경 이벤트 처리            //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setPassword(value);
    };

    //               event handler: 로그인 버튼 클릭 이벤트 처리            //
    const onSignInButtonClickHandler = () => {
      const requestBody: SignInRequestDto = { userId, password };
      signInRequest(requestBody).then(signInResponse);
      console.log(requestBody);
    };

    //               event handler: 회원가입 링크 버튼 클릭 이벤트 처리            //
    const onSignUpLinkClickHandler = () => {
      setView("sign-up");
    };

    //               event handler: 패스워드 버튼 클릭 이벤트 처리            //
    const onPasswordButtonClickHandler = () => {
      if (passwordType === "text") {
        setPasswordType("password");
        setPasswordButtonIcon("eye-light-off-icon");
      } else {
        setPasswordType("text");
        setPasswordButtonIcon("eye-light-on-icon");
      }
    };

    //               event handler: 이메일 인풋 키 다운 이벤트 처리            //
    const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") return;
      if (passwordRef.current === null) return;
      passwordRef.current.focus();
    };

    //               event handler: 이메일 인풋 키 다운 이벤트 처리            //
    const onPasswordKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== "Enter") return;
      onSignInButtonClickHandler();
    };

    return (
      <div className="auth-card">
        <div className="auth-card-box">
          <div className="auth-card-top">
            <div className="auth-card-title-box">
              <div className="auth-card-title">{"로그인"}</div>
            </div>
            <InputBox
              ref={userIdRef}
              label="아이디"
              type="text"
              placeholder="아이디를 입력해주세요."
              error={error}
              value={userId}
              onChange={onEmailChangeHandler}
              onKeyDown={onEmailKeyDownHandler}
            />
            <InputBox
              ref={passwordRef}
              label="패스워드"
              type={passwordType}
              placeholder="비밀번호를 입력해주세요."
              error={error}
              value={password}
              onChange={onPasswordChangeHandler}
              icon={passwordButtonIcon}
              onButtonClick={onPasswordButtonClickHandler}
              onKeyDown={onPasswordKeyDownHandler}
            />
          </div>
          <div className="auth-card-bottom">
            {error && (
              <div className="auth-sign-in-error-box">
                <div className="auth-sign-in-error-message">
                  {
                    "아이디 또는 비밀번호를 잘못 입력했습니다. \n입력하신 내용을 다시 확인해주세요."
                  }
                </div>
              </div>
            )}
            <div
              className="black-large-full-button"
              onClick={onSignInButtonClickHandler}
            >
              {"로그인"}
            </div>
            <div className="auth-description-box">
              <div className="auth-description">
                {"신규 사용자이신가요?"}
                <span
                  className="auth-description-link"
                  onClick={onSignUpLinkClickHandler}
                >
                  {"회원가입"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  //               component: sign up card 컴포넌트                //
  const SignUpCard = () => {
    //                 state: 유저 아이디 요소 참조 상태                //
    const userIdRef = useRef<HTMLInputElement | null>(null);

    //                 state: 비밀번호 요소 참조 상태                //
    const passwordRef = useRef<HTMLInputElement | null>(null);

    //                 state: 비밀번호 확인 요소 참조 상태                //
    const passwordCheckRef = useRef<HTMLInputElement | null>(null);

    //                 state: 닉네임 요소 참조 상태                //
    const nicknameRef = useRef<HTMLInputElement | null>(null);

    //                 state: 이메일 요소 참조 상태                //
    const emailRef = useRef<HTMLInputElement | null>(null);

    //                  state: 인증 번호 요소 참조 상태                //
    const certificationNumberRef = useRef<HTMLInputElement | null>(null);

    //                 state: 페이지 번호 상태                //
    const [page, setPage] = useState<1 | 2>(1);

    //                   state: 유저 아이디 상태              //
    const [userId, setUserId] = useState<string>("");

    //                 state: 이메일 상태                //
    const [email, setEmail] = useState<string>("");

    //                 state: 패스워드 상태                //
    const [password, setPassword] = useState<string>("");

    //                 state: 패스워드 확인 상태                //
    const [passwordCheck, setPasswordCheck] = useState<string>("");

    //                 state: 닉네임 상태                //
    const [nickName, setNickname] = useState<string>("");

    //                state: 이메일 인증 번호 상태             //
    const [certificationNumber, setCertificationNumber] = useState<string>("");

    //                 state: 패스워드 타입 상태                //
    const [passwordType, setPasswordType] = useState<"text" | "password">(
      "password"
    );

    //                 state: 패스워드 타입 확인 상태                //
    const [passwordCheckType, setPasswordCheckType] = useState<
      "text" | "password"
    >("password");

    //                 state: 유저 아이디 상태                      //
    const [isUserIdError, setUserIdError] = useState<boolean>(false);

    //                state: 이메일 에러 상태                        //
    const [isEmailError, setEmailError] = useState<boolean>(false);

    //                state: 패스워드 에러 상태                        //
    const [isPasswordError, setPasswordError] = useState<boolean>(false);

    //                state: 패스워드 확인 에러 상태                        //
    const [isPasswordCheckError, setPasswordCheckError] =
      useState<boolean>(false);

    //                state: 닉네임 에러 상태                        //
    const [isNicknameError, setNicknameError] = useState<boolean>(false);

    //                 state: 이메일 인증 번호 에러 상태               //
    const [isCertificationNumberError, setCertificationNumberError] =
      useState<boolean>(false);

    //                 state: 유저 아이디 에러 메시지 상태                      //
    const [isUserIdErrorMessage, setUserIdErrorMessage] = useState<string>("");

    //                state: 이메일 에러 메시지 상태                        //
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");

    //                state: 패스워드 에러 메시지 상태                        //
    const [passwordErrorMessage, setPasswordErrorMessage] =
      useState<string>("");

    //                state: 패스워드 확인 에러 메시지 상태                        //
    const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] =
      useState<string>("");

    //                state: 닉네임 에러 메시지 상태                        //
    const [nicknameErrorMessage, setNicknameErrorMessage] =
      useState<string>("");

    //                 state: 이메일 인증 에러 메시지 상태             //
    const [
      certificationNumberErrorMessage,
      setCertificationNumberErrorMessage,
    ] = useState<string>("");

    //                 state: 패스워드 버튼 아이콘 상태                //
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<
      "eye-light-off-icon" | "eye-light-on-icon"
    >("eye-light-off-icon");

    //                 state: 패스워드 확인 버튼 아이콘 상태                //
    const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<
      "eye-light-off-icon" | "eye-light-on-icon"
    >("eye-light-off-icon");

    //                 function: 회원가입 응답 처리 함수              //
    const signUpResponse = (
      responseBody: SignUpResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) {
        alert("네트워크 이상입니다.");
        return;
      }
      const { code } = responseBody;
      console.log(code);
      if (code === "DI") {
        setEmailError(true);
        setEmailErrorMessage("중복되는 아이디 입니다.");
        return;
      }
      if (code === "CF") {
        setCertificationNumberError(true);
        setCertificationNumberErrorMessage("인증 번호가 일치하지 않습니다.");
        return;
      }
      if (code === "DN") {
        setNicknameError(true);
        setNicknameErrorMessage("중복되는 닉네임 입니다.");
      }
      if (code === "VF") {
        alert("입력한 정보를 다시 확인해 주세요.");
        return;
      }
      if (code === "DBE") {
        alert("데이터베이스 오류입니다.");
        return;
      }

      if (code !== "SU") return;
      setView("sign-in");
    };

    //                   event handler: 유저 아이디 변경 이벤트 처리             //
    const onUserIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setUserId(value);
      setUserIdError(false);
      setUserIdErrorMessage("");
    };

    //                   event handler: 이메일 변경 이벤트 처리             //
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setEmail(value);
      setEmailError(false);
      setEmailErrorMessage("");
    };

    //                   event handler: 패스워드 변경 이벤트 처리             //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setPassword(value);
      setPasswordError(false);
      setPasswordErrorMessage("");
    };

    //                   event handler: 패스워드 확인 변경 이벤트 처리             //
    const onPasswordCheckChangeHandler = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const { value } = event.target;
      setPasswordCheck(value);
      setPasswordCheckError(false);
      setPasswordCheckErrorMessage("");
    };

    //                     event handler: 닉네임 변경 이벤트 처리                 //
    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setNickname(value);
      setNicknameError(false);
      setNicknameErrorMessage("");
    };

    //                    event handler: 인증 번호 변경 이벤트 처리                   //
    const onCertificationNumberChangeHandler = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const { value } = event.target;
      setCertificationNumber(value);
      setCertificationNumberError(false);
      setCertificationNumberErrorMessage("");
    };

    //                   event handler: 패스워드 버튼 클릭 이벤트 처리             //
    const onPasswordButtonClickHandler = () => {
      if (passwordButtonIcon === "eye-light-off-icon") {
        setPasswordButtonIcon("eye-light-on-icon");
        setPasswordType("text");
      } else {
        setPasswordButtonIcon("eye-light-off-icon");
        setPasswordType("password");
      }
    };

    //                   event handler: 패스워드 확인 버튼 클릭 이벤트 처리             //
    const onPasswordCheckButtonClickHandler = () => {
      if (passwordCheckButtonIcon === "eye-light-off-icon") {
        setPasswordCheckButtonIcon("eye-light-on-icon");
        setPasswordCheckType("text");
      } else {
        setPasswordCheckButtonIcon("eye-light-off-icon");
        setPasswordCheckType("password");
      }
    };

    //                   event handler: 다음 버튼 클릭 이벤트 처리             //
    const onNextButtonClickHandler = () => {
      const isUserId = userId.trim().length > 0;
      if (!isUserId) {
        setNicknameError(true);
        setNicknameErrorMessage("사용자 아이디를 입력해 주세요.");
        return;
      }

      const PasswordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[#@$!%\\?&])[A-Za-z0-9#@$!%\\?&]{8,13}$/;
      const isPasswordPattern = PasswordPattern.test(password);
      if (!isPasswordPattern) {
        setPasswordError(true);
        setPasswordErrorMessage("비밀번호는 영문자, 숫자, 특수문자 포함이어야 합니다.");
        return;
      }
        const isCheckPassword = password.trim().length >= 8;
      if (!isCheckPassword) {
        setPasswordError(true);
        setPasswordErrorMessage("비밀번호는 8자 이상이어야 합니다.");
        return;
      }

      const isEqualPassword = password === passwordCheck;
      if (!isEqualPassword) {
        setPasswordCheckError(true);
        setPasswordCheckErrorMessage("비밀번호가 일치하지 않습니다.");
        return;
      }

      if (!isUserId || !isCheckPassword || !isEqualPassword) return;

      const requestBody: UserIdCheckRequestDto = {
        userId,
      };

      userIdCheckRequest(requestBody).then(userIdCheckResponse);
    };

    //                     event handler: 회원가입 버튼 클릭 이벤트 처리                 //
    const onSignUpButtonClickHandler = () => {
      const isCheckNickname = nickName.trim().length > 0;
      if (!isCheckNickname) {
        setNicknameError(true);
        setNicknameErrorMessage("닉네임을 입력해 주세요.");
      }

      const emailPattern = /^[a-zA-Z0-9]+@kumoh\.ac\.kr$/;
      const isEmailPattern = emailPattern.test(email);
      if (!isEmailPattern) {
        setEmailError(true);
        setEmailErrorMessage("이메일 주소 포멧이 맞지 않습니다.");
      }

      const isCertificationNumber = certificationNumber.trim().length > 0;
      if (!isCertificationNumber) {
        setCertificationNumberError(true);
        setCertificationNumberErrorMessage("이메일 인증 번호가 없습니다.");
      }

      if (!isEmailPattern || !isCertificationNumber || !isCheckNickname) return;

      const requestBody: SignUpRequestDto = {
        userId,
        password,
        nickName,
        email,
        certificationNumber,
        profileImage: null,
      };

      signUpRequest(requestBody).then(signUpResponse);
    };

    //                     event handler: 로그인 링크 클릭 이벤트 처리                 //
    const onSignInLinkClickHandler = () => {
      setView("sign-in");
    };

    //                     event handler: 유저 아이디 키 다운 이벤트 처리                 //
    const onUserIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") return;
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    };

    //                      function: 유저 아이디 중복 응답 처리 함수                 //
    const userIdCheckResponse = (
      responseBody: UserIdCheckResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) {
        alert("네트워크 이상입니다.");
        return;
      }
      const { code } = responseBody;
      console.log(code);
      if (code === "DI") {
        setUserIdError(true);
        setUserIdErrorMessage("중복되는 아이디 입니다.");
      }

      if (code !== "SU") return;
      setPage(2);
    };

    //                     event handler:  패스워드 키 다운 이벤트 처리                 //
    const onPasswordKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== "Enter") return;
      if (!passwordCheckRef.current) return;
      passwordCheckRef.current.focus();
    };

    //                     event handler: 패스워드 확인 키 다운 이벤트 처리                 //
    const onPasswordCheckKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== "Enter") return;
      onNextButtonClickHandler();
    };

    //                     event handler: 닉네임 키 다운 이벤트 처리                 //
    const onNicknameKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== "Enter") return;
      if (!emailRef.current) return;
      emailRef.current.focus();
    };

    //                     event handler: 이메일 키 다운 이벤트 처리                 //
    const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") return;
      if (!certificationNumberRef.current) return;
      certificationNumberRef.current.focus();
    };

    //                     event handler: 이메일 번호 키 다운 이벤트 처리                 //
    const onCertificationNumberKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== "Enter") return;
      onSignUpButtonClickHandler();
    };

    //                    event handler: 이메일 인증 번호 체크 버튼 클릭 이벤트 처리                 //
    const onEmailCertificationCheckHandler = () => {
      const emailPattern = /^[a-zA-Z0-9]+@kumoh\.ac\.kr$/;
      const isEmailPattern = emailPattern.test(email);
      if (!isEmailPattern) {
        setEmailError(true);
        setEmailErrorMessage("이메일 주소 포멧이 맞지 않습니다.");
      }

      if (!isEmailPattern) return;

      const requestBody: SignUpEmailCertificationRequestDto = {
        email
      };

      signUpEmailCertificationRequest(requestBody).then(
        signUpEmailCertificationResponse
      );
    };

    //                     function: 이메일 인증 응답 처리 함수                 //
    const signUpEmailCertificationResponse = (
      responseBody: SignUpEmailCertificationResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) {
        alert("네트워크 이상입니다.");
        return;
      }
      const { code } = responseBody;
      console.log(code);
      if (code === "DE") {
        setEmailError(true);
        setEmailErrorMessage("이미 회원으로 있는 이메일 주소입니다.");
      }
      if (code === "DBE") {
        alert("데이터베이스 오류입니다.");
      }
      if (code !== "SU") return;
      setEmailErrorMessage("인증 번호가 발송되었습니다.");
    };

    //                       effect: 페이지 변경 이펙트 처리                     //
    useEffect(() => {
      if (page === 2) {
        if (!nicknameRef.current) return;
        nicknameRef.current.focus();
      }
    }, [page]);

    //               render: sign up card 컴포넌트 렌더링 함수               //
    return (
      <div className="auth-card">
        <div className="auth-card-box">
          <div className="auth-card-top">
            <div className="auth-card-top-title-box">
              <div className="auth-card-title">{"회원가입"}</div>
              <div className="auth-card-page">{`${page}/2`}</div>
            </div>
            {page === 1 && (
              <>
                <InputBox
                  ref={userIdRef}
                  label="아이디*"
                  type="text"
                  placeholder="아이디를 입력해 주세요."
                  value={userId}
                  onChange={onUserIdChangeHandler}
                  error={isUserIdError}
                  message={isUserIdErrorMessage}
                  onKeyDown={onUserIdKeyDownHandler}
                />
                <InputBox
                  ref={passwordRef}
                  label="비밀번호*"
                  type={passwordType}
                  placeholder="비밀번호를 입력해주세요."
                  value={password}
                  onChange={onPasswordChangeHandler}
                  error={isPasswordError}
                  message={passwordErrorMessage}
                  icon={passwordButtonIcon}
                  onButtonClick={onPasswordButtonClickHandler}
                  onKeyDown={onPasswordKeyDownHandler}
                />
                <InputBox
                  ref={passwordCheckRef}
                  label="비밀번호 확인*"
                  type={passwordCheckType}
                  placeholder="비밀번호를 다시 입력해주세요."
                  value={passwordCheck}
                  onChange={onPasswordCheckChangeHandler}
                  error={isPasswordCheckError}
                  message={passwordCheckErrorMessage}
                  icon={passwordCheckButtonIcon}
                  onButtonClick={onPasswordCheckButtonClickHandler}
                  onKeyDown={onPasswordCheckKeyDownHandler}
                />
              </>
            )}
            {page === 2 && (
              <>
                <InputBox
                  ref={nicknameRef}
                  label="닉네임*"
                  type="text"
                  placeholder="닉네임을 입력해 주세요."
                  value={nickName}
                  onChange={onNicknameChangeHandler}
                  error={isNicknameError}
                  message={nicknameErrorMessage}
                  onKeyDown={onNicknameKeyDownHandler}
                />
                <div className="emailCertification-check">
                  <InputBox
                    ref={emailRef}
                    label="이메일 주소*"
                    type="text"
                    placeholder="이메일 주소를 입력해 주세요."
                    value={email}
                    onChange={onEmailChangeHandler}
                    error={isEmailError}
                    message={emailErrorMessage}
                    onKeyDown={onEmailKeyDownHandler}
                  />
                  <button
                    className="emailCertification-check-button"
                    onClick={onEmailCertificationCheckHandler}
                  >
                    {"인증번호 받기"}
                  </button>
                </div>
                <InputBox
                  ref={certificationNumberRef}
                  label="이메일 인증 번호*"
                  type="text"
                  placeholder="이메일 인증 번호를 입력해 주세요."
                  value={certificationNumber}
                  onChange={onCertificationNumberChangeHandler}
                  error={isCertificationNumberError}
                  message={certificationNumberErrorMessage}
                  onKeyDown={onCertificationNumberKeyDownHandler}
                />
              </>
            )}
          </div>
          <div className="auth-card-bottom">
            {page === 1 && (
              <div
                className="black-large-full-button"
                onClick={onNextButtonClickHandler}
              >
                {"다음 단계"}
              </div>
            )}
            {page === 2 && (
              <div
                className="black-large-full-button"
                onClick={onSignUpButtonClickHandler}
              >
                {"회원가입"}
              </div>
            )}
            <div className="auth-description-box">
              <div className="auth-description">
                {"이미 계정이 있으신가요?"}
                <span
                  className="auth-description-link"
                  onClick={onSignInLinkClickHandler}
                >
                  {"로그인"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  //               render: 인증 화면 컴포넌트의 렌더링 함수               //
  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-jumbotron-box">
          <div className="auth-jumbotron-contents">
            <div className="auth-logo-icon"></div>
            <div className="auth-jumbotron-text-box">
              <div className="auth-jumbotron-text">{"환영합니다."}</div>
              <div className="auth-jumbotron-text">{"KUMOH BOARD 입니다."}</div>
            </div>
          </div>
        </div>
        {view === "sign-in" && <SignInCard />}
        {view === "sign-up" && <SignUpCard />}
      </div>
    </div>
  );
}