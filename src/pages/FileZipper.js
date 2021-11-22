import { useState } from 'react';
import '../index.css';
import {
    DocumentIcon,
    FolderIcon,
} from '@heroicons/react/solid'
import axios from 'axios';
import { save } from 'save-file'

export function FileZipper() {
    const [showModal, setShowModal] = useState(false);
    const [activeFolder, setActiveFolder] = useState(0);
    const [parentFolder, setParentFolder] = useState([-1])
    const [inputName, setInputName] = useState("")
    const [isAddFiles, setIsAddFiles] = useState(true)
    const [fileDatas, setFileDatas] = useState([
        {
            name: "Root",
            type: "folder",
            index: 0
        }
    ])

    function getChildNodes(node) {
        const ret = []
        for (var i = 0; i < parentFolder.length; i++) {
            if (parentFolder[i] == node) {
                ret.push(i)
            }
        }
        return ret
    }

    function getValidFolderName(folderName) {
        var siblingIndexes = getChildNodes(activeFolder)

        var isExist = false
        for (var sibling of siblingIndexes) {
            if (fileDatas[sibling].name == folderName)
                isExist = true
        }

        if (!isExist) return folderName

        for (var suffix = 1; true; suffix++) {
            var newFolderName = `${folderName}_${suffix}`

            isExist = false

            for (var sibling of siblingIndexes) {
                if (fileDatas[sibling].name == newFolderName)
                    isExist = true
            }

            if (!isExist) {
                folderName = newFolderName
                break
            }
        }
        return folderName
    }

    function addFolder(folderName) {
        const index = fileDatas.length
        setFileDatas([...fileDatas, {
            name: getValidFolderName(folderName),
            type: "folder",
            index: index
        }])
        setParentFolder([...parentFolder, activeFolder])
        setShowModal(false)

        setInputName("")
    }

    function addFile(event, parentIndex) {
        const addedFileDatas = []
        const addedParentFolder = []
        for (const file of event.target.files) {
            const index = fileDatas.length + addedFileDatas.length
            const fileName = file.name

            addedFileDatas.push({
                name: fileName,
                type: "file",
                index: index,
                file: file
            })
            addedParentFolder.push(parentIndex)
        }

        setFileDatas([...fileDatas, ...addedFileDatas])
        setParentFolder([...parentFolder, ...addedParentFolder])
    }


    function handleInputChange(event) {
        setInputName(event.target.value)
    }

    function getPath(index) {
        if (index == 0) return ""
        return getPath(parentFolder[index]) + "/" + fileDatas[index].name
    }

    async function zipFiles() {
        var formData = new FormData();
        for (const file of fileDatas) {
            formData.append(getPath(file.index), file.file);
        }
        var ret = await axios.post(
            'http://funpro-backend.herokuapp.com/zip-files',
            formData,
        )

        const buffer = Buffer.from(ret.data)
        save(buffer, "files.zip")
    }


    return (

        <div className="App p-10 flex flex-col">
            <p className="text-white text-3xl">File Zipper</p>
            <div className="flex m-5 justify-center">
                <button className="m-4 text-xl border-4 text-white py-1 px-10 mt-10" type="button"
                    onClick={() => {
                        setIsAddFiles(!isAddFiles)
                    }}
                >
                    Turn on/off add files/folder
                </button>
                <button className="m-4 text-xl border-4 text-white py-1 px-10 mt-10" type="button"
                    onClick={() => {
                        zipFiles()
                    }}
                >
                    Zip File
                </button>
            </div>
            <Folder
                setShowModal={setShowModal}
                showModal={showModal}
                parentFolder={parentFolder}
                fileDatas={fileDatas}
                setActiveFolder={setActiveFolder}
                index={0}
                addFile={addFile}
                isAddFiles={isAddFiles}
            />

            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <input class="appearance-none w-full block w-200 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4" type="text" placeholder="Folder Name" value={inputName} onChange={handleInputChange} />

                                <div className="flex items-center justify-end border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => addFolder(inputName)}
                                    >
                                        Add Folder
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </div >
    );
}

function Folder({
    setShowModal,
    showModal,
    parentFolder,
    fileDatas,
    index,
    setActiveFolder,
    addFile,
    isAddFiles,
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

    return (
        <div className="flex flex-col ml-5 ">
            {
                getChildFolderNodes().map(
                    (childIndex, _) =>
                        <>
                            <div className="flex flex-row mb-2">
                                <FolderIcon className="h-5 w-5 mr-5 text-yellow-300" />
                                <div className="text-white">{fileDatas[childIndex].name}</div>
                            </div>
                            <Folder
                                setShowModal={setShowModal}
                                showModal={showModal}
                                parentFolder={parentFolder}
                                fileDatas={fileDatas}
                                setActiveFolder={setActiveFolder}
                                index={childIndex}
                                addFile={addFile}
                                isAddFiles={isAddFiles}
                            />
                        </>
                )
            }
            {
                isAddFiles && (
                    <div className="flex flex-row mb-2">
                        <FolderIcon className="h-5 w-5 mr-5 text-blue-200" />
                        <div className="text-white underline" onClick={() => {
                            setActiveFolder(index)
                            setShowModal(!showModal)
                        }}
                        >+ Add Folder</div>
                    </div>
                )
            }
            {
                isAddFiles && (
                    <div className="flex flex-row mb-2">
                        <DocumentIcon className="h-5 w-5 mr-5 text-blue-200" />
                        <label for={`add-file-${index}`} >
                            <div className="text-white underline">+ Add File</div>
                        </label>
                        <input type="file" multiple="multiple" id={`add-file-${index}`} className="hidden" onChange={(event) => {
                            addFile(event, index)
                        }} />
                    </div>
                )
            }
            {
                getChildFileNodes().map(
                    (childIndex, _) =>
                        <>
                            <div className="flex flex-row mb-2">
                                <DocumentIcon className="h-5 w-5 mr-5 text-green-500" />
                                <div className="text-white underline">{fileDatas[childIndex].name}</div>
                            </div>
                        </>
                )
            }
        </div>
    )
}
