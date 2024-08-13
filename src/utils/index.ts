// 파일 비동기 처리 작성 파일
export const convertUrlToFile = async(url: string) => {
    if (!url) {
        return null;
    }
    const response = await fetch(url);
    const data = await response.blob();
    const extend = url.split('.').pop();
    const fileName = url.split('/').pop();
    const metadata = { type: `image/${extend}`};
    return new File([data], fileName as string, metadata);
}

export const convertUrlsToFile = async (urls: (string | null | undefined)[]) => {
    const files: (File | null)[] = [];
    for(const url of urls) {
        if(url) {
            const file = await convertUrlToFile(url);
            if (file) {
                files.push(file);
            }
        }
    }
    return files;
}