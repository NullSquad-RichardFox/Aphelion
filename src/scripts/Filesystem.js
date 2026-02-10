import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

function CheckOrRequestPermissions() {
    Filesystem.checkPermissions().then((v) => {
        if (v.publicStorage != 'granted') {
            Filesystem.requestPermissions();
        }
    })
}

async function DoesFileExist(file) {
    CheckOrRequestPermissions(); 

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

async function ReadFile(file) {
    if (await DoesFileExist(file)) {
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
        WriteFile(file, '');
        return null;
    }
}

function WriteFile(file, val) {
    CheckOrRequestPermissions(); 

    Filesystem.writeFile({
        path: `${file}`,
        data: val,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
    })
}

function AppendFile(file, item) {
    ReadFile().then((f) => {
        if (f == null) {
            WriteFile(file, item);
        } else {
            try {
                f.push(item);
            } catch {
                f += item;
            }
            WriteFile(file, f);
        }
    });
}

function ResetData() {
    Filesystem.readdir({
        path: '',
        directory: Directory.Documents
    }).then((v) => {
        for (file of v.files) {
            WriteFile(file, '');
        }
    })
}

export {
    ReadFile, WriteFile, AppendFile, ResetData
}