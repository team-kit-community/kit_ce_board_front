import BoardListItem from "./board-list-item.interface";

export default interface CategoryOfBoardList {
    categoryName: string;
    boardListEntities: BoardListItem[];
};

