import { saveAs } from 'file-saver';
var JSZip = require("jszip");
var JSZipUtils = require('jszip-utils')

export default function downloadAndZipImagesFromUrls(urls) {
    var zip = new JSZip();
    var count = 0;
    var count2 = 0;
    var zipFilename = "zipFilename.zip";
    var nameFromURL = [];

    for (var i = 0; i < urls.length; i++) {
        var the_arr = urls[i].split('/');
        nameFromURL.push(the_arr[the_arr.length - 1])

    }

    urls.forEach(function (url) {
        var filename = nameFromURL[count2];
        count2++;
        // loading a file and add it in a zip file
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if (err) {
                throw err; // or handle the error
            }
            zip.file(filename, data, {
                binary: true
            });
            count++;
            if (count === urls.length) {
                zip.generateAsync({
                    type: 'blob'
                }).then(function (content) {
                    saveAs(content, zipFilename);
                });
            }
        });
    });
}