import { AUTH_PATH } from "constant";
import Footer from "layouts/Footer";
import Header from "layouts/Header";
import { Outlet, useLocation } from "react-router-dom"; 

//                component: 컨테이너 화면 컴포넌트                     //
export default function Container() {
  //                   state: 현재 페이지 path name 상태                 //
  const { pathname } = useLocation();

  //               render: 컨테이너 화면 컴포넌트의 렌더링 함수               //
  return (
    <>
      <Header />
      <Outlet />
      {pathname !== AUTH_PATH() && <Footer />}
    </>
  );
}
