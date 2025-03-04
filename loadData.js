export async function loadData() {
    let allData = [];
    let nextPageUrl = "https://catfact.ninja/breeds";

    while (nextPageUrl) {
        const response = await fetch(nextPageUrl);
        const jsonData = await response.json();
        allData = allData.concat(jsonData.data);
        nextPageUrl = jsonData.next_page_url;
    }

    return allData;
}
