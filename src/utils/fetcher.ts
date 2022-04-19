export const fetcher = (url) =>
    fetch(url).then((res) => {
        if (res.status >= 300) {
            throw new Error('API Client error')
        }
        return res.json()
    })