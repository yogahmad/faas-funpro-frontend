import { save } from 'save-file'
var axios = require("axios");

export default async function downloadAndZipImagesFromUrls(urls) {
    var ret = await axios.post(
        'http://evening-sea-72051.herokuapp.com/imgur/download-from-urls',
        {
            urls: urls
        },
    )

    const buffer = Buffer.from(ret.data)
    save(buffer, "images.zip")
}