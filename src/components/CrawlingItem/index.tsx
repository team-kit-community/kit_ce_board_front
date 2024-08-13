import { AUTH_PATH, BOARD_CRAWLING_DETAIL_PATH, BOARD_DETAIL_PATH, BOARD_PATH, MAIN_PATH } from "constant";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLoginUserStore } from "stores";
import { CombineCrawlingListItem } from "types/interface";
import './style.css';

interface Props {
  CrawlingListItem: CombineCrawlingListItem;
  categoryName: string;
}

export default function CrawlingItem({ CrawlingListItem, categoryName }: Props) {
  const { pathname } = useLocation();
  const {id, title, date, url, detailData} = CrawlingListItem;
  const {image, host, views, comments, field, status, type} = CrawlingListItem;
  const { loginUser } = useLoginUserStore();
  const [cookie] = useCookies();
  const savedCategory = localStorage.getItem("selectedCategory");
  const category_id = savedCategory ? JSON.parse(savedCategory).category_id : 0;

  //               state: more 버튼 상태                    //
  const [showMore, setShowMore] = useState<boolean>(false);

  const isSearchPage = pathname.startsWith("/search");
  const isMainPage = pathname === MAIN_PATH();
  const isUserPage = pathname.startsWith("/user");

  //                       function: 네비게이트 함수                         //
  const navigator = useNavigate();

  //                 event handler: 게시물 아이템 클릭 이벤트 처리 함수                          //
  const onClickBoardItemHandler = () => {
    if (!loginUser) {
      alert("로그인이 필요합니다.");
      navigator(AUTH_PATH());
      return;
    }
    navigator(`${BOARD_PATH(Number(category_id))}/${BOARD_CRAWLING_DETAIL_PATH(id)}?type=${type}`);
  };

  //  render: Board List Item 컴포넌트 렌더링 //
  return (
    <div
      className={`board-list-item ${
        isSearchPage || isUserPage ? "has-category" : ""
      }`}
      onClick={onClickBoardItemHandler}
    >
      <div className="board-list-item-main-box">
        {(isSearchPage || isUserPage) && (
          <div className="board-list-item-category">{categoryName}</div>
        )}
        <div className="board-list-item-top-wrapper">
          <div className="board-list-item-top">
            <div className="board-list-item-write-box">
              <div className="board-list-item-title">{title}</div>
              <div className="board-list-item-nickname">{host}</div>
              <div className="board-list-item-write-datetime">{date}</div>
              <div className="board-list-item-status">{status}</div>
              <div className="board-list-item-field">{field}</div>
            </div>
          </div>
        </div>
        <div className="board-list-item-middle">
          <div className="board-list-item-content">{detailData}</div>
        </div>
        {(comments && views) && (
          <div className="board-list-item-bottom">
            <div className="board-list-item-counts">
              {`댓글 ${comments} | 조회수 ${views}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}