import { useState } from 'react';
import '../index.css';
import {
    DocumentIcon,
    FolderIcon,
} from '@heroicons/react/solid'
import axios from 'axios';
import { save } from 'save-file'


export function FileUnzipper() {
    const [activeFile, setActiveFile] = useState(null)
    const [parentFolder, setParentFolder] = useState([-1])
    const [fileDatas, setFileDatas] = useState([
        {
            name: "Root",
            type: "folder",
            index: 0
        }
    ])

    const addParentFolder = []
    const addFileDatas = []

    function handleChangeFile(event) {
        if (event.target.files.length == 0) return
        setActiveFile(event.target.files[0])
    }

    function getFilePath(path) {
        return path.split("/")
    }

    async function handleUnzipFile() {
        var formData = new FormData();
        formData.append("file", activeFile);
        var ret = await axios.post('http://funpro-backend.herokuapp.com/unzip-file', formData,)
        var fileInformation = ret.data
        fileInformation.forEach(data => {
            var path = getFilePath(data.path)
            var currentFolder = 0
            for (var i = 1; i < path.length - 1; i++) {
                var index = addFolder(path[i], currentFolder)
                currentFolder = index[0]
                if (index[1]) {
                    addParentFolder.push(index[2])
                    addFileDatas.push(index[1])
                }
            }
            var fileName = path[path.length - 1]
            if (fileName.length > 0) {
                var index = addFile(data.file, currentFolder, fileName)
                addParentFolder.push(index[2])
                addFileDatas.push(index[1])
            }
        })


        setFileDatas([...fileDatas, ...addFileDatas])
        setParentFolder([...parentFolder, ...addParentFolder])
        while (addParentFolder.length > 0)
            addParentFolder.pop()
        while (addFileDatas.length > 0)
            addFileDatas.pop()
    }

    function addFolder(folderName, parentIndex) {
        for (var i = 0; i < fileDatas.length; i++) {
            if (fileDatas[i].name == folderName
                && parentFolder[i] == parentIndex) {
                return [fileDatas[i].index, null, parentIndex]
            }
        }


        for (var i = 0; i < addParentFolder.length; i++) {
            if (addFileDatas[i].name == folderName
                && addParentFolder[i] == parentIndex) {
                return [addFileDatas[i].index, null, parentIndex]
            }
        }
        const index = fileDatas.length + addFileDatas.length
        const data = {
            name: folderName,
            type: "folder",
            index: index
        }
        return [index, data, parentIndex]
    }

    function addFile(file, parentIndex, fileName) {
        const index = fileDatas.length
        const data = {
            name: fileName,
            type: "file",
            index: index,
            file: file
        }
        return [index, data, parentIndex]
    }

    return (
        <div className="App p-10 flex flex-col">
            <p className="text-white text-3xl">File Unzipper</p>
            <div className="flex m-5 justify-center">

                <label for="select-file" >
                    <div className="m-4 text-xl border-4 text-white py-1 px-10 mt-10" type="div">
                        Select Zip File
                    </div>
                </label>
                <input type="file" id="select-file" className="hidden" accept=".zip" onChange={handleChangeFile} />
                {
                    activeFile && <button className="m-4 text-xl border-4 text-white py-1 px-10 mt-10" type="button"
                        onClick={handleUnzipFile}
                    >
                        Unzip File
                    </button>
                }

            </div>

            <Folder
                parentFolder={parentFolder}
                fileDatas={fileDatas}
                index={0}
            />
        </div >
    );
}


function Folder({
    parentFolder,
    fileDatas,
    index,
}) {

    function getChildFolderNodes() {
        const ret = []
        for (var i = 0; i < parentFolder.length; i++) {
            if (parentFolder[i] == index && fileDatas[i].type == "folder") {
                ret.push(i)
            }
        }
        return ret
    }

    function getChildFileNodes() {
        const ret = []
        for (var i = 0; i < parentFolder.length; i++) {
            if (parentFolder[i] == index && fileDatas[i].type == "file") {
                ret.push(i)
            }
        }
        return ret
    }

    async function downloadFile(index) {
        const buffer = Buffer.from(fileDatas[index].file.data)
        save(buffer, fileDatas[index].name)
    }

    return (
        <div className="flex flex-col ml-5 ">
            {
                getChildFolderNodes().map(
                    (childIndex, _) =>
                        <div key={childIndex}>
                            <div className="flex flex-row mb-2">
                                <FolderIcon className="h-5 w-5 mr-5 text-yellow-300" />
                                <div className="text-white">{fileDatas[childIndex].name}</div>
                            </div>
                            <Folder
                                parentFolder={parentFolder}
                                fileDatas={fileDatas}
                                index={childIndex}
                            />
                        </div>
                )
            }
            {
                getChildFileNodes().map(
                    (childIndex, _) =>
                        <div className="flex flex-row mb-2" key={childIndex}
                            onClick={() => downloadFile(childIndex)}>
                            <DocumentIcon className="h-5 w-5 mr-5 text-green-500" />
                            <div className="text-white underline">{fileDatas[childIndex].name}</div>
                        </div>
                )
            }
        </div>
    )
}
