let input = document.getElementById('fileinput');
let collection;
let collectiondec;
let mod = [];
let date = new Date();
let text;
let header;
input.onchange = (e) => {
    document.getElementById('head').innerText = 'Получение файла ".collection"... ';
    // Получаем выбранный файл
    const selectedFile = e.target.files[0];
    
    // Проверяем, выбран ли файл
    if (!selectedFile) {
        document.getElementById('head').innerText = "Ошибка: Операция выбора файла отменена.";
        return;
    }

    // Создаем ридер для чтения файла
    const reader = new FileReader();

    // Настраиваем способ чтения файла
    reader.readAsText(selectedFile, 'UTF-8');

    // Обработчик завершения чтения
    reader.onload = (readerEvent) => {
        const fileContent = readerEvent.target.result;
        collection = fileContent;
        parseColl();
    };

    // Обработчик ошибок
    reader.onerror = () => {
        document.getElementById('head').innerText = "Ошибка: Выбранный файл неподдерживается или поврежден.";
    };
};

function parseColl() {
    document.getElementById('addlist').style.display = "none";
    document.getElementById('head').innerText = 'Декодирование файла ".collection"... ';
    let fileArray = collection.split('\n');
    console.log(fileArray)
    header = fileArray[0].split("|");
    collectiondec = fileArray;
    let list = collectiondec.slice(1);
    let c = 0;
    while(c != fileArray.length) {
        let piece = list[c].split("|");
        let status;
        let statusmark
        try {
            statusmark = piece[3].replaceAll('\r', '');
        } catch (err) {};
        if(statusmark == "Done") {
            status = "<img src='res/done.svg' style='filter:invert(); margin-right: 5px;' width='50' align='left'>";
        }
        else if(statusmark == "Inqueue") {
            status = "<img src='res/inqueue.svg' style='filter:invert(); margin-right: 5px;' width='50' align='left'>";
        }
        else if(statusmark == "Like") {
            status = "<img src='res/featured.svg' style='filter:invert(); margin-right: 5px;' width='50' align='left'>";
        }
        else if(statusmark == "Dislike") {
            status = "<img src='res/bad.svg' style='filter:invert(); margin-right: 5px;' width='50' align='left'>";
        }
        else {
            status = "<img src='res/question.svg' style='filter:invert(); margin-right: 5px;' width='50' align='left'>";
        }
        if(piece[1] == "") {
            piece[1] = "Описания/Ссылки нет.";
        }
        if(piece[2] == "") {
            piece[2] = piece[1];
        }
        document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + "<div id='contentpiece' onclick=openpiece('" + piece[1] + "')>" + status + "<b style='font-size: 20px;font-weight: lighter;'>" + piece[0] + "</b><p style='font-weight: lighter; opacity:75%;'>" + piece[2] + "</p></div><br>"; 
        c++;
        if(c == list.length) {
            document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + "<div id='addp' onclick='addpiece()'><img src='res/plus.svg' style='filter:invert(); margin-right: 10px;' width='50' align='left'><b style='font-size: 20px;font-weight: lighter;'>Добавить в коллекцию...</b><p style='font-weight: lighter; opacity:75%;'>Нажмите, чтобы добавить что-то новенькое!</p></div> <span id='auth' style='position: fixed; bottom: 5px; left: 50%; translate: -50%; opacity: 50%;'><img src='res/logo.svg' style='margin-right: 3px; filter: invert();' align='center' width='25'>Lunar Lists, © Wertywin2353 2026</span>";
            document.getElementById('head').innerHTML = "<div id='savebutton' onclick='savecoll()'><img src='res/save.svg' style='filter:invert();' width='45'></div><b style='font-size: 20px;font-weight: lighter;'>" + header[0] + "<b><br><p style='font-size: 17px; font-weight: lighter; opacity:75%;'>Создал " + header[1] + ", последнее обновление " + header[2] + "</p>";
        }
    }
}

function addpiece() {
    document.getElementById('addp').remove();
    document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + "<div id='confp'><form id='statform'><label>Статус: </label><select id='stat'><option value='Like'>Понравилось</option><option value='Dislike'>Не понравилось</option><option value='Inqueue'>В очереди</option><option value='Done'>Просмотрено</option></select></form><img src='res/plus.svg' onclick='confirmNewPiece()' style='filter:invert(); margin-right: 10px;' width='50' align='left'><input style='font-size: 20px;font-weight: lighter;' id='name' placeholder='Имя тайтла'><br><input id='link' style='font-weight: lighter;' placeholder='Ссылка'><input id='desc' style='font-weight: lighter;' placeholder='Краткое описание...'></div>";
}
function confirmNewPiece() {
    let name = document.getElementById('name').value;
    let link = document.getElementById('link').value;
    let desc = document.getElementById('desc').value;
    let statusChoice = document.querySelector('#stat').value;
    mod.push( name + '|' + link + '|' + desc + '|' + statusChoice);
    document.getElementById('confp').remove();
    let status;
        if(statusChoice == "Done") {
            status = "<img src='res/done.svg' width='50' style='filter:invert(); margin-right: 5px;' align='left'>";
        }
        else if(statusChoice == "Inqueue") {
            status = "<img src='res/inqueue.svg' style='filter:invert(); margin-right: 5px;' width='50' align='left'>";
        }
        else if(statusChoice == "Like") {
            status = "<img src='res/featured.svg' style='filter:invert(); margin-right: 5px;' width='50' align='left'>";
        }
        else if(statusChoice == "Dislike") {
            status = "<img src='res/bad.svg' style='filter:invert(); margin-right: 5px;' width='50' align='left'>";
        }
        else {
            status = "<img src='res/question.svg' style='filter:invert(); margin-right: 5px;' width='50' align='left'>";
    }
    document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + "<div id='contentpiece' onclick=openpiece('" + link + "')>" + status + "<b style='font-size: 20px;font-weight: lighter;'>" + name + "</b><p style='font-weight: lighter; opacity:75%;'>" + desc + "</p></div><br>"; 
    document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + "<div id='addp' onclick='addpiece()'><img src='res/plus.svg' style='filter:invert(); margin-right: 10px;' width='50' align='left'><b style='font-size: 20px;font-weight: lighter;'>Добавить в коллекцию...</b><p style='font-weight: lighter; opacity:75%;'>Нажмите, чтобы добавить что-то новенькое!</p></div>";

}

function savecoll() {
    let temparr = header;
    let tempdate = String(date.toLocaleString()).split(',');
    temparr[2] = tempdate[0]; 
    let part1 = temparr.join("|");
    let part2 = collectiondec.slice(1).join("\n") + "\n" + mod.join("\n");
    text = String(part1 + "\n" + part2);
    console.log(text);
    document.getElementById('dwn').click();
}

document.getElementById('dwn').onclick = function () {
    var csvData = 'data:application/txt;charset=utf-8,' + encodeURIComponent(text);
    this.href = csvData;
    this.target = '_blank';
    this.download = 'your.collection';
}

function openpiece(link) {
    window.location.href = link;
}