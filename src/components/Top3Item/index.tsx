import { useNavigate } from "react-router-dom";
import { BoardListItem } from "types/interface";
import defaultProfileImage from "assets/image/default-profile-image.png";
import "./style.css";
import { BOARD_DETAIL_PATH, BOARD_PATH } from "constant";

interface Props {
    top3ListItem: BoardListItem;
}

export default function Top3Item({top3ListItem}: Props) {
  //                   properties                    //
  const { category_id, post_number, title, contents, titleImage } = top3ListItem;
  const { comment_count, favorite_count, view_count } = top3ListItem;
  const { writeNickname, writeDatetime, writeProfileImage } = top3ListItem;

  //                    function: 네비게이트 함수                     //
  const navigator = useNavigate();

  //         event handler: 게시물 아이템 클릭 이벤트 처리 함수         //
  const onClickHandler = () => {
    navigator(BOARD_PATH(category_id) + '/' + BOARD_DETAIL_PATH(post_number));
  };

  //         render: Top3List Item 컴포넌트 렌더링        //
  return (
    <div
      className="top-3-list-item"
      style={{ backgroundImage: `url(${titleImage})` }}
      onClick={onClickHandler}
    >
      <div className="top-3-list-item-main-box">
        <div className="top-3-list-item-top">
          <div className="top-3-list-item-profile-box">
            <div
              className="top-3-list-item-profile-image"
              style={{
                backgroundImage: `url(${
                  writeProfileImage ? writeProfileImage : defaultProfileImage
                })`,
              }}
            ></div>
          </div>
          <div className="top-3-list-item-write-box">
            <div className="top-3-list-item-nickname">{writeNickname}</div>
            <div className="top-3-list-item-write-date">{writeDatetime}</div>
          </div>
        </div>
        <div className="top-3-list-item-middle">
          <div className="top-3-list-item-title">{title}</div>
          <div className="top-3-list-item-content">{contents}</div>
        </div>
        <div className="top-3-list-item-bottom">
          <div className="top-3-list-item-counts">{`댓글 ${comment_count} · 좋아요 ${favorite_count} · 조회수 ${view_count}`}</div>
        </div>
      </div>
    </div>
  );
}

