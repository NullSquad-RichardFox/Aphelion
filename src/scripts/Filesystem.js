import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

function checkOrRequestPermissions() {
    Filesystem.checkPermissions().then((v) => {
        if (v.publicStorage != 'granted') {
            Filesystem.requestPermissions();
        }
    })
}

async function doesFileExist(file) {
    checkOrRequestPermissions(); 

    try {
        await Filesystem.readFile({
            path: `${file}`,
            directory: Directory.Documents,
            encoding: Encoding.UTF8
        });

        return true;
    } catch (e) {
        return false;
    }
}

async function readFile(file) {
    if (await doesFileExist(file)) {
        const f = await Filesystem.readFile({
            path: `${file}`,
            directory: Directory.Documents,
            encoding: Encoding.UTF8
        });

        try {
            return JSON.parse(f.data);
        } catch {
            return f.data;
        }

    } else {
        writeFile(file, '');
        return null;
    }
}

function writeFile(file, val) {
    checkOrRequestPermissions(); 

    Filesystem.writeFile({
        path: `${file}`,
        data: val,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
    })
}

function resetData() {
    Filesystem.readdir({
        path: '',
        directory: Directory.Documents
    }).then((v) => {
        for (file of v.files) {
            writeFile(file, '');
        }
    })
}

function getAllFiles() {
    Filesystem.readdier({
        path: '',
        directory: Directory.Documents
    }).then((v) => {
        return v.files;
    })
}

export {
    readFile, writeFile, resetData, getAllFiles
}