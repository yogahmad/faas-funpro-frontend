const axios = require('axios');

export async function getImageUrlsFromImgurUrl(url: string): Promise<string[]> {

    var response = await axios.post('https://funpro-backend.herokuapp.com/imgur/get-images-url', {
        url: url
    })
    return response.data
}
