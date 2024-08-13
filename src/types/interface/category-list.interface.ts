export default interface CategoryList {
    category_id: number;
    name: string;
    sortStatus: string | null;
    searchCount: number | null;
    pagingStartOffset: number | null;
};