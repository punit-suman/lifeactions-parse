const { TablesName } = require('../constant');
const { config } = require('../dbConfigMySQL')
const stringify = require('csv-stringify-as-promised');
const path = require('path');
const fs = require('fs');

const appLevelParse = async() => {
    try {
        const today = new Date()
        const prevDay = new Date(today.setDate(today.getDate() - 1))
        var suffix = `${prevDay.getDate()}_${prevDay.getMonth()+1}_${prevDay.getFullYear()}`
        let fnlDataTblName = `${TablesName.FINAL_DATA}_${suffix}`
        let csvData = []
        columns = ['user_id', 'category_name', 'app_name', 'pattern_info', 'event_info', 'package_name', 'data_text', 'data_description', 'event_time', 'created_at']

        var query = `SELECT fd.id, fd.user_id, acm.category_name, apps_m.app_name, dpm.name as 'pattern_info'
            , fd.event_info, fd.package_name, data_text, data_description, event_time, fd.created_at
            FROM ${fnlDataTblName} as fd
            left join apps_m on apps_m.app_id = fd.app_id
            left join event_info_m as dpm on dpm.id = fd.pattern_id
            left join app_category_m as acm on acm.id = fd.category_id`
        // --where cast(event_time as date) = (select DATEADD(day, -1, CAST(GETDATE() AS date)))`;
        var final_data = []
        let finalDataPromise = new Promise(function(resolve, reject) {
            config.query(query, async function(err, result) {
                if (err) {
                    console.log(err.message)
                    reject(err)
                }
                if (result) {
                    result.forEach(r => {
                        csvData.push([
                            r.user_id,
                            r.category_name,
                            r.app_name,
                            r.pattern_info,
                            r.event_info,
                            r.package_name,
                            r.data_text,
                            r.data_description,
                            r.event_time.toLocaleString(),
                            r.created_at.toLocaleString()
                        ])
                    })
                    resolve(result)
                }
            })
        })
        final_data = await finalDataPromise

        var data_patterns
        let getDataPatternsPromise = new Promise(function(resolve, reject) {
            var query = `select * from data_patterns_m`;
            config.query(query, function(err, result) {
                if (err) {
                    console.log(err.message)
                    reject(err)
                }
                if (result) {
                    resolve(result)
                }
            })
        })
        data_patterns = await getDataPatternsPromise

        let event_info = []
        data_patterns.forEach(dp => {
            event_info.push(dp.event_info)
        })

        let ott_data = final_data.filter(f => f.category_name == 'ott')
        
        let final_ott_data = []
        // youtube data parsing
        // let youtube_data = ott_data.filter(o => o.app_name == 'youtube')
        // let hotstar_data = ott_data.filter(o => o.app_name == 'hotstar')
        ott_data.forEach(y => {
            var checked = false
            if (event_info.includes(y.event_info)) {
                for (let i = 0; i < data_patterns.length; i++) {
                    let a = {
                        user_id: y.user_id,
                        event: data_patterns[i].name,
                        event_time: y.event_time.toLocaleString(),
                        app_name: y.app_name,
                        category_name: y.category_name,
                        data: ''
                    }
                    if (data_patterns[i].event_info == y.event_info) {
                        if (data_patterns[i].prefix) {
                            if (y.data_text.includes(data_patterns[i].prefix)) {
                                if (data_patterns[i].suffix) {
                                    if (y.data_text.includes(data_patterns[i].suffix)) {
                                        if (data_patterns[i].data) {
                                            if (y.data_text.includes(data_patterns[i].data)) {
                                                a.data = y.data_text
                                                final_ott_data.push(a)
                                                checked = true
                                                // console.log(data_patterns[i].prefix, data_patterns[i].suffix, data_patterns[i].data, y.data_text)
                                            }
                                        } else {
                                            a.data = y.data_text.substring(y.data_text.indexOf(data_patterns[i].prefix) + data_patterns[i].prefix.length, y.data_text.indexOf(data_patterns[i].suffix))
                                            final_ott_data.push(a)
                                            checked = true
                                            // console.log(data_patterns[i].prefix, data_patterns[i].suffix, data_patterns[i].data, y.data_text)
                                        }
                                    }
                                } else {
                                    if (data_patterns[i].data) {
                                        if (y.data_text.includes(data_patterns[i].data)) {
                                            a.data = y.data_text
                                            final_ott_data.push(a)
                                            checked = true
                                            // console.log(data_patterns[i].prefix, data_patterns[i].suffix, data_patterns[i].data, y.data_text)
                                        }
                                    } else {
                                        a.data = y.data_text.substring(y.data_text.indexOf(data_patterns[i].prefix) + data_patterns[i].prefix.length)
                                        final_ott_data.push(a)
                                        checked = true
                                        // console.log(data_patterns[i].prefix, data_patterns[i].suffix, data_patterns[i].data, y.data_text)
                                    }
                                }
                            }
                        } else {
                            if (data_patterns[i].suffix) {
                                if (y.data_text.includes(data_patterns[i].suffix)) {
                                    if (data_patterns[i].data) {
                                        if (y.data_text.includes(data_patterns[i].data)) {
                                            a.data = y.data_text
                                            final_ott_data.push(a)
                                            checked = true
                                            // console.log(data_patterns[i].prefix, data_patterns[i].suffix, data_patterns[i].data, y.data_text)
                                        }
                                    } else {
                                        a.data = y.data_text.substring(0, y.data_text.indexOf(data_patterns[i].suffix))
                                        final_ott_data.push(a)
                                        checked = true
                                        // console.log(data_patterns[i].prefix, data_patterns[i].suffix, data_patterns[i].data, y.data_text)
                                    }
                                }
                            } else {
                                if (data_patterns[i].data) {
                                    if (y.data_text.includes(data_patterns[i].data)) {
                                        a.data = y.data_text
                                        final_ott_data.push(a)
                                        checked = true
                                        // console.log(data_patterns[i].prefix, data_patterns[i].suffix, data_patterns[i].data, y.data_text)
                                    }
                                } else {
                                    a.data = y.data_text
                                    if (!checked) {
                                        final_ott_data.push(a)
                                    }
                                    // console.log(data_patterns[i].prefix, data_patterns[i].suffix, data_patterns[i].data, y.data_text)
                                }
                            }
                        }
                    }
                }
            } else if (y.data_text != '-') {
                let a = {
                    user_id: y.user_id,
                    event: '-',
                    event_time: y.event_time.toLocaleString(),
                    app_name: y.app_name,
                    category_name: y.category_name,
                    data: y.data_text
                }
                final_ott_data.push(a)
            }
        })
        console.log("Done")
        columns = ['user_id', 'event', 'event_time', 'app_name', 'category_name', 'data']
        const raw = await stringify(final_ott_data, { header: true, columns: columns, delimiter: '\t' });
        const dirName = path.join(__dirname, 'temp-files')
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName);
        }
        const filePath = path.join(dirName, `ott_data_${suffix}` + '.csv')
        fs.writeFileSync(filePath, '\ufeff' + raw, { encoding: 'utf16le' }, { flag: 'w' });
        return final_ott_data
    } catch(err) {
        console.log(err.message)
    }
}

module.exports = {
    appLevelParse
} 