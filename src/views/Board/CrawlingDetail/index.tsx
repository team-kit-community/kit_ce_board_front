import { useEffect, useRef, useState } from "react";
import "./style.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLoginUserStore } from "stores";
import { ResponseDto } from "apis/response";
import { GetBoardDetailResponseDto } from "apis/response/board";
import { CombineCrawlingListItem, CrawlingPostEntity } from "types/interface";
import dayjs from "dayjs";
import { AUTH_PATH } from "constant";
import { getCrawlingBoardDetailRequest } from "apis";
import GetCrawlingPostDetailResponseDto from "apis/response/board/get-crawling-post-response.dto";

export default function CrawlingDetail() {
  //                      state: 게시물 번호path variable 상태 관리             //
  const { categoryId } = useParams<{ categoryId: string }>();
  const { boardNumber } = useParams();

  //                   state: 로그인 user 상태 관리                       //
  const { loginUser } = useLoginUserStore();

  //                           function: 네비게이트 함수                  //
  const navigator = useNavigate();

  //                             component: 게시물 상세 화면 컴포넌트                     //
  const CrawlingPostDetail = () => {
    //               state: baord 버튼 상태                    //
    const [board, setBoard ] = useState<CrawlingPostEntity | null>(null);
    const location = useLocation();

    //                   function: 작성일 포멧 변경 처리 함수                   //
    const getWriteDatetime = () => {
      if (!board) return;
      const date = dayjs(board.date);
      return date.format("YYYY-MM-DD HH:mm:ss");
    };

    //                     function: get board response 처리 함수         //
    const getCrawlingBoardDetailResponse = (
      responseBody: GetCrawlingPostDetailResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === "NEB") alert("존재하지 않는 게시물이다.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") {
        // navigator(MAIN_PATH());
        return;
      }

        const { crawlingEntity } = responseBody as GetCrawlingPostDetailResponseDto;
        setBoard(crawlingEntity);

        if (!loginUser) {
            alert("로그인이 필요합니다.");
            navigator(AUTH_PATH());
            return;
        }
    };

    //                       Effect: 게시물 번호 path variable 상태가 변경될 때 board 상태 변경 effect   //
    const isInitialMount = useRef(true);

    useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const type = queryParams.get("type");
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      if (!loginUser) return;
      if (!categoryId || !boardNumber || !type) return;

      getCrawlingBoardDetailRequest(categoryId, boardNumber, type).then(getCrawlingBoardDetailResponse);
    }, [categoryId, boardNumber, loginUser]);

    if (!board) return null;
    return (
      <div className="board-detail-top">
        <div className="board-detail-header">
          <div className="board-detail-title">{board.title}</div>
          <div className="board-detail-top-sub-box">
            <div className="board-detail-write-info-box">
              <div className="board-detail-writer-nickname">
                <div className="icon anonymity-icon"></div>
                <div className="board-detail-writer-nickname-text">
                  {board.host}
                </div>
              </div>
              <div className="board-detail-write-datetime">
                <div className="icon clock-icon"></div>
                <div className="board-detail-write-datetime-text">
                  {getWriteDatetime()}
                </div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="board-detail-main">
            {board.image && (
              <img className="board-detail-main-image" src={board.image} />
            )}
            <div className="board-detail-main-text">{board.detailData}</div>
          </div>
        </div>
      </div>
    );
  };

  //                    effect: 게시물 번호 path variable이 바뀔때 마다 게시물 조회수 증가      //
  let effectFlag = true;
  useEffect(() => {
    if (!loginUser) return;
    if (!boardNumber) return;
    if (effectFlag) {
      effectFlag = false;
      return;
    }
  }, [categoryId, boardNumber, loginUser]);

  return (
    <div className="board-detail-wrapper">
      <div className="board-detail-container">
        <CrawlingPostDetail />
      </div>
    </div>
  );
}
