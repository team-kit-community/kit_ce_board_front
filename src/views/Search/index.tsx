import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import BoardItem from "components/BoardItem";
import Pagination from "components/Pagination";
import { useEffect } from "react";
import { usePagination } from "hooks";
import { BoardListItem } from "types/interface";
import { ResponseDto } from "apis/response";
import { useCookies } from "react-cookie";
import { GetSearchBoardListResponseDto } from "apis/response/search";
import { getSearchBoardListRequest } from "apis";
import { AUTH_PATH } from "constant";

export default function Search() {
  const { searchWord } = useParams();
  const navigate = useNavigate();

  //                           state: 페이지 네이션 관련 상태                   //
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

  const [cookie, setCookie] = useCookies();

  
  const getSearchBoardListResponse = (responseBody: GetSearchBoardListResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if(code === "NEU") alert("사용자가 존재하지 않습니다.");
    if(code === "DBE") alert("데이터베이스 오류입니다.");
    if(code !== "SU") return;

    const { boardListEntities } = responseBody as GetSearchBoardListResponseDto;
    setTotalList(boardListEntities);
  };

  useEffect(() => {
    if(!cookie.accessToken || !searchWord) {
        navigate(AUTH_PATH()); 
        alert("로그인이 필요합니다.");
        return;
    }
    getSearchBoardListRequest(searchWord, cookie.accessToken).then(getSearchBoardListResponse);
  }, [searchWord, cookie.accessToken]);

  return (
    <div className="search-board-wrapper">
      <div className="search-board-container">
        <div className="search-board-title-box">
          <div className="search-board-title">
            "{searchWord}" 에 대한 결과물
          </div>
        </div>
        <div
          className="search-board-content-box"
        >
          {viewList.map((boardListItem) => (
            <BoardItem boardListItem={boardListItem} />
          ))}
        </div>
      </div>
      <div className="main-category-pagination-box">
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          viewPageList={viewPageList}
          totalSection={totalSection}
        />
      </div>
    </div>
  );
}