const settings = {

    // Path to background. If changed can cause errors. root directory: "./".
    "bgpath": "./res/ui/bg.svg",

    "styleColor": "blueviolet",
    
    // Path to collection that will be loaded on opening Lunar Lists. Works only with server or .js collection.
    // If left empty skips autoload.
    "preloadCollPath": "",

    // UI sounds settings
    "UISFX": {

        // Enabling or disalbling sound
        "state": true,

        // bgsong is an array with 2 settings:
        // 1. state (true to enable, flase to disable)
        // 2. path to song
        "bgsong": [true, "./res/sfx/bgsound.mp3"],

        // Path to the clicks sounds
        "UIClick": "./res/sfx/click.flac",

        "UIImportClick": "./res/sfx/import.flac",

        "UIUseBannerClick": "./res/sfx/usepic.flac",

        "UIDelete": "./res/sfx/delete.mp3",

        "UISettings": "./res/sfx/settings.flac",

        "UIlinkmode": "./res/sfx/linkmode.flac",

        // Volume? Just volume (0.0 - 0%, 1 - 100%)
        "masterVolume": 0.1
    },
    "TextPlaceholders": {
        // desired font for app. (Only HTML supported ones)
        "Font": "Segoe UI",

        // If no Date provided this text will show up.
        "NoDateAvaible": "??.??.????",
        // Right panel placeholder title & subtext
        "EditPieceTitle": ["Выберите элемент","Из вашего списка чтобы увидеть подробности или изменить его.", "Из вашего списка чтобы перейти по ссылке."],
        // If no Description provided this text will show up
        "NoDescription": "Описания/Ссылки нет.",
        // Right bar header text
        "CurrentPieceTitle": "Редактировать этот элемент",
        // Bottom button text (in right bar)
        "ApplyChangesButton": "Подтвердить",
        // Collection Settings text
        "ListSettAbout": "Информация о загруженной коллекции",
        // This text will show up if collection has no history records.
        "NoHistory": "У данной коллекции еще нет истории действий.",

        "EditTip": "Нажмите для правки ->",

        "HeaderListDescription": ["Создал ", ", последнее изменение: "],

        "ListSettingsTexts": ["Имя коллекции: ", "Автор коллекции: ", "Дата последних изменений: ", "Поддерживаемая версия Lunar Lists: ",],

        "FilterBarPlaceholder": "Введите название, дату, ссылку, тег, номер в списке или комментарий"

    }
}