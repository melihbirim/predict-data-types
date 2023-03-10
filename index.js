const moment = require('moment');
const os = require('os');

function isDate(value) {
    const formats = [
        moment.ISO_8601,
        "YYYY-MM-DDTHH:mm:ss.SSSZ",
        "YYYY-MM-DDTHH:mm:ssZ",
        "YYYY-MM-DDTHH:mm:ss",
        "YYYY-MM-DDTHH:mmZ",
        "YYYY-MM-DDTHH:mm",
        "YYYY-MM-DD HH:mm:ss.SSS",
        "YYYY-MM-DD HH:mm:ss",
        "YYYY-MM-DD HH:mm",
        "DD/MM/YYYY",
        "DD/MM/YYYY HH:mm:ss",
        "DD/MM/YYYY HH:mm",
        "MM/DD/YYYY",
        "MM/DD/YYYY HH:mm:ss",
        "MM/DD/YYYY HH:mm",
        "DD-MMM-YYYY",
        "DD-MMM-YYYY HH:mm:ss",
        "DD-MMM-YYYY HH:mm",
        "MMM-DD-YYYY",
        "MMM-DD-YYYY HH:mm:ss",
        "MMM-DD-YYYY HH:mm",
    ];

    for (let i = 0; i < formats.length; i++) {
        const date = moment(value, formats[i], true);
        if (date.isValid()) {
            return true;
        }
    }

    return false;
}

function isBoolean(val) {
    return ((typeof val == 'string'
        && (val.toLowerCase() === 'true' || val.toLowerCase() === 'yes' || val.toLowerCase() === 'false' || val.toLowerCase() === 'no'))
        || val === 1
        || val === 0)
}

function isURL(value) {
    const urlPattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    return urlPattern.test(value);
}

function isUUID(value) {
    const urlPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return urlPattern.test(value);
}


function isPhoneNumber(value) {
    const phonePattern = new RegExp(
        "^(\\+\\d{1,3}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$"
    );
    return phonePattern.test(value);
}

function isEmail(value) {
    const emailPattern = new RegExp(
        "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
        "i"
    );
    return emailPattern.test(value);
}

function tokenize(text) {
    const tokens = [];
    let i = 0;
    while (i < text.length) {
        const char = text.charAt(i);
        if (char == ' ') {
            i++;
            continue
        };

        if (char === '{' || char === '[') {
            let j = i + 1;
            let count = 1;
            while (j < text.length && count > 0) {
                if (text.charAt(j) === '{' || text.charAt(j) === '[') {
                    count++;
                } else if (text.charAt(j) === '}' || text.charAt(j) === ']') {
                    count--;
                }
                j++;
            }
            tokens.push(text.substring(i, j));
            i = j;
        } else if (char === '"') {
            let j = i + 1;
            while (j < text.length && text.charAt(j) !== '"') {
                if (text.charAt(j) === '\\') {
                    j++;
                }
                j++;
            }
            tokens.push(text.substring(i, j + 1));
            i = j + 1;
        } else {
            let j = i + 1;
            while (j < text.length && text.charAt(j) !== ',' && text.charAt(j) !== '{' && text.charAt(j) !== '[') {
                j++;
            }
            tokens.push(text.substring(i, j));
            i = j;
        }
        if (i < text.length && text.charAt(i) === ',') {
            i++;
        }
    }
    return tokens;
}

function predictDataTypes(str, firstRowIsHeader = false) {
    let header = "";
    let data = str;

    if (firstRowIsHeader) {
        let tmp = str.split(os.EOL);
        if (tmp.length > 1) {
            header = tmp[0].split(",");
            data = tokenize(tmp[1]);
        }else{
            
            return {};
        }
    } else {
        data = tokenize(str);
        header = data;
    }
    const types = {};

    console.log(`header ${header}`)
            console.log(`data ${data}`)

    for (let i = 0; i < data.length; i++) {
        const part = data[i].trim();
        const field = header[i].trim();

        if (isBoolean(part)) {
            types[field] = "boolean";
        } else if (!isNaN(parseFloat(part)) && isFinite(part)) {
            types[field] = "number";
        } else if (isDate(part)) {
            types[field] = "date";
        } else if (isURL(part)) {
            types[field] = "url";
        } else if (isUUID(part)) {
            types[field] = "uuid";
        } else if (isPhoneNumber(part)) {
            types[field] = "phone";
        } else if (isEmail(part)) {
            types[field] = "email";
        } else if (part.startsWith("[") && part.endsWith("]")) {
            types[field] = "array";
        } else if (part.startsWith("{") && part.endsWith("}")) {
            types[field] = "object";
        }
        else {
            types[field] = "string";
        }
    }
    return types;

}

module.exports = predictDataTypes;

