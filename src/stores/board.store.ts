import { CategoryList } from "types/interface";
import { create } from "zustand";

const defaultCategory: CategoryList = {
    category_id: 0,
    name: "Default Category",
    sortStatus: null,
    searchCount: null,
    pagingStartOffset: null
};

interface BoardStore {
    title: string;
    content: string;
    boardImageFileList: File[];
    category: CategoryList;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setBoardImageFileList: (boardImageFileList: File[]) => void;
    setCategory: (category: CategoryList) => void;
    resetBoard: () => void;
    resetCategory: () => void;
};

const useBoardStore = create<BoardStore>(set => ({
    title: "",
    content: "",
    boardImageFileList: [],
    category: defaultCategory,
    setTitle: (title) => set(state => ({...state, title})),
    setContent: (content) => set(state => ({...state, content})),
    setBoardImageFileList: (boardImageFileList) => set(state => ({...state, boardImageFileList})),
    setCategory: (category: CategoryList) => set(state => ({...state, category})),
    resetBoard: () => set(state => ({...state, title: "", content: "", boardImageFileList: [], category: defaultCategory})),
    resetCategory: () => set(state => ({...state, category: defaultCategory}))
}));

export default useBoardStore;