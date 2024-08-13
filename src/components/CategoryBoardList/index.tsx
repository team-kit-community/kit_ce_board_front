import "./style.css";
import BoardItem from "components/BoardItem";
import CategoryOfBoardList from "types/interface/category-of-board-list.interface";

export default function CategoryBoardList({ categoryName, boardListEntities }: CategoryOfBoardList) {
    return (
      <div className="main-top-item-box">
        <div className="main-top-category-box">
          <div className="main-top-category-title">{categoryName}</div>
        </div>
        <div className="main-top-board-item">
          {boardListEntities.map((boardListItem) => (
            <BoardItem key={boardListItem.category_id} boardListItem={boardListItem} />
          ))}
        </div>
      </div>
    );
}