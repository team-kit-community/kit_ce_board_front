export default interface CombineCrawlingListItem {
    id: number;
    title: string;
    date: string;
    url: string;
    detailData: string;
    image?: string; // 선택적 속성으로 지정
    host?: string; // 선택적 속성으로 지정
    views?: number; // 선택적 속성으로 지정
    comments?: number; // 선택적 속성으로 지정
    field?: string; // 선택적 속성으로 지정
    status?: string; // 선택적 속성으로 지정
    type: 'linkCareerActivity' | 'linkCareerContest' | 'wevityActivity' | 'wevityContest';
}