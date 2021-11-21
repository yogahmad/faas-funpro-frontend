import { useState } from 'react';
import '../index.css';
import { getImageUrlsFromImgurUrl } from '../functions/getImageUrlsFromImgurUrl';
import downloadAndZipImagesFromUrls from '../functions/downloadAndZipImagesFromUrls';

export function ImgurAlbumDownloader() {
    const [url, setUrl] = useState("")
    const [isDownloadImageLoading, setIsDownloadImageLoading] = useState(false);
    const [isGetImageLoading, setIsGetImageLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState([])

    async function getImages() {
        setIsGetImageLoading(true)
        var images
        if (url.length == 0) {
            images = await getImageUrlsFromImgurUrl('https://imgur.com/a/dWpR9St')
        }
        else {
            images = await getImageUrlsFromImgurUrl(url)
        }
        setImageUrls(images)
        setIsGetImageLoading(false)
    }

    async function download() {

        setIsDownloadImageLoading(true)
        await downloadAndZipImagesFromUrls(imageUrls)
        setIsDownloadImageLoading(false)
    }

    function handleUrlChange(event) {
        setUrl(event.target.value)
    }

    return (
        <div className="App">
            <header className="App-header">
                <form class="w-full max-w-lg">
                    <div class="flex flex-wrap -mx-3 mb-6">
                        <div class="w-full px-3">
                            <label class="block uppercase tracking-wide text-white-700 text-sm font-bold mb-2" for="grid-password">
                                Imgur Album URL
                            </label>
                            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="https://imgur.com/a/dWpR9St" value={url} onChange={handleUrlChange} />
                            {!isGetImageLoading
                                ? <button class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="button" onClick={getImages}>
                                    Get Images
                                </button>
                                : <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-rose-600 hover:bg-rose-500 focus:border-rose-700 active:bg-rose-700 transition ease-in-out duration-150 cursor-not-allowed" disabled="">
                                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing
                                </button>
                            }
                        </div>
                        <div class="container grid grid-cols-3 gap-2 mx-auto m-5">
                            {
                                imageUrls.map(function (imageUrl, _) {
                                    return <img src={imageUrl}
                                        alt="image" key={imageUrl} />
                                })
                            }
                        </div>
                        {imageUrls.length > 0 &&
                            <div class="w-full px-3">
                                {!isDownloadImageLoading
                                    ? <button class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="button" onClick={download}>
                                        Download Images
                                    </button>
                                    : <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-rose-600 hover:bg-rose-500 focus:border-rose-700 active:bg-rose-700 transition ease-in-out duration-150 cursor-not-allowed" disabled="">
                                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing
                                    </button>
                                }
                            </div>
                        }
                    </div>
                </form>
            </header>
        </div >
    );
}

