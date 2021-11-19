const axios = require('axios');

export async function getImageUrlsFromImgurUrl(url: string): Promise<string[]> {
    var id = getIdFromUrl(url)

    var URL = `https://api.imgur.com/post/v1/albums/${id}?client_id=546c25a59c58ad7&include=media%2Cadconfig%2Caccount`

    console.log(URL)

    var response = await axios.post('https://ahmadhaulianyoga.herokuapp.com/get', {
        url: URL
    })
    var medias = response.data.media

    var ret = []
    for (var i = 0; i < medias.length; i++) {
        ret.push(medias[i].url)
    }

    return ret
}

function getIdFromUrl(url: string): string {
    var splitted_url = url.split("/")
    console.log(url)
    console.log(splitted_url)
    var ret = splitted_url.length - 1
    while (splitted_url[ret].length == 0)
        ret -= 1
    return splitted_url[ret]
}