let bglink = settings.bgpath;
let pEphld = "";
let logo = document.getElementById('Headerlogo');
let iconCREATE = "<img src='./res/ui/create.png' style='margin-right: 5px; translate: 0 2.5px;' width='50' align='left'>";
let iconDESC = "<img src='./res/ui/com.png' class='icon'>";
let iconLINK = "<img src='./res/ui/link.png' class='icon'>";
let iconSTATUS = "<img src='./res/ui/load.png' class='icon'>";
let iconCOLNAME = "<img src='./res/ui/load.png' class='icon' style='filter: invert(); width: 25px; translate: 0 -1px;'>";
let iconCOLAUTHOR = "<img src='./res/ui/favorite.png' class='icon' style='filter: invert(); width: 21px; translate: 0 -1px;'>";
let iconCOLDATE = "<img src='./res/ui/bookmarked.png' class='icon' style='filter: invert(); translate: 0 -1px; margin-right: 2px;'>";
let iconCOLVERS = "<img src='./res/ui/vers.png' class='icon' style='filter: invert(); translate: 0 -1px; margin-right: 2px;'>";
let iconTrash = "<img src='./res/ui/delete.png' class='icon' style='filter: invert();'>";
let iconDATEOFWATCH = "<img src='./res/ui/history.png' class='icon'>";
let linkmodetip = "";
let delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let BANNERLOC = "<div onclick='openGallery()' class='editortile' style='text-align: center; background: rgba(255,255,255,0.2); backdrop-filter: blur(5px); border-radius: 10px;'><br><img src='./res/ui/create.png'><br><span>Добавить баннер</span><br><br></div><br>";
window.onload = function () {
    document.getElementById("bg").style.backgroundImage = "url(" + bglink + ")";
    document.getElementById("bg").style.filter = "brightness(1)";
    document.documentElement.style.setProperty("--style-col", settings.styleColor);
    document.documentElement.style.setProperty("--font-Fam", settings.TextPlaceholders.Font);
}

document.addEventListener('keydown', function linkmodeSwitch(event) {
    let elements = document.querySelectorAll('.contentPiece');
    let edittip = this.documentElement.querySelectorAll('.editTip');
    if (event.code == "Escape") {

        if(linkmode == true) {
            elements.forEach(element => { element.style.background = "rgba(255, 255, 255, 0.2)"; });
            edittip.forEach(element => { element.style.display = "block"; });
            document.getElementById('filter').style.opacity = "100%";
            linkmode = false;
            document.getElementById("pieceEditor").innerHTML = pEphld;
        }
        else {
            pEphld = document.getElementById("pieceEditor").innerHTML;
            document.getElementById("pieceEditor").innerHTML = "<div id='placeolderEditor' style='text-align: center;'><img src='./res/ui/link.png' style='padding: 5px;'><h2>" + settings.TextPlaceholders.EditPieceTitle[0] + "</h2><p style='font-size:14px; padding:7px;'>" + settings.TextPlaceholders.EditPieceTitle[2] + "</p></div>";
            elements.forEach(element => { element.style.background = "rgba(255, 255, 255, 0.5)"; });
            edittip.forEach(element => { element.style.display = "none"; });
            document.getElementById('filter').style.opacity = "70%";
            linkmode = true;
            linkmodes.play();
        }
  } else {
    elements.forEach(element => { element.style.background = "rgba(255, 255, 255, 0.2)"; });
    linkmode = false;
  }
});

function hideLOGO() {
    logo.style.animation = "hidelogo 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    let bgcolbefore = header.style.background;
    let bgtrnbefore = header.style.backdropFilter;
    header.style.background = "transparent";
    setTimeout(function () {
        let bkmrk = "<img src='./res/ui/list.png' width='50' style='float: left; animation: listappear 1s cubic-bezier(0.165, 0.84, 0.44, 1);'>"
        logo.style.display = "none";
        header.style.textAlign = 'left';
        header.style.borderRadius = "0 0 20px 20px";
        header.style.background = bgcolbefore;
        header.style.backdropFilter = bgtrnbefore;
        header.innerHTML = "";
        header.innerHTML = header.innerHTML + bkmrk + "<div style='margin-left: 35px;'><h2>" + collection.name + "</h2><span>Создал " + collection.author + ", последнее изменение: " + collection.dateOfEdit + "</span><br><hr style='opacity: 0;'></div>";
        header.innerHTML = header.innerHTML + "<div id='headerSettings'><div class='headerButton' onclick='saveColl()'><img src='./res/ui/save.png' width='50'></div><div class='headerButton' onclick='openListSettings()'><img src='./res/ui/settings.png' width='50'></div>";
    }, 1010 );
}
function closeGallery() {
    document.getElementById('gallerySplash').style.opacity = 0;
    setTimeout(
        function () {
            document.getElementById('gallerySplash').style.display = "none";
        }, 550
    );
}
function openGallery(ns) {
    refreshGallery(ns);
    document.getElementById('gallerySplash').style.display = "block";
    setTimeout(
        function () {
            document.getElementById('gallerySplash').style.opacity = 100;
        }, 1
    );
}
function closeAbout() {
    document.getElementById('aboutSplash').style.opacity = 0;
    setTimeout(
        function () {
            document.getElementById('aboutSplash').style.display = "none";
        }, 550
    );
}
function openAbout() {
    document.getElementById('aboutSplash').style.display = "block";
    setTimeout(
        function () {
            document.getElementById('aboutSplash').style.opacity = 100;
        }, 1
    );
}
function openListSettings() {
    setts.play();
    document.getElementById('listSettSplash').style.display = "block";
    setTimeout(
        function () {
            document.getElementById('listSettSplash').style.opacity = 100;
        }, 1
    );
    renderSettingsLIST();
}
function closeListSettings() {
    document.getElementById('listSettSplash').style.opacity = 0;
    setTimeout(
        function () {
            document.getElementById('listSettSplash').style.display = "none";
        }, 550
    );
}
// thx to js stupicidy i need to use async subfunc... genius 
async function hidelinkmodetip() {
    await delay(2400);
    document.getElementById('linkmodetip').style.opacity = 0;
    await delay(1000);
    document.getElementById('linkmodetip').style.display = "none";
}

async function openimporttip() {
    document.getElementById('importTip').style.display = "block";
    await delay(10);
    document.getElementById('importTip').style.opacity = 100;
    await delay(1000);
    document.getElementById('importTip').style.opacity = 0;
    await delay(1000);
    document.getElementById('importTip').style.display = "none";
}

function openNL() {
    galclk.play();
    document.getElementById('NewListSplash').style.display = "block";
    setTimeout(
        function () {
            document.getElementById('NewListSplash').style.opacity = 100;
        }, 1
    );
}
function closeNL() {
    document.getElementById('NewListSplash').style.opacity = 0;
    setTimeout(
        function () {
            document.getElementById('NewListSplash').style.display = "none";
        }, 550
    );
}
