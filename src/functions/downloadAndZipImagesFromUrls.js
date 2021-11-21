import { save } from 'save-file'
var axios = require("axios");

export default async function downloadAndZipImagesFromUrls(urls) {
    var ret = await axios.post(
        'http://localhost:9000/imgur/download-from-urls',
        {
            urls: urls
        },
    )

    const buffer = Buffer.from(ret.data)
    save(buffer, "images.zip")
}