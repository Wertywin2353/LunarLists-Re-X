let xmlreq = new XMLHttpRequest();
let click = new Audio(settings.UISFX.UIClick);
let deleteCl = new Audio(settings.UISFX.UIDelete);
let setts = new Audio(settings.UISFX.UISettings);
let linkmodes = new Audio(settings.UISFX.UIlinkmode);
let inputOBJ = document.getElementById('fileinput');
let inputOBJforIMAGE = document.getElementById('imageinput');
let importClick = new Audio(settings.UISFX.UIImportClick);
let bgs = new Audio(settings.UISFX.bgsong[1]);
let galclk = new Audio(settings.UISFX.UIUseBannerClick);
let UISFXSTATE = settings.UISFX.state;
let masterVolume = settings.UISFX.masterVolume;
let masterV;
let GlobalKey;
let linkmode = false;
let bgV;
let DatE = new Date();
let TodayDate;
let interI;
let hasUnsavedChanges = false; 
let gallerylookupstatus = false;
let unknownlookupstatus = false;
let Inqueuelookupstatus = false;
let collection;
let piecebannervar;
let hasBeenEncrypted;
let content = document.getElementById('content');
let header = document.getElementById('header');
let unsaved = [];
let tips = [
    "Большинство пользователей забывают о элементах в очереди... А вы?",
    "Lunar Lists имеют свой стандарт файлов - '.coll', хотя вы можете поставить туда вообще любое расширение.",
    "Вы можете изменить этот проект вместе с разработчиком! Присылайте свои идеи или станьте частью команды интузиастов. (Подробнее на GitHub)",
    "Баги, это своего рода тоже функционал... Но только вам решать, станет ли этот баг фичей или вы его зарепортите в баг-трекер.",
    "Кастомизация этого проекта куда практичнее, чем вы думаете. Попробуйте!",
    "Если хотите наглядно увидеть как сильно похорошел этот проект, просто откройте Lunar Lists Legacy.",
    "Проверяйте readme на GitHub почаще - мы регулярно добавляем* туда идеи, которые вполне могут стать реальными в новых обновлениях.",
    "AES-256 - один из самых надежных и распространенных стандартов симметричного шифрования данных, которые используют даже DHS США. Думаю, для вашей коллекции более чем безопасно.",
    "Если галлерея грузится слишком долго, возможно стоит потрогать травы)",
    "Возможно, вы и не подозреваете, что в вашей коллекции больше одного '67'...",
    "Торт - это ложь.",
    "Хотите посмотреть на плохой код? Тогда смело заходите на GitHub страничку этого проекта!",
    "Чем больше, тем меньше",
    "If your enemy can predict your next move, then don't move",
    "Все бета-тестеры приложения - 200",
    "Вы можете использовать приложение не только для аниме... ",
    "Списки как структура данных (массивы) появились в 1950-х годах с развитием языков программировани",
    "Исао Такахата - режиссер аниме, переживший ядерный взрыв"
];
// Why so many vars? CUZ JavaScript IS BS
if(UISFXSTATE == false) {
    masterV = 0;
}
else if(UISFXSTATE == true) {
    masterV = masterVolume;
    if(settings.UISFX.bgsong[0] == true) { bgV = masterV; }
    else { bgV = 0; }
        
}
if(settings.preloadCollPath != "") {
    
    xmlreq.open("GET", settings.preloadCollPath);
    xmlreq.send();
    setTimeout(function () {
        collection = xmlreq.responseText;
        parseColl();
        }, 500
    );
    openimporttip();
}
else {
    document.getElementById('importTip').style.display = "none";
}

document.addEventListener('click', handleClick);
function handleClick() {
    click.volume = masterV;
    galclk.volume = masterV;
    importClick.volume = masterV;
    deleteCl.volume = masterV;
    setts.volume = masterV;
    linkmodes.volume = masterV;
    click.play();
    if(bgs.paused == true) {
        bgs.volume = bgV;
        bgs.play();
        bgs.loop = true;
    }
}


inputOBJforIMAGE.addEventListener('change', async (event) => {
     const file = event.target.files[0];
     if (!file) return;

     try {
         const base64String = await imageToBase64(file);
         collection.metadata.GALLERY.push(base64String);
         refreshGallery();
         importClick.play();
         unsaved.push(String("Добавление 1 изображения. (№ " + collection.metadata.GALLERY.length() + ")"));
         unsavedChangesTracker();
     } catch (error) {
         console.error('Ошибка при конвертации:', error);
     }
});

inputOBJ.onchange = (e) => {
    console.log('[Task] Reqesting ".collection" file...');
    TodayDate = String(DatE.toLocaleString().split(',', 1));
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
        alert("Ошибка! Выберите файл.");
        console.log('Task failed: File not choosen.');
        return;
    }

    const reader = new FileReader();
    reader.readAsText(selectedFile, 'UTF-8');

    reader.onload = (readerEvent) => {
        const fileContent = readerEvent.target.result;
        collection = fileContent;
        parseColl();
    };
    // error handler
    reader.onerror = () => {
        alert("Ошибка! Файл поврежден или некорректен.");
        console.log('Task failed: Unexpected error occured.');
    };
};


function parseColl(time) {
    if(time == undefined) {
    importClick.play();
    if(collection != undefined) {
        collection = JSON.parse(collection);
    }
    else {
        collection = structure;
    }
    hideLOGO();
    if(collection.encrypted) {
        showDecSplash();
        return 0;
    } else { hasBeenEncrypted = false; }
    }
    content.innerHTML = "<br>";
    let searchBar = "<input class='filterInput' placeholder='" + settings.TextPlaceholders.FilterBarPlaceholder + "' oninput='searchForElm(this)'>";
    let galleryBTN = "<div id='filtgall' onclick='selectTag(this, 1)' class='filterButton'><img src='./res/ui/gallery.png' class='icon' style='margin-right: 1.5px; margin-bottom: 1px;'>Поиск по баннеру</div>";
    let unkBTN = "<div id='filtunk' onclick='selectTag(this, 2)' class='filterButton'><img src='./res/ui/question.png' class='icon' style='margin-right: 1.5px; margin-bottom: 1px;'>Неизвестный статус</div>";
    let queBTN = "<div id='filtinq' onclick='selectTag(this, 3)' class='filterButton'><img src='./res/ui/bookmarked.png' class='icon' style='margin-right: 1.5px; margin-bottom: 1px;'>В очереди</div>";
    let addBTN = "<div id='filtadd' onclick='selectTag(this, 4)' class='filterButton'><img src='./res/ui/create.png' class='icon' style='margin-right: 1.5px; margin-bottom: 1px;'>Добавить элемент</div>";
    content.innerHTML = content.innerHTML + "<div id='filter'>" + searchBar + addBTN + queBTN + galleryBTN + unkBTN + "</div><br><br><br>";
    content.innerHTML = content.innerHTML + "<div id='piecesContainer'></div>";
    let contentE = document.getElementById('piecesContainer');
    let i = 0;
    while(collection.pieces.length != i) {
        console.log('Loop state: ' + i + "/" + collection.pieces.length);
        let piece = collection.pieces[i].split("|");
        let status;
            let statusmark;
            try {
                statusmark = piece[3].replaceAll('\r', '');
            } catch (err) { console.log('Error handled: ' + err); };
            if(statusmark == "Просмотрено") {
                status = "<img src='./res/ui/viewed.png' style='margin-right: 5px;' width='50' align='left'>";
            }
            else if(statusmark == "В очереди") {
                status = "<img src='./res/ui/bookmarked.png' style='margin-right: 5px;' width='50' align='left'>";
            }
            else if(statusmark == "Понравилось") {
            status = "<img src='./res/ui/favorite.png' style='margin-right: 5px;' width='50' align='left'>";
            }
            else if(statusmark == "Не понравилось") {
                status = "<img src='./res/ui/dislike.png' style='margin-right: 5px;' width='50' align='left'>";
            }
            else {
                status = "<img src='./res/ui/question.png' style='margin-right: 5px;' width='50' align='left'>";
            }
            if(piece[1] == "") {
                piece[1] = settings.TextPlaceholders.NoDescription;
            }  
            if(piece[2] == "") {
                piece[2] = piece[1];
            }
            if(piece[4] == "") {
                piece[4] =  settings.TextPlaceholders.NoDateAvaible;
            }
        contentE.innerHTML = contentE.innerHTML + "<div class='contentPiece' onclick='opendetails(&quot;" + encodeB(piece.join("|")) + "&quot;, " + i + ")'>" + status + "<h2 style='width: 75%; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;'>" + piece[0] + "</h2><p style='width: 60%; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;'>" + piece[2] + "</p><span class='countmark'>" + piece[4].replaceAll("undefined", "") + ", № " + i + "</span><br><span class='editTip'>" + settings.TextPlaceholders.EditTip + "</span></div><br>";
        i++;
    }
    contentE.innerHTML = contentE.innerHTML + "<div class='contentPiece' onclick='opendetails(&quot;" + encodeB("Имя элемента||||" + TodayDate) + "&quot;, &quot;NULL&quot;)'>" + iconCREATE + "<h2>Добавить новый элемент</h2><p>Добавить в эту коллекцию что-то новенькое!</p></div><br><br><br><br>";
    content.innerHTML = content.innerHTML + "<div id='pieceEditor'><div id='placeolderEditor'><img src='./res/ui/pieceedit.png' style='padding: 5px;'><h2>" + settings.TextPlaceholders.EditPieceTitle[0] + "</h2><p style='font-size:14px; padding:7px;'>" + settings.TextPlaceholders.EditPieceTitle[1] + "</p></div></div>";
    document.getElementById('linkmodetip').style.opacity = "100";
    hidelinkmodetip();
}

let statusDisplay = "<span><img src='res/ui/bookmarked.png' class='icon' style='filter: invert();'> Обработка элементов...</span><br><span><img src='res/ui/bookmarked.png' class='icon' style='filter: invert();'> Обработка истории...</span><br><span><img src='res/ui/bookmarked.png' class='icon' style='filter: invert();'> Обработка галлереи...</span>";
async function tryToDecypt(btn) {
    openEDProc();
    let inp = document.getElementById('passToColl').value;
    btn.style.opacity = "50%";
    btn.innerHTML = "Подождите...";
    try {
        if(collection.pieces.length != 0) {
            let i = 0;
            statusDisplay = "<span><img src='res/ui/history.png' class='icon' style='filter: invert();'> Обработка " + collection.pieces.length + " элементов...</span><br><span><img src='res/ui/bookmarked.png' class='icon' style='filter: invert();'> Обработка истории...</span><br><span><img src='res/ui/bookmarked.png' class='icon' style='filter: invert();'> Обработка галлереи...</span>";
            while(collection.pieces.length != i) {
                console.log("[1/3] Decryption Pieces... " + i + "/" + collection.pieces.length);
                let decp = await decryptAES(collection.pieces[i], inp);
                collection.pieces[i] = decp;
                document.getElementById("EncDecStatus").innerHTML = statusDisplay;
                i++;
            }
        } else { console.log("No data in Pieces array, skipping..."); }
        if(collection.metadata.history.length != 0) {
            let ihis = 0;
            statusDisplay = "<span><img src='res/ui/viewed.png' class='icon' style='filter: invert();'> Обработка элементов завершена.</span><br><span><img src='res/ui/history.png' class='icon' style='filter: invert();'> Обработка истории... (" + collection.metadata.history.length + " элементов)</span><br><span><img src='res/ui/bookmarked.png' class='icon' style='filter: invert();'> Обработка галлереи...</span>";
            while(collection.metadata.history.length != ihis) {
                console.log("[2/3] Decryption History... " + ihis + "/" + collection.metadata.history.length);
                let dech = await decryptAES(collection.metadata.history[ihis], inp);
                collection.metadata.history[ihis] = dech;
                document.getElementById("EncDecStatus").innerHTML = statusDisplay;
                ihis++;
            }
        } else { console.log("No data in History array, skipping..."); }
        if(collection.metadata.GALLERY.length != 0) {
            let igal = 0;
            statusDisplay = "<span><img src='res/ui/viewed.png' class='icon' style='filter: invert();'> Обработка элементов завершена.</span><br><span><img src='res/ui/viewed.png' class='icon' style='filter: invert();'> Обработка истории завершена.</span><br><span><img src='res/ui/history.png' class='icon' style='filter: invert();'> Обработка галлереи... (" + collection.metadata.GALLERY.length + " элементов)</span>";
            while(collection.metadata.GALLERY.length != igal) {
                console.log("[2/3] Decryption Gallery... " + igal + "/" + collection.metadata.GALLERY.length);
                let decg = await decryptAES(collection.metadata.GALLERY[igal], inp);
                collection.metadata.GALLERY[igal] = decg;
                document.getElementById("EncDecStatus").innerHTML = statusDisplay;
                igal++;
            }
        }
        statusDisplay = "<span><img src='res/ui/viewed.png' class='icon' style='filter: invert();'> Обработка элементов завершена.</span><br><span><img src='res/ui/viewed.png' class='icon' style='filter: invert();'> Обработка истории завершена.</span><br><span><img src='res/ui/viewed.png' class='icon' style='filter: invert();'> Обработка галлереи завершена.</span>";
        hasBeenEncrypted = true;
        document.getElementById("EncDecStatus").innerHTML = statusDisplay;
        hideDecSplash();
        parseColl(2);
        closeEDProc();
        collection.encrypted = false;
    } catch (e) {
        closeEDProc();
        console.error(e);
        alert('Ошибка дешифровки коллекции. Возможно, пароль неверный?' + 'Техническая информация: ' + e);
        btn.style.opacity = "100%";
        btn.innerHTML = "Дешифровать коллекцию";
    }
}

async function encryptParts(num) {
    openEDProc();
    let inp;
    if(num == undefined || num == null || num == "") {
        inp = document.getElementById("passForEnc").value;
    }
    else {
        inp = GlobalKey;
    }
    try {
        if(collection.pieces.length != 0) {
            let i = 0;
            statusDisplay = "<span><img src='res/ui/history.png' class='icon' style='filter: invert();'> Обработка " + collection.pieces.length + " элементов...</span><br><span><img src='res/ui/bookmarked.png' class='icon' style='filter: invert();'> Обработка истории...</span><br><span><img src='res/ui/bookmarked.png' class='icon' style='filter: invert();'> Обработка галлереи...</span>";
            while(collection.pieces.length != i) {
                console.log("[1/3] Encryption Pieces... " + i + "/" + collection.pieces.length);
                let encp = await encryptAES(collection.pieces[i], inp);
                collection.pieces[i] = encp;
                document.getElementById("EncDecStatus").innerHTML = statusDisplay;
                i++;
            }
        } else { console.log('No data in Pieces array, skipping...'); }
        if(collection.metadata.history.length != 0) {
            let ihis = 0;
            statusDisplay = "<span><img src='res/ui/viewed.png' class='icon' style='filter: invert();'> Обработка элементов завершена.</span><br><span><img src='res/ui/history.png' class='icon' style='filter: invert();'> Обработка истории... (" + collection.metadata.history.length + " элементов)</span><br><span><img src='res/ui/bookmarked.png' class='icon' style='filter: invert();'> Обработка галлереи...</span>";
            while(collection.metadata.history.length != ihis) {
                console.log("[2/3] Encryption History... " + ihis + "/" + collection.metadata.history.length);
                let ench = await encryptAES(collection.metadata.history[ihis], inp);
                collection.metadata.history[ihis] = ench;
                document.getElementById("EncDecStatus").innerHTML = statusDisplay;
                ihis++;
            }
        } else { console.log('No data in History array, skipping...'); }
        if(collection.metadata.GALLERY.length != 0) {
            let igal = 0;
            statusDisplay = "<span><img src='res/ui/viewed.png' class='icon' style='filter: invert();'> Обработка элементов завершена.</span><br><span><img src='res/ui/viewed.png' class='icon' style='filter: invert();'> Обработка истории завершена.</span><br><span><img src='res/ui/history.png' class='icon' style='filter: invert();'> Обработка галлереи... (" + collection.metadata.GALLERY.length + " элементов)</span>";
            while(collection.metadata.GALLERY.length != igal) {
                console.log("[3/3] Encryption Gallery... " + igal + "/" + collection.metadata.GALLERY.length);
                let encg = await encryptAES(collection.metadata.GALLERY[igal], inp);
                collection.metadata.GALLERY[igal] = encg;
                document.getElementById("EncDecStatus").innerHTML = statusDisplay;
                igal++;
            }
        } else { console.log('No data in Gallery array, skipping...'); }
        statusDisplay = "<span><img src='res/ui/viewed.png' class='icon' style='filter: invert();'> Обработка элементов завершена.</span><br><span><img src='res/ui/viewed.png' class='icon' style='filter: invert();'> Обработка истории завершена.</span><br><span><img src='res/ui/viewed.png' class='icon' style='filter: invert();'> Обработка галлереи завершена.</span>";
        collection.encrypted = true;
        document.getElementById("EncDecStatus").innerHTML = statusDisplay;
        closeEDProc();
    } catch (e) {
        console.error(e);
        alert("Ошибка при шифровании AES-256, попробуйте еще раз. Если она повторяется, то обратите внимание на описание ниже: " + e);
        closeEDProc();
    }
}

function opendetails(pieceArr, i) {
    let openGalleryParams;
    let placeholderBANNERLOC = BANNERLOC;
    let pieceRAW = decodeB(pieceArr).split("|");
    let galnum = Number(pieceRAW[5]);
    if(linkmode == true) {
        window.open(pieceRAW[1]);
        return 0;
    }
    console.log(galnum);
    if(pieceRAW[5] != undefined && pieceRAW[5] != null && pieceRAW[5] != "" && galnum != NaN) {
        BANNERLOC = "<div onclick='openGallery()' class='editortile' style='text-align: center;'><img src='" + collection.metadata.GALLERY[Number(pieceRAW[5])] + "' width='200px' style='border-radius: 10px;'></div>";
    }
    if(pieceRAW[1] == "Описания/Ссылки нет.") {
        pieceRAW[1] = "Нет";
    }
    let headerLOC = "<h3 style='font-weight:normal; text-align: center;'>" + settings.TextPlaceholders.CurrentPieceTitle + "</h3><hr style='border: 1px solid black;'><br>";
    let NAMELOC = "<div class='editortile'><textarea id='NAMETILE'>" + pieceRAW[0] + "</textarea></div>";
    let STATUSLOC = "<div class='editortile'>" + iconSTATUS + "Статус: <input list='def-statuses' id='STATUSTILE' value='" + pieceRAW[3] + "'></div>";
    let LINKLOC = "<div class='editortile'>" + iconLINK + "Ссылка: <input id='LINKTILE' value='" + pieceRAW[1] + "'></div>";
    let DATELOC = "<div class='editortile'>" + iconDATEOFWATCH + "Внесено: <input id='DATETILE' value='" + pieceRAW[4].replaceAll("undefined", "") + "'></div>";
    let COMMLOC = "<div class='editortile'>" + iconDESC + "Добавленный коментарий:<br><hr style='opacity:0; border: 2px solid red;'><textarea id='COMTILE'>" + pieceRAW[2] + "</textarea></div>";
    let APPLYBUTTON = "<button id='APPLYBUTTON' onclick='applyChanges(&quot;" + i + "&quot;)'>" + settings.TextPlaceholders.ApplyChangesButton + "</button>";
    let DELETEBUTTON = "<button class='deletebutton' onclick='deletePiece(&quot;" + i + "&quot;)'>" + iconTrash + "</button>";
    document.getElementById('pieceEditor').style.textAlign = "left";
    document.getElementById('pieceEditor').style.padding = "5px";
    piecebannervar = pieceArr;
    interI = i;
    document.getElementById('pieceEditor').innerHTML = String(headerLOC + BANNERLOC + NAMELOC + STATUSLOC + LINKLOC + DATELOC + COMMLOC + APPLYBUTTON + DELETEBUTTON);
    BANNERLOC = placeholderBANNERLOC;
}

function refreshGallery(nn) {
    document.getElementById('gallerytiles').innerHTML = "";
    let i = 0;
    let additional;
    if(nn == undefined || nn == "") {
        additional = "";
    }
    else {
        additional = ", 1";
    }
    while(collection.metadata.GALLERY.length != i) {
        let photoDIV = "<div onclick='choosePIC(&quot;" +  piecebannervar + "&quot;, " + i + additional + ")' class='photoDIV'><img src='" + collection.metadata.GALLERY[i] + "' width='200px' style='border-radius: 10px;'><br><span>Баннер №" + i + "</span></div>";
        document.getElementById('gallerytiles').innerHTML = document.getElementById('gallerytiles').innerHTML + photoDIV;
        i++;
    }
}
function choosePIC(arr, bnum, numm) {
    galclk.play();
    if(numm != undefined) {
        Gallerylook(bnum);
        closeGallery();
    }
    else {
    let pieceRAW = decodeB(arr).split("|");
    pieceRAW[0] = document.getElementById('NAMETILE').value;
    pieceRAW[1] = document.getElementById('LINKTILE').value;
    pieceRAW[2] = document.getElementById('COMTILE').value;
    pieceRAW[3] = document.getElementById('STATUSTILE').value;
    pieceRAW[4] = document.getElementById('DATETILE').value;
    pieceRAW[5] = bnum;
    closeGallery();
    opendetails(encodeB(pieceRAW.join("|")), interI);
    }
}
function applyChanges(arrn) {
    gallerylookupstatus = false;
    document.getElementById('filtgall').style.background = "rgba(255, 255, 255, 0.2)";
    unknownlookupstatus = false;
    document.getElementById('filtunk').style.background = "rgba(255, 255, 255, 0.2)";
    let name = document.getElementById('NAMETILE').value;
    let status = "|" + document.getElementById('STATUSTILE').value;
    let link = "|" + document.getElementById('LINKTILE').value;
    let date = "|" + document.getElementById('DATETILE').value;
    let comment = "|" + document.getElementById('COMTILE').value;
    let pic;
    let pieceRAW = decodeB(piecebannervar).split("|");
    if(pieceRAW[5] != undefined) {
        pic = "|" + Number(pieceRAW[5]);
    }
    let elem = name + link + comment + status + date + pic;
    if(arrn == "NULL") {
        collection.pieces.push(elem);
        unsaved.push(String("Добавление нового элемента."));
        unsavedChangesTracker();
        console.log("Added ELEMENT");
    }
    else {
        collection.pieces[arrn] = elem;
        unsaved.push(String("Изменение элемента №" + arrn + "."));
        unsavedChangesTracker();
        console.log("Modded ELEMENT");
    }
    parseColl(1);
    collection.dateOfEdit = TodayDate;
}
function deletePiece(arrn) {
    unsaved.push(String("Удаление элемента №" + arrn + "."));
    unsavedChangesTracker();
    deleteCl.play();
    if(arrn == "NULL") {
        return 0;
    }
    let pieceRAW = decodeB(piecebannervar);
    collection.metadata.history.push(arrn + "$" + pieceRAW);
    collection.pieces.splice(arrn, 1);
    parseColl(1);
    collection.dateOfEdit = TodayDate;
}

function renderSettingsLIST() {
    let hisdeltext = "<button onclick='eraseHISTORY()'> Нажмите, чтобы удалить!</button>";
    let galdeltext = "<button onclick='eraseGALLERY()'>Нажмите, чтобы удалить!</button>";
    if(collection.metadata.history.length == 0) {
        hisdeltext = "";
    }
    if(collection.metadata.GALLERY.length == 0) {
        galdeltext = "";
    }
    document.getElementById("listSettContainer").innerHTML = "";
    let listname = "<h2>" + iconCOLNAME + settings.TextPlaceholders.ListSettingsTexts[0] + "<input id='settinpLNAME' class='settinput' value='" + collection.name + "'></h2>";
    let authorname = "<h3 style='margin-left: 1.5px;'>" + iconCOLAUTHOR + settings.TextPlaceholders.ListSettingsTexts[1] + "<input id='settinpLAUTH' class='settinput' value='" + collection.author + "'></h3>";
    let lastEdit = iconCOLDATE + settings.TextPlaceholders.ListSettingsTexts[2] + "<span style='opacity: 75%;'>" + collection.dateOfEdit + "</span><br>";
    let Listversion = iconCOLVERS + settings.TextPlaceholders.ListSettingsTexts[3] + "<span style='opacity: 75%;'>" + collection.metadata.LLReXVERSION + " (И Выше)</span><br>";
    let listdetails = "<details><summary>" + settings.TextPlaceholders.ListSettAbout + "</summary><p style='padding: 5px;'>" + listname + authorname + lastEdit + Listversion + "</p></details>";
    let galleryoption = "<br><div style='font-size: 18px;'><img src='./res/ui/gallery.png' class='icon' style='margin-right: 3px; filter: invert(); margin-bottom: 1px;'>Галлерея коллекции: <span style='color: var(--style-col);'>" + collection.metadata.GALLERY.length + " </span>изображений. " + galdeltext + "</div>";
    let historyoption = "<div style='font-size: 18px;'><img src='./res/ui/history.png' class='icon' style='margin-right: 3px; filter: invert(); margin-bottom: 1px;'>История действий (" + collection.metadata.history.length + " записей)" + hisdeltext + "<div id='historyContent'></div></div>";
    let BTNS = "<br><br><button onclick='writeCollSettings()' class='applySettingsListBTN'>Применить настройки</button><button onclick='closeListSettings()' class='discardSettingsListBTN'>Закрыть без сохранения</button>";
    let encrStatus;
    if(hasBeenEncrypted) {
        encrStatus = "<div style='font-size: 18px;'><img src='./res/ui/protection.png' class='icon' style='margin-right: 3px; filter: invert(); margin-bottom: 1px;'>Данная коллекция защищенна AES-256.</div>";
    } else {
        encrStatus = "<div style='font-size: 18px;'><img src='./res/ui/shield-warn.png' class='icon' style='margin-right: 3px; filter: invert(); margin-bottom: 1px;'>Данная коллекция не защищенна AES-256.</div>";
    }
    document.getElementById("listSettContainer").innerHTML = listdetails + galleryoption + encrStatus + historyoption + BTNS;
    renderHistory();
}

function renderHistory() {
    if(collection.metadata.history.length == 0) {
        document.getElementById("historyContent").innerHTML = "<img src='./res/ui/bookmarked.png' style='filter: invert(); width: 90px'><br><span>" + settings.TextPlaceholders.NoHistory + "</span>";
        document.getElementById("historyContent").style.height = "125px";
        document.getElementById("historyContent").style.overflow = "hidden";
        return 0;
    }
    let i = 0;
    let historycontent = document.getElementById("historyContent");
    historycontent.style.textAlign = 'left';
    while(collection.metadata.history.length != i) {
        let currentPiece = collection.metadata.history[i].split("$");
        currentPiece[1] = String(currentPiece[1]).replaceAll("|", ", ");
        historycontent.innerHTML = historycontent.innerHTML + "<div onclick='restoreElm(&quot;" + encodeB(collection.metadata.history[i]) + "&quot;, this, " + i + ")' class='contentPiece' style='animation: none; width: unset; background: rgba(0,0,0,0.2);'><h3>Удаленный элемент коллекции №" + currentPiece[0] + " (Нажмите, чтобы восстановить)</h3><p style='opacity: 50%'>" + currentPiece[1] + "</p></div><br>";
        i++;
    }
}

function eraseGALLERY() {
    unsaved.push(String("Удаление галлереи."));
    unsavedChangesTracker();
    deleteCl.play();
    let i = 0;
    while(collection.pieces.length != i) {
        let pelm;
        pelm = collection.pieces[i].split("|");
        pelm[5] = "";
        collection.pieces[i] = String(pelm.join("|"));
        i++;
    }
    collection.metadata.GALLERY = [];
    parseColl(2);
    renderSettingsLIST();
    collection.dateOfEdit = TodayDate;
}
function eraseHISTORY() {
    unsaved.push(String("Удаление истории действий."));
    unsavedChangesTracker();
    deleteCl.play();
    collection.metadata.history = [];
    renderSettingsLIST();
    collection.dateOfEdit = TodayDate;
}

function writeCollSettings() {
    unsaved.push(String("Изменения в настройках коллекции."));
    unsavedChangesTracker();
    galclk.play();
    collection.name = document.getElementById('settinpLNAME').value;
    collection.author = document.getElementById('settinpLAUTH').value;
    collection.dateOfEdit = TodayDate;
    closeListSettings();
    hideLOGO();
    parseColl(3);
}
function saveColl() {
    collection.dateOfEdit = TodayDate;
    openSaveAs();
    document.getElementById('saname').value = sanitizeFilename(collection.name);
}

document.getElementById('dwn').onclick = async function () {
    var csvData = 'data:application/txt;charset=utf-8,' + encodeURIComponent(JSON.stringify(collection));
    this.href = csvData;
    this.target = '_blank';
    this.download = String(filenameX + "." + exts);
    console.log('[Task: Save list] Task finished.');
    if(hasBeenEncrypted) {
        alert("Сейчас будет проводится повторная дешифровка коллекции, что бы вы смогли её отредактировать после экспорта. Пожалуйста, дождитесь завершения.");
        try {
        if(collection.pieces.length != 0) {
            let i = 0;
            while(collection.pieces.length != i) {
                console.log("[1/3] Decryption Pieces... " + i + "/" + collection.pieces.length);
                let decp = await decryptAES(collection.pieces[i], GlobalKey);
                collection.pieces[i] = decp;
                i++;
            }
        } else { console.log("No data in Pieces array, skipping..."); }
        if(collection.metadata.history.length != 0) {
            let ihis = 0;
            while(collection.metadata.history.length != ihis) {
                console.log("[2/3] Decryption History... " + ihis + "/" + collection.metadata.history.length);
                let dech = await decryptAES(collection.metadata.history[ihis], GlobalKey);
                collection.metadata.history[ihis] = dech;
                ihis++;
            }
        } else { console.log("No data in History array, skipping..."); }
        if(collection.metadata.GALLERY.length != 0) {
            let igal = 0;
            while(collection.metadata.GALLERY.length != igal) {
                console.log("[2/3] Decryption Gallery... " + igal + "/" + collection.metadata.GALLERY.length);
                let decg = await decryptAES(collection.metadata.GALLERY[igal], GlobalKey);
                collection.metadata.GALLERY[igal] = decg;
                igal++;
            }
        }
        hasBeenEncrypted = true;
        parseColl(2);
        showReadyTip();
        collection.encrypted = false;
    } catch (e) { console.error(e); }
    }
}


var Oldselector = document.createElement('input');
function convertCollection() {
    linkmodes.play()
    Oldselector.type = 'file';
    Oldselector.click();
}

Oldselector.onchange = (e) => {
    TodayDate = String(DatE.toLocaleString().split(',', 1));
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
        alert("Ошибка! Выберите файл.");
        console.log('Task failed: File not choosen.');
        return;
    }

    const reader = new FileReader();
    reader.readAsText(selectedFile, 'UTF-8');

    reader.onload = (readerEvent) => {
        const fileContent = readerEvent.target.result;
        let i = 0;
        while(fileContent.split("\n").length != i) {
            let lines = fileContent.split("\n");
            if(i == 0) {
                let OLDheader = lines[i].split("|");
                structure.name = OLDheader[0];
                structure.author = OLDheader[1];
                structure.dateOfEdit = OLDheader[2];
                i++;
            }
            else {
            lines[i] = String(lines[i]).replaceAll('Like', 'Понравилось').replaceAll('Done', 'Просмотрено').replaceAll('Dislike', 'Не понравилось').replaceAll('Inqueue', 'в очереди');
            structure.pieces.push(lines[i] + "|" + TodayDate + "|");
            i++;
            }
        }
        document.getElementById('debugdwn').click();

    };
    // error handler
    reader.onerror = () => {
        alert("Ошибка! Файл поврежден или некорректен.");
        console.log('Task failed: Unexpected error occured.');
    };
};

document.getElementById('debugdwn').onclick = function () {
    var csvData = 'data:application/txt;charset=utf-8,' + encodeURIComponent(JSON.stringify(structure));
    this.href = csvData;
    this.target = '_blank';
    this.download = String("converted.coll");
    console.log('[Task: Save list] Task finished.');
}

function createList() {
    let nm = document.getElementById('nlname');
    let auth = document.getElementById('nlauthor');
    closeNL();
    if(nm.value != "") {
        structure.name = nm.value;
    }
    if(auth.value != "") {
        structure.author = auth.value;
    }
    parseColl();
}

function searchForElm(input) {
    gallerylookupstatus = false;
    document.getElementById('filtgall').style.background = "rgba(255, 255, 255, 0.2)";
    unknownlookupstatus = false;
    document.getElementById('filtunk').style.background = "rgba(255, 255, 255, 0.2)";
    if(input.value == "") {
        parseColl(1);
    }
    else {
        let contentE = document.getElementById('piecesContainer');
        contentE.innerHTML = "";
        let i = 0;
        while(collection.pieces.length != i) {
            if(collection.pieces[i].includes(input.value) || i == Number(input.value)) {
            let piece = collection.pieces[i].split("|");
            let status;
                let statusmark;
                try {
                    statusmark = piece[3].replaceAll('\r', '');
                } catch (err) { console.log('Error handled: ' + err); };
                if(statusmark == "Просмотрено") {
                    status = "<img src='./res/ui/viewed.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                else if(statusmark == "В очереди") {
                    status = "<img src='./res/ui/bookmarked.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                else if(statusmark == "Понравилось") {
                    status = "<img src='./res/ui/favorite.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                else if(statusmark == "Не понравилось") {
                    status = "<img src='./res/ui/dislike.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                else {
                    status = "<img src='./res/ui/question.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                if(piece[1] == "") {
                    piece[1] = settings.TextPlaceholders.NoDescription;
                }  
                if(piece[2] == "") {
                    piece[2] = piece[1];
                }
                if(piece[4] == "") {
                    piece[4] =  settings.TextPlaceholders.NoDateAvaible;
                }
            contentE.innerHTML = contentE.innerHTML + "<div class='contentPiece' onclick='opendetails(&quot;" + encodeB(piece.join("|")) + "&quot;, " + i + ")'>" + status + "<h2 style='width: 75%; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;'>" + piece[0] + "</h2><p style='width: 60%; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;'>" + piece[2] + "</p><span class='countmark'>" + piece[4].replaceAll("undefined", "") + ", № " + i + "</span><br><span class='editTip'>" + settings.TextPlaceholders.EditTip + "</span></div><br>";
            i++;
            } else { i++; }
        }
    }
}

function selectTag(btn, tagNum) {
    if(tagNum == 1) {
        if(gallerylookupstatus == true) {
            gallerylookupstatus = false;
            document.getElementById('filtgall').style.background = "rgba(255, 255, 255, 0.2)";
            parseColl(5);
        }
        else {
            openGallery(1);
        }
        unknownlookupstatus = false;
        Inqueuelookupstatus = false;
        document.getElementById('filtunk').style.background = "rgba(255, 255, 255, 0.2)";
        document.getElementById('filtinq').style.background = "rgba(255, 255, 255, 0.2)";
    } else if(tagNum == 2) {
        if(unknownlookupstatus == true) {
            unknownlookupstatus = false;
            document.getElementById('filtunk').style.background = "rgba(255, 255, 255, 0.2)";
            parseColl(6);
        }
        else {
            unknownlookupstatus = true;
            document.getElementById('filtunk').style.background = "var(--style-col)";
            let contentE = document.getElementById('piecesContainer');
        contentE.innerHTML = "";
        let i = 0;
        while(collection.pieces.length != i) {
            let piece = collection.pieces[i].split("|");
            let status;
            if(piece[3] != "Просмотрено" && piece[3] != "В очереди" && piece[3] != "Понравилось" && piece[3] != "Не понравилось") {
                let statusmark;
                try {
                    statusmark = piece[3].replaceAll('\r', '');
                } catch (err) { console.log('Error handled: ' + err); };
                if(statusmark == "Просмотрено") {
                    status = "<img src='./res/ui/viewed.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                else if(statusmark == "В очереди") {
                    status = "<img src='./res/ui/bookmarked.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                else if(statusmark == "Понравилось") {
                    status = "<img src='./res/ui/favorite.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                else if(statusmark == "Не понравилось") {
                    status = "<img src='./res/ui/dislike.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                else {
                    status = "<img src='./res/ui/question.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                if(piece[1] == "") {
                    piece[1] = settings.TextPlaceholders.NoDescription;
                }  
                if(piece[2] == "") {
                    piece[2] = piece[1];
                }
                if(piece[4] == "") {
                    piece[4] =  settings.TextPlaceholders.NoDateAvaible;
                }
            contentE.innerHTML = contentE.innerHTML + "<div class='contentPiece' onclick='opendetails(&quot;" + encodeB(piece.join("|")) + "&quot;, " + i + ")'>" + status + "<h2 style='width: 75%; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;'>" + piece[0] + "</h2><p style='width: 60%; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;'>" + piece[2] + "</p><span class='countmark'>" + piece[4].replaceAll("undefined", "") + ", № " + i + "</span><br><span class='editTip'>" + settings.TextPlaceholders.EditTip + "</span></div><br>";
            i++;
            } else { i++; }
        }

        }
        gallerylookupstatus = false;
        Inqueuelookupstatus = false;
        document.getElementById('filtgall').style.background = "rgba(255, 255, 255, 0.2)";
        document.getElementById('filtinq').style.background = "rgba(255, 255, 255, 0.2)";
    }
    else if(tagNum == 3) {
        if(Inqueuelookupstatus == true) {
            Inqueuelookupstatus = false;
            btn.style.background = "rgba(255, 255, 255, 0.2)";
            parseColl(6);
        }
        else {
            Inqueuelookupstatus = true;
            btn.style.background = "var(--style-col)";
            let contentE = document.getElementById('piecesContainer');
        contentE.innerHTML = "";
        let i = 0;
        while(collection.pieces.length != i) {
            let piece = collection.pieces[i].split("|");
            let status;
            if(piece[3] == "В очереди") {
                let statusmark;
                try {
                    statusmark = piece[3].replaceAll('\r', '');
                } catch (err) { console.log('Error handled: ' + err); };
                if(statusmark == "Просмотрено") {
                    status = "<img src='./res/ui/viewed.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                else if(statusmark == "В очереди") {
                    status = "<img src='./res/ui/bookmarked.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                else if(statusmark == "Понравилось") {
                    status = "<img src='./res/ui/favorite.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                else if(statusmark == "Не понравилось") {
                    status = "<img src='./res/ui/dislike.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                else {
                    status = "<img src='./res/ui/question.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                if(piece[1] == "") {
                    piece[1] = settings.TextPlaceholders.NoDescription;
                }  
                if(piece[2] == "") {
                    piece[2] = piece[1];
                }
                if(piece[4] == "") {
                    piece[4] =  settings.TextPlaceholders.NoDateAvaible;
                }
            contentE.innerHTML = contentE.innerHTML + "<div class='contentPiece' onclick='opendetails(&quot;" + encodeB(piece.join("|")) + "&quot;, " + i + ")'>" + status + "<h2 style='width: 75%; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;'>" + piece[0] + "</h2><p style='width: 60%; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;'>" + piece[2] + "</p><span class='countmark'>" + piece[4].replaceAll("undefined", "") + ", № " + i + "</span><br><span class='editTip'>" + settings.TextPlaceholders.EditTip + "</span></div><br>";
            i++;
            } else { i++; }
        }

        }
        gallerylookupstatus = false;
        unknownlookupstatus = false;
        document.getElementById('filtgall').style.background = "rgba(255, 255, 255, 0.2)";
        document.getElementById('filtunk').style.background = "rgba(255, 255, 255, 0.2)";
    }
    else if(tagNum == 4) {
        btn.style.background = "var(--style-col)";
        btn.style.scale = "0.98";
        setTimeout(
            function () {
                btn.style.background = "rgba(255, 255, 255, 0.2)";
                btn.style.scale = "1";
            }, 500
        );
        opendetails(encodeB("Имя элемента||||" + TodayDate), "NULL");
    }
}

function Gallerylook(galnums) {
    let contentE = document.getElementById('piecesContainer');
        contentE.innerHTML = "";
        let i = 0;
        while(collection.pieces.length != i) {
            let piece = collection.pieces[i].split("|");
            let status;
            if(piece[5] == "") {
                i++;
            }
            else if(piece[5] == Number(galnums)) {
                let statusmark;
                try {
                    statusmark = piece[3].replaceAll('\r', '');
                } catch (err) { console.log('Error handled: ' + err); };
                if(statusmark == "Просмотрено") {
                    status = "<img src='./res/ui/viewed.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                else if(statusmark == "В очереди") {
                    status = "<img src='./res/ui/bookmarked.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                else if(statusmark == "Понравилось") {
                    status = "<img src='./res/ui/favorite.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                else if(statusmark == "Не понравилось") {
                    status = "<img src='./res/ui/dislike.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                else {
                    status = "<img src='./res/ui/question.png' style='margin-right: 5px;' width='50' align='left'>";
                }
                if(piece[1] == "") {
                    piece[1] = settings.TextPlaceholders.NoDescription;
                }  
                if(piece[2] == "") {
                    piece[2] = piece[1];
                }
                if(piece[4] == "") {
                    piece[4] =  settings.TextPlaceholders.NoDateAvaible;
                }
            contentE.innerHTML = contentE.innerHTML + "<div class='contentPiece' onclick='opendetails(&quot;" + encodeB(piece.join("|")) + "&quot;, " + i + ")'>" + status + "<h2 style='width: 75%; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;'>" + piece[0] + "</h2><p style='width: 60%; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;'>" + piece[2] + "</p><span class='countmark'>" + piece[4].replaceAll("undefined", "") + ", № " + i + "</span><br><span class='editTip'>" + settings.TextPlaceholders.EditTip + "</span></div><br>";
            i++;
            } else { i++; }
        }
    document.getElementById('filtgall').style.background = "var(--style-col)";
    gallerylookupstatus = true;
}

function restoreElm(hiselm, item, hisI) {
    let restoreData = decodeB(hiselm).split("$");
    collection.pieces.splice(restoreData[0], 0, restoreData[1]);
    item.style.display = "none";
    collection.metadata.history.splice(hisI, 1);
    unsaved.push(String("Восстановление элемента №" + restoreData[0] + "."));
    unsavedChangesTracker();
    parseColl(7);
    renderSettingsLIST();
}

function sanitizeFilename(filename) {
  if (typeof filename !== 'string') return '';
  let sanitized = filename.replaceAll('/[\\/:*?"<>|[\x00-\x1F\x7F]/g', '');
  sanitized = sanitized.replaceAll('/[. ]+$/g', '');
  return sanitized.length > 0 ? sanitized : 'your-collection';
}

let filenameX, exts;
async function SaveCollection() {
    collection.LLReXVERSION = version;
    unsaved.length = 0;
    unsavedChangesTracker();
    if(hasBeenEncrypted == false) {
        let encinput = document.getElementById("passForEnc").value;
        if(encinput.length != 0) {
            try {
            await encryptParts();
            } catch (e) {
                console.error("Saving process break: Encryption failed.");
                return 0;
            }
        }
    }
    else if(hasBeenEncrypted == true) {
        await encryptParts(1);
    }
    filenameX = sanitizeFilename(document.getElementById('saname').value);
    exts = document.getElementById('extsel').value;
    document.getElementById('dwn').click();
    closeSaveAs();
}

function unsavedChangesTracker() {
    let CollName = document.getElementById('headerCollName');
    if(unsaved.length > 0) {
        CollName.style.fontStyle = "oblique";
        CollName.innerHTML = collection.name + shieldIco + " <img src='./res/ui/inprog.png' class='icon' style='translate: 0 -3.5px; margin-right: 2px;'>";
        hasUnsavedChanges = true;
    }
    else {
        CollName.style.fontStyle = "normal";
        CollName.innerHTML = collection.name;
        hasUnsavedChanges = false;
    }
}