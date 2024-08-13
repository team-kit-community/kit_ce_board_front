import { GetLatestBoardListResponseDto, GetLinkCareerActivitiesListResponseDto, GetLinkCareerContestListResponseDto, GetWevityActivitiesListResponseDto, GetWevityContestListResponseDto } from 'apis/response/board';
import './style.css';
import { ResponseDto } from 'apis/response';
import { useEffect, useState } from 'react';
import { getLatestBoardListRequest, getLinkCareerActivitiesListRequest, getLinkCareerContestListRequest, getWevityActivitiesListRequest, getWevityContestListRequest } from 'apis';
import BoardItem from 'components/BoardItem';
import { usePagination } from 'hooks';
import { BoardListItem, CombineCrawlingListItem, LinkCareerActivity, LinkCareerContest, WevityActivity, WevityContest } from 'types/interface';
import { useBoardStore, useLoginUserStore } from 'stores';
import { useNavigate, useParams } from 'react-router-dom';
import Pagination from 'components/Pagination';
import { BOARD_PATH, BOARD_WRITE_PATH } from 'constant';
import CrawlingItem from 'components/CrawlingItem';

export default function BoardMain() {
  const { categoryId } = useParams();
  const { category, setCategory } = useBoardStore();
  //                 state: 로그인 유저 상태                   //
  const { loginUser } = useLoginUserStore();

  //                       function: 네비게이트 함수                   //
  const navigator = useNavigate();

  const formatLinkCareerActivity = (activities: LinkCareerActivity): CombineCrawlingListItem => ({
    id: activities.id,
    title: activities.title,
    date: activities.date,
    url: activities.url,
    detailData: activities.detailData,
    image: activities.image,
    host: activities.host,
    views: activities.views,
    comments: activities.comments,
    type: 'linkCareerActivity',
  });

  const formatLinkCareerContest = (contests: LinkCareerContest): CombineCrawlingListItem => ({
    id: contests.id,
    title: contests.title,
    date: contests.date,
    url: contests.url,
    detailData: contests.detailData,
    image: contests.image,
    host: contests.host,
    views: contests.views,
    comments: contests.comments,
    type: 'linkCareerContest',
  });

  const formatWevityActivity = (activities: WevityActivity): CombineCrawlingListItem => ({
    id: activities.id,
    title: activities.title,
    date: activities.date,
    url: activities.url,
    detailData: activities.detailData,
    image: activities.image,
    field: activities.field,
    type: 'wevityActivity',
  });

  const formatWevityContest = (contests: WevityContest): CombineCrawlingListItem => ({
    id: contests.id,
    title: contests.title,
    date: contests.date,
    url: contests.url,
    detailData: contests.detailData,
    field: contests.field,
    host: contests.host,
    status: contests.status,
    views: contests.views,
    type: 'wevityContest',
  });

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

  const {
    currentPage: contestCurrentPage,
    setCurrentPage: contestSetCurrentPage,
    currentSection: contestCurrentSection,
    setCurrentSection: contestSetCurrentSection,
    viewList: contestViewList,
    viewPageList: contestViewPageList,
    totalSection: contestTotalSection,
    setTotalList: contestSetTotalList,
  } = usePagination<CombineCrawlingListItem>(10);

  const {
    currentPage: activityCurrentPage,
    setCurrentPage: activitySetCurrentPage,
    currentSection: activityCurrentSection,
    setCurrentSection: activitySetCurrentSection,
    viewList: activityViewList,
    viewPageList: activityViewPageList,
    totalSection: activityTotalSection,
    setTotalList: activitySetTotalList,
  } = usePagination<CombineCrawlingListItem>(10);

  const [contestCombinedList, setContestCombinedList] = useState<CombineCrawlingListItem[]>([]);
  const [activityCombinedList, setActivityCombinedList] = useState<CombineCrawlingListItem[]>([]);

  const getLatestBoardListResponse = (
    responseBody: GetLatestBoardListResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") return;

    const { boardListEntities } = responseBody as GetLatestBoardListResponseDto;
    setTotalList(boardListEntities);
  };

  const getWevityContestListResponse = (responseBody: GetWevityContestListResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") return;

    const { contests } = responseBody as GetWevityContestListResponseDto;
    const formattedContests = contests.map(formatWevityContest);
    setContestCombinedList((prevList) => {
      const newList = [...prevList, ...formattedContests];
      const uniqueList = Array.from(
        new Map(
          newList.map((item) => [`${item.type}-${item.id}`, item])
        ).values()
      );
      return uniqueList;
    });
  }

  const getWevityActivitiesListResponse = (responseBody: GetWevityActivitiesListResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") return;

    const { activities } = responseBody as GetWevityActivitiesListResponseDto;
    const formattedActivities = activities.map(formatWevityActivity);
    setActivityCombinedList((prevList) => {
      const newList = [...prevList, ...formattedActivities];
      const uniqueList = Array.from(
        new Map(
          newList.map((item) => [`${item.type}-${item.id}`, item])
        ).values()
      );
      return uniqueList;
    });
  }

  const getLinkCareerContestListResponse = (responseBody: GetLinkCareerContestListResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") return;

    const { contests } = responseBody as GetLinkCareerContestListResponseDto;
    const formattedContests = contests.map(formatLinkCareerContest);
    setContestCombinedList((prevList) => {
      const newList = [...prevList, ...formattedContests];
      const uniqueList = Array.from(
        new Map(
          newList.map((item) => [`${item.type}-${item.id}`, item])
        ).values()
      );
      return uniqueList;
    });
  }

  const getLinkCareerActivitiesListResponse = (responseBody: GetLinkCareerActivitiesListResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") return;

    const { activities } = responseBody as GetLinkCareerActivitiesListResponseDto;
    const formattedActivities = activities.map(formatLinkCareerActivity);
    setActivityCombinedList((prevList) => {
      const newList = [...prevList, ...formattedActivities];
      const uniqueList = Array.from(
        new Map(
          newList.map((item) => [`${item.type}-${item.id}`, item])
        ).values()
      );
      return uniqueList;
    });
  }

  //                       event handler: 사이드 카드 클릭 이벤트 헨들러                  //
  const onWriteBoardClickHandler = () => {
    if (loginUser) {
      navigator(BOARD_PATH(Number(categoryId)) + "/" + BOARD_WRITE_PATH());
    } else {
      alert("로그인이 필요합니다.");
      navigator("/auth");
    }
  };

  //                      effect: 첫 마운트 시 실행될 함수                     //
  useEffect(() => {
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory && JSON.parse(savedCategory).category_id <= 4) {
      setCategory(JSON.parse(savedCategory));
      getLatestBoardListRequest(JSON.parse(savedCategory).category_id).then(
        getLatestBoardListResponse
      );
    } else if(savedCategory && JSON.parse(savedCategory).category_id === 5){
      getWevityContestListRequest().then(getWevityContestListResponse);
      getLinkCareerContestListRequest().then(getLinkCareerContestListResponse);
    } else if (savedCategory && JSON.parse(savedCategory).category_id === 6) {
      getWevityActivitiesListRequest().then(getWevityActivitiesListResponse);
      getLinkCareerActivitiesListRequest().then(getLinkCareerActivitiesListResponse);
    } else if (categoryId) {
      setCategory({
        category_id: Number(categoryId),
        name: category.name,
        sortStatus: category.sortStatus,
        searchCount: category.searchCount,
        pagingStartOffset: category.pagingStartOffset,
      });
    }
  }, [categoryId, setCategory]);

  useEffect(() => {
    contestSetTotalList(contestCombinedList);
    activitySetTotalList(activityCombinedList);
  }, [contestCombinedList, activityCombinedList, contestSetTotalList, activitySetTotalList]);

  return (
    <div className="main-category-wrapper">
      <div className="main-category-container">
        <div className="main-category-titleWrapper">
          <div className="main-category-title-box">
            <div className="main-category-title">{category.name}</div>
          </div>
          {Number(categoryId) < 5 && (
            <div
              className="main-category-write-box"
              onClick={onWriteBoardClickHandler}
            >
              <div className="icon-box">
                <div className="icon edit-icon"></div>
              </div>
              <div className="main-category-write-name">{"글쓰기"}</div>
            </div>
          )}
        </div>
        {Number(categoryId) < 5 ? (
          <div className="main-category-contents-box">
            {viewList.map((boardListItem) => (
              <BoardItem boardListItem={boardListItem} />
            ))}
          </div>
        ) : (Number(categoryId) === 5 ? (
          <div className='main-category-contents-box'>
            {contestViewList.map((crawlingListItem) => (
              <CrawlingItem CrawlingListItem={crawlingListItem} categoryName={category.name} />
            ))}
          </div>
        ) : (Number(categoryId) === 6 && (
          <div className='main-category-contents-box'>
            {activityViewList.map((crawlingListItem) => (
              <CrawlingItem CrawlingListItem={crawlingListItem} categoryName={category.name} />
            ))}
          </div>
        )))}
        
      </div>
      {Number(categoryId) < 5 ? (
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
      ) : (Number(categoryId) === 5 ? (
        <div className='main-category-pagination-box'>
          <Pagination
            currentPage={contestCurrentPage}
            setCurrentPage={contestSetCurrentPage}
            currentSection={contestCurrentSection}
            setCurrentSection={contestSetCurrentSection}
            viewPageList={contestViewPageList}
            totalSection={contestTotalSection}
          />
        </div>
      ) : (Number(categoryId) === 6 && (
        <div className='main-category-pagination-box'>
          <Pagination
            currentPage={activityCurrentPage}
            setCurrentPage={activitySetCurrentPage}
            currentSection={activityCurrentSection}
            setCurrentSection={activitySetCurrentSection}
            viewPageList={activityViewPageList}
            totalSection={activityTotalSection}
          />
        </div>
      )))}
    </div>
  );
}