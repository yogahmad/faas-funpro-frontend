const axios = require('axios');

export async function getImageUrlsFromImgurUrl(url: string): Promise<string[]> {

    var response = await axios.post('http://evening-sea-72051.herokuapp.com/imgur/get-images-url', {
        url: url
    })
    return response.data
}
