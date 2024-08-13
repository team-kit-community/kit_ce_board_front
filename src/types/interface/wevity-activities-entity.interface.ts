import CombineCrawlingListItem from "./combine-crawling-list-item.interface";

export default interface WevityActivity{
    id: number,
    title: string,
    date: string,
    url: string,
    detailData: string,
    field: string,
    image: string,
};