var JSZip = require("jszip");


export async function unzipFile(file) {
    var zip = await JSZip.loadAsync(file)
    var ret = []
    var asyncFiles = []
    zip.forEach((relativePath, file) => {
        ret.push({
            'path': relativePath,
            'file': file,
        })
        asyncFiles.push(file.async("blob"))
    })
    var files = await Promise.all(asyncFiles)
    return [ret, files]
}