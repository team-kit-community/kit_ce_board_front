import "./style.css";

//            component: Footer 컴포넌트              //
export default function Footer() {
  //          event handler: 인스타 아이콘 버튼 클릭 이벤트 처리              //
  const onInstaIconButtonClickHandler = () => {
    window.open("https://www.instagram.com/");
  };
  //          event handler: 인스타 아이콘 버튼 클릭 이벤트 처리              //
  const onNaverBlogIconButtonClickHandler = () => {
    window.open("https://blog.naver.com/");
  };

  //           render: Footer 렌더링            //
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo-box">
            <div className="icon-box">
              <div className="icon kumoh-signature-icon"></div>
            </div>
            <div className="footer-logo-text">{"Kumoh Board"}</div>
          </div>
          <div className="footer-link-box">
            <div className="footer-email-link">{"이메일"}</div>
            <div
              className="icon-button"
              onClick={onInstaIconButtonClickHandler}
            >
              <div className="icon insta-icon"></div>
            </div>
            <div className="icon-button">
              <div
                className="icon naver-blog-icon"
                onClick={onNaverBlogIconButtonClickHandler}
              ></div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copyright">
            {"Copyright @ 2024 kumoh Board. All Rights Reserved."}
          </div>
        </div>
      </div>
    </div>
  );
}