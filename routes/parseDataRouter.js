const parseDataRouter = require('express').Router();
var sql = require("mssql");
const config = require('../dbConfig')
const stringify = require('csv-stringify-as-promised');
const path = require('path');
const fs = require('fs');
const { TablesName } = require('../constant');
const { createNewTable, checkTable } = require('../helpers/helpers')

const parseData = async() => {
    try {
        const today = new Date()
        const prevDay = new Date(today.setDate(today.getDate() - 1))
        var suffix = `${prevDay.getDate()}_${prevDay.getMonth()+1}_${prevDay.getFullYear()}`
        let tableName = `data_transaction_${suffix}`
        var sqlConn = await sql.connect(config)
        if (sqlConn) {

            // get apps list from database
            var appsReq = new sql.Request()
            var appsQuery = `select app_name, packageName, category_name, apps_m.category_id, app_id from apps_m left join app_category_m on apps_m.category_id = app_category_m.id`
            var appsRes = await appsReq.query(appsQuery)
            var appsList = []
            if (appsRes && appsRes.recordset) {
                appsList = appsRes.recordset
            }

            let rawData = []
            var request = new sql.Request()
            var query = `select * from ${tableName} order by id`
            var response = await request.query(query)
            if (response && response.recordset) {
                rawData = response.recordset
            }
            let fnlDataTblName = `${TablesName.FINAL_DATA}_${suffix}`

            let isTbl = await checkTable(fnlDataTblName)
            if (!isTbl.error) {
                if (!isTbl.tableFound) {
                    await createNewTable(fnlDataTblName, TablesName.FINAL_DATA);
                } else if (isTbl.tableFound) {
                    console.log('Table with same name found of type ', TablesName.FINAL_DATA);
                }
            }
            
            // let csvData = []
            var insFinalDataReq = new sql.Request()
            const finalDataTbl = new sql.Table(fnlDataTblName) // or temporary table, e.g. #temptable
            finalDataTbl.create = true
            finalDataTbl.columns.add('data_transaction_id', sql.Int, {nullable: true})
            finalDataTbl.columns.add('user_id', sql.Int, {nullable: true})
            finalDataTbl.columns.add('category_id', sql.Int, {nullable: true})
            finalDataTbl.columns.add('app_id', sql.Int, {nullable: true})
            finalDataTbl.columns.add('pattern_id', sql.Int, {nullable: true})
            finalDataTbl.columns.add('event_info', sql.NVarChar(5000), {nullable: true})
            finalDataTbl.columns.add('package_name', sql.NVarChar(5000), {nullable: true})
            finalDataTbl.columns.add('data_text', sql.NVarChar(5000), {nullable: true})
            finalDataTbl.columns.add('data_description', sql.NVarChar(5000), {nullable: true})
            finalDataTbl.columns.add('event_time', sql.DateTimeOffset, {nullable: true})
            // columns = ['category_name', 'app_name', 'pattern_info', 'eventInfo', 'packageName', 'data_1_text', 'data_2_description', 'time']
            for (let i = 0; i < rawData.length; i++) {
                let d = rawData[i]
                let str = d.data
                // let str = `~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*525^text^[]^description^null^event_time^2022-12-16:19:10:0:882~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*522^text^[]^description^null^event_time^2022-12-16:19:10:1:522~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*522^text^[]^description^null^event_time^2022-12-16:19:10:1:805~NewEvent:event_info^com.sec.android.app.launcher*android.view.View*4*32*0*494^text^[]^description^null^event_time^2022-12-16:19:10:1:994~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.TextView*4*1*0*522^text^[Tathastu starts off with a recap of moments from Zakir's life. Starting from his early school days ,the performance is a ride where the audience gets a peek at the family he was born in, the characters he grew closest to and his young years bloated with aspirations of becoming an RJ. He goes onto share a few personal learnings on stage as he tries to make sense of his journey thus far.]^description^null^event_time^2022-12-16:19:10:2:690~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.TextView*4*1*0*522^text^[Tathastu starts off with a recap of moments from Zakir's life. Starting from his early school days ,the performance is a ride where the audience gets a peek at the family he was born in, the characters he grew closest to and his young years bloated with aspirations of becoming an RJ. He goes onto share a few personal learnings on stage as he tries to make sense of his journey thus far.]^description^null^event_time^2022-12-16:19:10:5:186~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.LinearLayout*4*1*0*522^text^[Tathastu, Included with Prime, Watch Now, Trailer, Download, Watchlist, More, Tathastu starts off with a recap of moments from Zakir's life. Starting from his early school days ,the performance is a ride where the audience gets a peek at the family he was born in, the characters he grew closest to and his young years bloated with aspirations of becoming an RJ. He goes onto share a few personal learnings on stage as he tries to make sense of his journey thus far., IMDb 9.3, Arts, Entertainment, and Culture, 2022, 93 min, A, subtitles and closed captions available, Languages: ,  , Audio (1), Subtitles (1)]^description^null^event_time^2022-12-16:19:10:8:977~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.view.ViewGroup*4*1*0*522^text^[Zakir Khan]^description^Zakir Khan. Button^event_time^2022-12-16:19:10:10:826~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*527^text^[]^description^null^event_time^2022-12-16:19:10:11:34~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*522^text^[]^description^null^event_time^2022-12-16:19:10:12:165~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*522^text^[]^description^null^event_time^2022-12-16:19:10:12:298~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*4*0*522^text^[Find]^description^Find^event_time^2022-12-16:19:10:12:431~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*1*0*522^text^[Find]^description^Find^event_time^2022-12-16:19:10:12:657~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*528^text^[]^description^null^event_time^2022-12-16:19:10:12:717~NewEvent:event_info^com.amazon.avod.thirdpartyclient*androidx.recyclerview.widget.RecyclerView*4*8*0*528^text^[]^description^null^event_time^2022-12-16:19:10:12:959~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.EditText*4*8*0*528^text^[Search by actor, title..]^description^Search Video Store. Search by actor, title..^event_time^2022-12-16:19:10:13:351~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*529^text^[]^description^null^event_time^2022-12-16:19:10:17:659~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.view.ViewGroup*4*1*0*529^text^[Tathastu, 2022, 93 min, Included with Prime, more options]^description^Tathastu. 2022. 93 min. Included with Prime^event_time^2022-12-16:19:10:18:840~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*530^text^[]^description^null^event_time^2022-12-16:19:10:19:204~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*529^text^[]^description^null^event_time^2022-12-16:19:10:20:464~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*531^text^[]^description^null^event_time^2022-12-16:19:10:21:523~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:22:509~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:22:861~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:23:660~NewEvent:event_info^com.sec.android.app.launcher*android.widget.FrameLayout*4*8*0*500^text^[Samsung, Camera, Clock, Contacts, Settings, Calendar, Calculator, Bixby, My Galaxy, AR Zone, Device care, Bixby Routines, Play Games, Tips, Samsung Max, Samsung Pay Mini, Drive, Chrome, Facebook, Galaxy Store, Gallery, Google, Play Store, Radio, Maps, Internet Speed Meter Lite, MX Player, Meet, Lens, Translate, Voice Recorder, Excel, Samsung Notes, Word, DigiLocker, Files, Chess, lichess, YouTube Vanced, MultiSpace, LinkedIn, InstaPro ♚, Naukri.com, Teams, Telegram, Prime Video, Shazam, Wynk Music, Gmail, BOI Mobile, BookMyShow, Airtel, GPay, Swiggy, Amazon, BHIM, Uber, Paytm, slice, Zomato, NTES, IRCTC Rail Connect, YONO SBI, comica, Lightroom, Collage Maker - GridArt, StoryArt, Snaptube, KineMaster, Sketch Photo, Sketch Photo Editor, Artist Grid, Vanced Manager, Free Adblocker Browser, Fake GPS, Truecaller, Digital Wellbeing, NoBroker, PhonePe, Skype, F-Droid, AdAway, Ola, Secure Folder, Bumble, PicSort Gallery, Usage Stats, OneCard, accessibilityserve, Eros Now, filecreate demo2, Myntra, Nykaa, JioMart, DMart Ready, Tata CLiQ, Tata Neu, Netflix, Trello, Hotstar, ZEE5, YouTube, JioSaavn, xManager, Spotify, redBus, Clash of Clans, Airtel Xstream, demoforapi, live_action_outer_side, Search, More options]^description^null^event_time^2022-12-16:19:10:23:720~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:25:773~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:26:749~NewEvent:event_info^com.sec.android.app.launcher*android.widget.FrameLayout*4*8*0*500^text^[Samsung, Camera, Clock, Contacts, Settings, Calendar, Calculator, Bixby, My Galaxy, AR Zone, Device care, Bixby Routines, Play Games, Tips, Samsung Max, Samsung Pay Mini, Drive, Chrome, Facebook, Galaxy Store, Gallery, Google, Play Store, Radio, Maps, Internet Speed Meter Lite, MX Player, Meet, Lens, Translate, Voice Recorder, Excel, Samsung Notes, Word, DigiLocker, Files, Chess, lichess, YouTube Vanced, MultiSpace, LinkedIn, InstaPro ♚, Naukri.com, Teams, Telegram, Prime Video, Shazam, Wynk Music, Gmail, BOI Mobile, BookMyShow, Airtel, GPay, Swiggy, Amazon, BHIM, Uber, Paytm, slice, Zomato, NTES, IRCTC Rail Connect, YONO SBI, comica, Lightroom, Collage Maker - GridArt, StoryArt, Snaptube, KineMaster, Sketch Photo, Sketch Photo Editor, Artist Grid, Vanced Manager, Free Adblocker Browser, Fake GPS, Truecaller, Digital Wellbeing, NoBroker, PhonePe, Skype, F-Droid, AdAway, Ola, Secure Folder, Bumble, PicSort Gallery, Usage Stats, OneCard, accessibilityserve, Eros Now, filecreate demo2, Myntra, Nykaa, JioMart, DMart Ready, Tata CLiQ, Tata Neu, Netflix, Trello, Hotstar, ZEE5, YouTube, JioSaavn, xManager, Spotify, redBus, Clash of Clans, Airtel Xstream, demoforapi, live_action_outer_side, Search, More options]^description^null^event_time^2022-12-16:19:10:26:780~NewEvent:event_info^com.sec.android.app.launcher*android.view.ViewGroup*4*8*0*500^text^[]^description^null^event_time^2022-12-16:19:10:29:194~NewEvent:event_info^com.sec.android.app.launcher*android.view.ViewGroup*4*8*0*500^text^[]^description^null^event_time^2022-12-16:19:10:30:540~NewEvent:event_info^com.sec.android.app.launcher*android.view.ViewGroup*4*8*0*500^text^[]^description^null^event_time^2022-12-16:19:10:31:185~NewEvent:event_info^com.sec.android.app.launcher*android.view.ViewGroup*4*8*0*500^text^[]^description^null^event_time^2022-12-16:19:10:31:748~NewEvent:event_info^com.sec.android.app.launcher*android.view.ViewGroup*4*8*0*500^text^[]^description^null^event_time^2022-12-16:19:10:32:700~NewEvent:event_info^com.sec.android.app.launcher*android.widget.TextView*4*1*0*500^text^[Samsung]^description^Samsung, Folder, 2 notifications^event_time^2022-12-16:19:10:32:947~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:33:344~NewEvent:event_info^com.sec.android.app.launcher*android.widget.TextView*4*1*0*500^text^[My Files]^description^My Files^event_time^2022-12-16:19:10:34:629`
                // let str = `~NewEvent:event_info^in.startv.hotstar*android.widget.FrameLayout*null*4*1*0*6899^text^[]^description^null^event_time^2022-12-16:19:10:0:882~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*522^text^[]^description^null^event_time^2022-12-16:19:10:1:522~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*522^text^[]^description^null^event_time^2022-12-16:19:10:1:805~NewEvent:event_info^com.sec.android.app.launcher*android.view.View*4*32*0*494^text^[]^description^null^event_time^2022-12-16:19:10:1:994~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.TextView*4*1*0*522^text^[Tathastu starts off with a recap of moments from Zakir's life. Starting from his early school days ,the performance is a ride where the audience gets a peek at the family he was born in, the characters he grew closest to and his young years bloated with aspirations of becoming an RJ. He goes onto share a few personal learnings on stage as he tries to make sense of his journey thus far.]^description^null^event_time^2022-12-16:19:10:2:690~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.TextView*4*1*0*522^text^[Tathastu starts off with a recap of moments from Zakir's life. Starting from his early school days ,the performance is a ride where the audience gets a peek at the family he was born in, the characters he grew closest to and his young years bloated with aspirations of becoming an RJ. He goes onto share a few personal learnings on stage as he tries to make sense of his journey thus far.]^description^null^event_time^2022-12-16:19:10:5:186~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.LinearLayout*4*1*0*522^text^[Tathastu, Included with Prime, Watch Now, Trailer, Download, Watchlist, More, Tathastu starts off with a recap of moments from Zakir's life. Starting from his early school days ,the performance is a ride where the audience gets a peek at the family he was born in, the characters he grew closest to and his young years bloated with aspirations of becoming an RJ. He goes onto share a few personal learnings on stage as he tries to make sense of his journey thus far., IMDb 9.3, Arts, Entertainment, and Culture, 2022, 93 min, A, subtitles and closed captions available, Languages: ,  , Audio (1), Subtitles (1)]^description^null^event_time^2022-12-16:19:10:8:977~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.view.ViewGroup*4*1*0*522^text^[Zakir Khan]^description^Zakir Khan. Button^event_time^2022-12-16:19:10:10:826~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*527^text^[]^description^null^event_time^2022-12-16:19:10:11:34~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*522^text^[]^description^null^event_time^2022-12-16:19:10:12:165~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*522^text^[]^description^null^event_time^2022-12-16:19:10:12:298~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*4*0*522^text^[Find]^description^Find^event_time^2022-12-16:19:10:12:431~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*1*0*522^text^[Find]^description^Find^event_time^2022-12-16:19:10:12:657~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*528^text^[]^description^null^event_time^2022-12-16:19:10:12:717~NewEvent:event_info^com.amazon.avod.thirdpartyclient*androidx.recyclerview.widget.RecyclerView*4*8*0*528^text^[]^description^null^event_time^2022-12-16:19:10:12:959~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.EditText*4*8*0*528^text^[Search by actor, title..]^description^Search Video Store. Search by actor, title..^event_time^2022-12-16:19:10:13:351~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*529^text^[]^description^null^event_time^2022-12-16:19:10:17:659~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.view.ViewGroup*4*1*0*529^text^[Tathastu, 2022, 93 min, Included with Prime, more options]^description^Tathastu. 2022. 93 min. Included with Prime^event_time^2022-12-16:19:10:18:840~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*530^text^[]^description^null^event_time^2022-12-16:19:10:19:204~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*529^text^[]^description^null^event_time^2022-12-16:19:10:20:464~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*531^text^[]^description^null^event_time^2022-12-16:19:10:21:523~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:22:509~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:22:861~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:23:660~NewEvent:event_info^com.sec.android.app.launcher*android.widget.FrameLayout*4*8*0*500^text^[Samsung, Camera, Clock, Contacts, Settings, Calendar, Calculator, Bixby, My Galaxy, AR Zone, Device care, Bixby Routines, Play Games, Tips, Samsung Max, Samsung Pay Mini, Drive, Chrome, Facebook, Galaxy Store, Gallery, Google, Play Store, Radio, Maps, Internet Speed Meter Lite, MX Player, Meet, Lens, Translate, Voice Recorder, Excel, Samsung Notes, Word, DigiLocker, Files, Chess, lichess, YouTube Vanced, MultiSpace, LinkedIn, InstaPro ♚, Naukri.com, Teams, Telegram, Prime Video, Shazam, Wynk Music, Gmail, BOI Mobile, BookMyShow, Airtel, GPay, Swiggy, Amazon, BHIM, Uber, Paytm, slice, Zomato, NTES, IRCTC Rail Connect, YONO SBI, comica, Lightroom, Collage Maker - GridArt, StoryArt, Snaptube, KineMaster, Sketch Photo, Sketch Photo Editor, Artist Grid, Vanced Manager, Free Adblocker Browser, Fake GPS, Truecaller, Digital Wellbeing, NoBroker, PhonePe, Skype, F-Droid, AdAway, Ola, Secure Folder, Bumble, PicSort Gallery, Usage Stats, OneCard, accessibilityserve, Eros Now, filecreate demo2, Myntra, Nykaa, JioMart, DMart Ready, Tata CLiQ, Tata Neu, Netflix, Trello, Hotstar, ZEE5, YouTube, JioSaavn, xManager, Spotify, redBus, Clash of Clans, Airtel Xstream, demoforapi, live_action_outer_side, Search, More options]^description^null^event_time^2022-12-16:19:10:23:720~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:25:773~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:26:749~NewEvent:event_info^com.sec.android.app.launcher*android.widget.FrameLayout*4*8*0*500^text^[Samsung, Camera, Clock, Contacts, Settings, Calendar, Calculator, Bixby, My Galaxy, AR Zone, Device care, Bixby Routines, Play Games, Tips, Samsung Max, Samsung Pay Mini, Drive, Chrome, Facebook, Galaxy Store, Gallery, Google, Play Store, Radio, Maps, Internet Speed Meter Lite, MX Player, Meet, Lens, Translate, Voice Recorder, Excel, Samsung Notes, Word, DigiLocker, Files, Chess, lichess, YouTube Vanced, MultiSpace, LinkedIn, InstaPro ♚, Naukri.com, Teams, Telegram, Prime Video, Shazam, Wynk Music, Gmail, BOI Mobile, BookMyShow, Airtel, GPay, Swiggy, Amazon, BHIM, Uber, Paytm, slice, Zomato, NTES, IRCTC Rail Connect, YONO SBI, comica, Lightroom, Collage Maker - GridArt, StoryArt, Snaptube, KineMaster, Sketch Photo, Sketch Photo Editor, Artist Grid, Vanced Manager, Free Adblocker Browser, Fake GPS, Truecaller, Digital Wellbeing, NoBroker, PhonePe, Skype, F-Droid, AdAway, Ola, Secure Folder, Bumble, PicSort Gallery, Usage Stats, OneCard, accessibilityserve, Eros Now, filecreate demo2, Myntra, Nykaa, JioMart, DMart Ready, Tata CLiQ, Tata Neu, Netflix, Trello, Hotstar, ZEE5, YouTube, JioSaavn, xManager, Spotify, redBus, Clash of Clans, Airtel Xstream, demoforapi, live_action_outer_side, Search, More options]^description^null^event_time^2022-12-16:19:10:26:780~NewEvent:event_info^com.sec.android.app.launcher*android.view.ViewGroup*4*8*0*500^text^[]^description^null^event_time^2022-12-16:19:10:29:194~NewEvent:event_info^com.sec.android.app.launcher*android.view.ViewGroup*4*8*0*500^text^[]^description^null^event_time^2022-12-16:19:10:30:540~NewEvent:event_info^com.sec.android.app.launcher*android.view.ViewGroup*4*8*0*500^text^[]^description^null^event_time^2022-12-16:19:10:31:185~NewEvent:event_info^com.sec.android.app.launcher*android.view.ViewGroup*4*8*0*500^text^[]^description^null^event_time^2022-12-16:19:10:31:748~NewEvent:event_info^com.sec.android.app.launcher*android.view.ViewGroup*4*8*0*500^text^[]^description^null^event_time^2022-12-16:19:10:32:700~NewEvent:event_info^com.sec.android.app.launcher*android.widget.TextView*4*1*0*500^text^[Samsung]^description^Samsung, Folder, 2 notifications^event_time^2022-12-16:19:10:32:947~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:33:344~NewEvent:event_info^com.sec.android.app.launcher*android.widget.TextView*4*1*0*500^text^[My Files]^description^My Files^event_time^2022-12-16:19:10:34:629`
                // let str = `~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*525^text^[]^description^null^event_time^2022-12-16:19:10:0:882~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*522^text^[]^description^null^event_time^2022-12-16:19:10:1:522~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*522^text^[]^description^null^event_time^2022-12-16:19:10:1:805~NewEvent:event_info^com.sec.android.app.launcher*android.view.View*4*32*0*494^text^[]^description^null^event_time^2022-12-16:19:10:1:994~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.TextView*4*1*0*522^text^[Tathastu starts off with a recap of moments from Zakir's life. Starting from his early school days ,the performance is a ride where the audience gets a peek at the family he was born in, the characters he grew closest to and his young years bloated with aspirations of becoming an RJ. He goes onto share a few personal learnings on stage as he tries to make sense of his journey thus far.]^description^null^event_time^2022-12-16:19:10:2:690~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.TextView*4*1*0*522^text^[Tathastu starts off with a recap of moments from Zakir's life. Starting from his early school days ,the performance is a ride where the audience gets a peek at the family he was born in, the characters he grew closest to and his young years bloated with aspirations of becoming an RJ. He goes onto share a few personal learnings on stage as he tries to make sense of his journey thus far.]^description^null^event_time^2022-12-16:19:10:5:186~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.LinearLayout*4*1*0*522^text^[Tathastu, Included with Prime, Watch Now, Trailer, Download, Watchlist, More, Tathastu starts off with a recap of moments from Zakir's life. Starting from his early school days ,the performance is a ride where the audience gets a peek at the family he was born in, the characters he grew closest to and his young years bloated with aspirations of becoming an RJ. He goes onto share a few personal learnings on stage as he tries to make sense of his journey thus far., IMDb 9.3, Arts, Entertainment, and Culture, 2022, 93 min, A, subtitles and closed captions available, Languages: ,  , Audio (1), Subtitles (1)]^description^null^event_time^2022-12-16:19:10:8:977~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.view.ViewGroup*4*1*0*522^text^[Zakir Khan]^description^Zakir Khan. Button^event_time^2022-12-16:19:10:10:826~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*527^text^[]^description^null^event_time^2022-12-16:19:10:11:34~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*522^text^[]^description^null^event_time^2022-12-16:19:10:12:165~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*522^text^[]^description^null^event_time^2022-12-16:19:10:12:298~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*4*0*522^text^[Find]^description^Find^event_time^2022-12-16:19:10:12:431~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*1*0*522^text^[Find]^description^Find^event_time^2022-12-16:19:10:12:657~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*528^text^[]^description^null^event_time^2022-12-16:19:10:12:717~NewEvent:event_info^com.amazon.avod.thirdpartyclient*androidx.recyclerview.widget.RecyclerView*4*8*0*528^text^[]^description^null^event_time^2022-12-16:19:10:12:959~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.EditText*4*8*0*528^text^[Search by actor, title..]^description^Search Video Store. Search by actor, title..^event_time^2022-12-16:19:10:13:351~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*529^text^[]^description^null^event_time^2022-12-16:19:10:17:659~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.view.ViewGroup*4*1*0*529^text^[Tathastu, 2022, 93 min, Included with Prime, more options]^description^Tathastu. 2022. 93 min. Included with Prime^event_time^2022-12-16:19:10:18:840~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*530^text^[]^description^null^event_time^2022-12-16:19:10:19:204~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*529^text^[]^description^null^event_time^2022-12-16:19:10:20:464~NewEvent:event_info^com.amazon.avod.thirdpartyclient*android.widget.FrameLayout*4*32*0*531^text^[]^description^null^event_time^2022-12-16:19:10:21:523~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:22:509~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:22:861~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:23:660~NewEvent:event_info^com.sec.android.app.launcher*android.widget.FrameLayout*4*8*0*500^text^[Samsung, Camera, Clock, Contacts, Settings, Calendar, Calculator, Bixby, My Galaxy, AR Zone, Device care, Bixby Routines, Play Games, Tips, Samsung Max, Samsung Pay Mini, Drive, Chrome, Facebook, Galaxy Store, Gallery, Google, Play Store, Radio, Maps, Internet Speed Meter Lite, MX Player, Meet, Lens, Translate, Voice Recorder, Excel, Samsung Notes, Word, DigiLocker, Files, Chess, lichess, YouTube Vanced, MultiSpace, LinkedIn, InstaPro ♚, Naukri.com, Teams, Telegram, Prime Video, Shazam, Wynk Music, Gmail, BOI Mobile, BookMyShow, Airtel, GPay, Swiggy, Amazon, BHIM, Uber, Paytm, slice, Zomato, NTES, IRCTC Rail Connect, YONO SBI, comica, Lightroom, Collage Maker - GridArt, StoryArt, Snaptube, KineMaster, Sketch Photo, Sketch Photo Editor, Artist Grid, Vanced Manager, Free Adblocker Browser, Fake GPS, Truecaller, Digital Wellbeing, NoBroker, PhonePe, Skype, F-Droid, AdAway, Ola, Secure Folder, Bumble, PicSort Gallery, Usage Stats, OneCard, accessibilityserve, Eros Now, filecreate demo2, Myntra, Nykaa, JioMart, DMart Ready, Tata CLiQ, Tata Neu, Netflix, Trello, Hotstar, ZEE5, YouTube, JioSaavn, xManager, Spotify, redBus, Clash of Clans, Airtel Xstream, demoforapi, live_action_outer_side, Search, More options]^description^null^event_time^2022-12-16:19:10:23:720~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:25:773~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:26:749~NewEvent:event_info^com.sec.android.app.launcher*android.widget.FrameLayout*4*8*0*500^text^[Samsung, Camera, Clock, Contacts, Settings, Calendar, Calculator, Bixby, My Galaxy, AR Zone, Device care, Bixby Routines, Play Games, Tips, Samsung Max, Samsung Pay Mini, Drive, Chrome, Facebook, Galaxy Store, Gallery, Google, Play Store, Radio, Maps, Internet Speed Meter Lite, MX Player, Meet, Lens, Translate, Voice Recorder, Excel, Samsung Notes, Word, DigiLocker, Files, Chess, lichess, YouTube Vanced, MultiSpace, LinkedIn, InstaPro ♚, Naukri.com, Teams, Telegram, Prime Video, Shazam, Wynk Music, Gmail, BOI Mobile, BookMyShow, Airtel, GPay, Swiggy, Amazon, BHIM, Uber, Paytm, slice, Zomato, NTES, IRCTC Rail Connect, YONO SBI, comica, Lightroom, Collage Maker - GridArt, StoryArt, Snaptube, KineMaster, Sketch Photo, Sketch Photo Editor, Artist Grid, Vanced Manager, Free Adblocker Browser, Fake GPS, Truecaller, Digital Wellbeing, NoBroker, PhonePe, Skype, F-Droid, AdAway, Ola, Secure Folder, Bumble, PicSort Gallery, Usage Stats, OneCard, accessibilityserve, Eros Now, filecreate demo2, Myntra, Nykaa, JioMart, DMart Ready, Tata CLiQ, Tata Neu, Netflix, Trello, Hotstar, ZEE5, YouTube, JioSaavn, xManager, Spotify, redBus, Clash of Clans, Airtel Xstream, demoforapi, live_action_outer_side, Search, More options]^description^null^event_time^2022-12-16:19:10:26:780~NewEvent:event_info^com.sec.android.app.launcher*android.view.ViewGroup*4*8*0*500^text^[]^description^null^event_time^2022-12-16:19:10:29:194~NewEvent:event_info^com.sec.android.app.launcher*android.view.ViewGroup*4*8*0*500^text^[]^description^null^event_time^2022-12-16:19:10:30:540~NewEvent:event_info^com.sec.android.app.launcher*android.view.ViewGroup*4*8*0*500^text^[]^description^null^event_time^2022-12-16:19:10:31:185~NewEvent:event_info^com.sec.android.app.launcher*android.view.ViewGroup*4*8*0*500^text^[]^description^null^event_time^2022-12-16:19:10:31:748~NewEvent:event_info^com.sec.android.app.launcher*android.view.ViewGroup*4*8*0*500^text^[]^description^null^event_time^2022-12-16:19:10:32:700~NewEvent:event_info^com.sec.android.app.launcher*android.widget.TextView*4*1*0*500^text^[Samsung]^description^Samsung, Folder, 2 notifications^event_time^2022-12-16:19:10:32:947~NewEvent:event_info^com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0*500^text^[One UI Home]^description^null^event_time^2022-12-16:19:10:33:344~NewEvent:event_info^com.sec.android.app.launcher*android.widget.TextView*4*1*0*500^text^[My Files]^description^My Files^event_time^2022-12-16:19:10:34:629`
                var eventIndex = str.indexOf('NewEvent')
                var infoIndex = str.indexOf('event_info^')
                var textIndex = str.indexOf('text^')
                var descIndex = str.indexOf('description^')
                var timeIndex = str.indexOf('event_time^')
                var nxtEventIndex = str.indexOf('NewEvent', eventIndex+1)
                // console.log(infoIndex, textIndex, descIndex, timeIndex, eventIndex, nxtEventIndex)
                // console.log(eventIndex)
                while(eventIndex != -1) {
                    eventIndex = nxtEventIndex
                    const info = str.substring(infoIndex+11, textIndex-1)
                    const text = str.substring(textIndex+6, descIndex-2)
                    const desc = str.substring(descIndex+12, timeIndex-1)
                    let time
                    if (nxtEventIndex != -1) {
                        time = str.substring(timeIndex+11, nxtEventIndex-1)
                    } else {
                        time = str.substring(timeIndex+11)
                    }
                    infoIndex = str.indexOf('event_info^', infoIndex+1)
                    textIndex = str.indexOf('text^', textIndex+1)
                    descIndex = str.indexOf('description^', descIndex+1)
                    timeIndex = str.indexOf('event_time^', timeIndex+1)
                    nxtEventIndex = str.indexOf('NewEvent', nxtEventIndex+1)
                    // console.log("--", infoIndex, textIndex, descIndex, timeIndex, eventIndex, nxtEventIndex)
                    // console.log({info, text: text != '[]' ? text : '', description: desc != 'null' ? desc : '', time: new Date(time)})
                    
                    // check if this event is stored in the directory
                    var eventReq = new sql.Request()
                        .input('eventInfo', info)
                    var eventQuery = `select * from data_patterns_m where eventInfo=@eventInfo`
                    var eventResponse = await eventReq.query(eventQuery)
                    var data = {}
                    if (eventResponse && eventResponse.recordset.length > 0) {
                        // if the event is stored in directory then get corresponding information
                        var eventDescReq = new sql.Request()
                            .input('eventInfo', info)
                        var eventDescQuery = `select acm.category_name, am.app_name, am.app_id, am.category_id, dpm.id, dpm.name as 'pattern_info', dpm.eventInfo, am.packageName
                            from data_patterns_m as dpm
                            left join apps_m as am on am.app_id = dpm.app_id
                            left join app_category_m acm on acm.id = am.category_id
                            where dpm.eventInfo = @eventInfo`
                        var eventDescRes = await eventDescReq.query(eventDescQuery)
                        if (eventDescRes && eventDescRes.recordset.length > 0) {
                            data = eventDescRes.recordset[0]
                            data = {
                                data_transaction_id: d.id,
                                user_id: d.user_id,
                                category_id: data.category_id,
                                app_id: data.app_id,
                                // category_name: ctname ? ctname : 'NA',
                                // app_name: appname ? appname : 'NA',
                                pattern_id: data.id,
                                // pattern_info: 'NA',
                                eventInfo: data.eventInfo,
                                packageName: data.packageName ? data.packageName : info.split('*')[0].trim(),
                                data_text: (text != '[]' && text != '') ? text : '-',
                                data_description: desc != 'null' ? desc : '-',
                                eventTime: time
                            }
                        }
                    } else {
                        var ctid = appsList.find(a => a.packageName == info.split('*')[0].trim())?.category_id
                        // var ctname = appsList.find(a => a.packageName == info.split('*')[0].trim())?.category_name
                        var appid = appsList.find(a => a.packageName == info.split('*')[0].trim())?.app_id
                        // var appname = appsList.find(a => a.packageName == info.split('*')[0].trim())?.app_name
                        var pckgName = info.split('*')[0].trim()
                        data = {
                            data_transaction_id: d.id,
                            user_id: d.user_id,
                            category_id: ctid ? ctid : null,
                            app_id: appid ? appid : null,
                            // category_name: ctname ? ctname : 'NA',
                            // app_name: appname ? appname : 'NA',
                            pattern_id: null,
                            // pattern_info: 'NA',
                            eventInfo: info,
                            packageName: pckgName,
                            data_text: (text != '[]' && text != '') ? text : '-',
                            data_description: desc != 'null' ? desc : '-',
                            eventTime: time
                        }
                    }
                    // csvData.push([
                    //     data.category_id,
                    //     data.app_id,
                    //     data.pattern_id,
                    //     data.eventInfo,
                    //     data.packageName,
                    //     data.data_text,
                    //     data.data_description,
                    //     data.eventTime
                    // ])
                    finalDataTbl.rows.add(
                        data.data_transaction_id,
                        data.user_id,
                        data.category_id,
                        data.app_id,
                        data.pattern_id,
                        data.eventInfo,
                        data.packageName,
                        data.data_text,
                        data.data_description,
                        data.eventTime
                    )
                }
                if (finalDataTbl && finalDataTbl.rows.length > 0) {
                    let tblInsert = await insFinalDataReq.bulk(finalDataTbl)
                    if (tblInsert.rowsAffected) {
                        // console.log(d.id, finalDataTbl.rows.length, tblInsert.rowsAffected)
                    }
                    await finalDataTbl.rows.clear()
                    // if (tblInsert.rowsAffected) {
                    //     if (tblInsert.rowsAffected != finalDataTbl.rows.length) {
                    //         console.log('length of data mismatch when inserting: ', data.data_transaction_id)
                    //     }
                    //     finalDataTbl.rows.clear()
                    // } else {
                    //     console.log('insertion error')
                    // }
                }
            }
                // console.log(csvData)
            // var insFinalDataQuery = `insert into final_data(category_id, app_id, pattern_id, eventInfo
            //                             , package_name, data_text, data_description, event_time) VALUES`
        }
    } catch(err) {
        console.log("parse error: ", err.message)
    }
}

const createFinalDataCsv = async() => {
    try {
        const today = new Date()
        const prevDay = new Date(today.setDate(today.getDate() - 1))
        var suffix = `${prevDay.getDate()}_${prevDay.getMonth()+1}_${prevDay.getFullYear()}`
        let fnlDataTblName = `${TablesName.FINAL_DATA}_${suffix}`
        let csvData = []
        columns = ['user_id', 'category_name', 'app_name', 'pattern_info', 'event_info', 'package_name', 'data_text', 'data_description', 'event_time', 'created_at']

        var sqlConn = await sql.connect(config)
        if (sqlConn) {
            var request = new sql.Request()
            var query = `SELECT fd.id, fd.user_id, acm.category_name, apps_m.app_name, dpm.name as 'pattern_info'
                , fd.event_info, fd.package_name, data_text, data_description, event_time, fd.created_at
                FROM ${fnlDataTblName} as fd
                left join apps_m on apps_m.app_id = fd.app_id
                left join data_patterns_m as dpm on dpm.id = fd.pattern_id
                left join app_category_m as acm on acm.id = fd.category_id
                where cast(event_time as date) = (select DATEADD(day, -1, CAST(GETDATE() AS date)))`
            var response = await request.query(query)
            if (response && response.recordset.length > 0) {
                response.recordset.forEach(r => {
                    csvData.push([
                        r.user_id,
                        r.category_name,
                        r.app_name,
                        r.pattern_info,
                        r.eventInfo,
                        r.package_name,
                        r.data_text,
                        r.data_description,
                        r.event_time.toLocaleString(),
                        r.created_at.toLocaleString()
                    ])
                })
            }
            const raw = await stringify(csvData, { header: true, columns: columns, delimiter: '\t' });
            const dirName = path.join(__dirname, 'temp-files')
            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName);
            }
            const filePath = path.join(dirName, `data_file_${suffix}` + '.csv')
            fs.writeFileSync(filePath, '\ufeff' + raw, { encoding: 'utf16le' }, { flag: 'w' });
        }
    } catch(err) {
        console.log("csv create error: ", err.message)
    }
}

parseDataRouter.get('/getCsv', async(req, res) => {
    try {
        // var date = req.params.date
        const today = new Date()
        const prevDay = new Date(today.setDate(today.getDate() - 1))
        var suffix = `${prevDay.getDate()}_${prevDay.getMonth()+1}_${prevDay.getFullYear()}`
        // else {
        //     daySuffix = date
        // }
        const dirName = path.join(__dirname, 'temp-files')
        const filePath = path.join(dirName, `data_file_${suffix}` + '.csv')
        res.download(filePath, () => {
            fs.unlink(filePath, (err) => {
                if (err) res.send(err.message);
            });
        });
    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
})

module.exports = {
    parseDataRouter,
    parseData,
    createFinalDataCsv
}