const fs = require("fs");
const ExcelJS = require('exceljs');

const map = {
    "Наименование": 'name',
    "ЦЕНА": 'price',
}

async function parseExcel(file, path, includeImages = false) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file);
    let jsonData = [];

    workbook.worksheets.forEach((sheet, i) => {
        const firstRow = sheet.getRow(1);
        if (!firstRow.cellCount) return;
        const keys = firstRow.values;
        const images = sheet.getImages()
        const brand = sheet.name
        let collection = undefined

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;

            const obj = {};

            if (includeImages) {
                const imgObj = images.find(o => o.range.tl.nativeRow + 1 === row.number)
                if (imgObj) {
                    const img = workbook.model.media.find(m => m.index === imgObj?.imageId);

                    if (img) {
                        const imgName = `sheet_${i}.${imgObj?.range.tl.nativeRow}.${img.extension}`
                        obj.image = imgName
                        fs.promises.mkdir(path, { recursive: true }).then(() => {
                            fs.writeFileSync(`${path}/${imgName}`, img.buffer);
                        }).catch(console.error);
                    }
                }
            }

            let values = row.values
            for (let i = 1; i < keys.length; i ++) {
                // if value defined in map, it is not applied to the product row
                if (map[values[i]]) return;

                // rename product keys
                if (map[keys[i]]) {
                    keys[i] = map[keys[i]]
                }
                // define product collection
                if (values[i] &&
                    typeof values[i] === "string" &&
                    (values[i] === values[i+1] ||
                    values[i] === values[i-1])
                ) {
                    collection = values[i]
                } else {
                    obj[keys[i]] = values[i];
                }
            }
            obj.collection = collection
            obj.brand = brand

            if (obj.name) {
                jsonData.push(obj);
            }
        })
    })
    fs.writeFileSync(`${path}/jsonData.json`, JSON.stringify(jsonData));
}

parseExcel('./test3.xlsx', '../files/images', true)

