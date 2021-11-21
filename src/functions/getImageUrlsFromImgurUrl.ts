const axios = require('axios');

export async function getImageUrlsFromImgurUrl(url: string): Promise<string[]> {

    var response = await axios.post('http://localhost:9000/imgur/get-images-url', {
        url: url
    })
    console.log(response.data)
    return response.data
}
