let version = "1.3Rel";
let servReq = new XMLHttpRequest;

async function UpdateCheck() {
    document.getElementById("version").innerText = " " + version;
    servReq.open("GET", "http://wertywin2353.github.io/LunarLists-Re-X/api/version.ini");
    
    document.getElementById('updState').style.opacity = "50%";
    try {
        await servReq.send();
        await delay(1000);
        if(servReq.OPENED) {
            let responseRaw = servReq.responseText;
            responseRaw = responseRaw.split("\n");
                if(responseRaw[1] == version) {
                    document.getElementById('updState').setAttribute('src', 'res/ui/viewed.png');
                    document.getElementById('updState').setAttribute('title', 'У вас последняя версия.');
                }
                else {
                    document.getElementById('updState').setAttribute('src', 'res/ui/warn.png');
                    document.getElementById('updState').setAttribute('title', 'Доступны обновления на GitHub.');
                }
            }
        else {
            console.log('Updates Check failed: Connectivity issues.');
            document.getElementById('updState').setAttribute('src', 'res/ui/dislike.png');
            document.getElementById('updState').setAttribute('title', 'Не удалось проверить наличие обновлений. Проверьте ваш интренет.');
        }
        document.getElementById('updState').style.opacity = "100%";
    } catch (e) {
        console.log('Updates Check failed: ' + e + '.');
        document.getElementById('updState').setAttribute('src', 'res/ui/dislike.png');
        document.getElementById('updState').setAttribute('title', 'Не удалось проверить наличие обновлений. Проверьте ваш интренет.');
        document.getElementById('updState').style.opacity = "100%";

    }
}

// Structure example for this version
let structure = {
    "name": "My List",
    "author": "Me",
    "dateOfEdit": "",
    "pieces": [
    ],
    "metadata": {
        "LLReXVERSION": version,
        "history": [],
        "GALLERY": [
        ]
    },
    "encrypted": false
}