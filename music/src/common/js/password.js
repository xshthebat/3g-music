function charType(num) {
    if (num >= 48 && num <= 57) {
        return 1;
    }
    if (num >= 97 && num <= 122) {
        return 2;
    }
    if (num >= 65 && num <= 90) {
        return 4;
    }
    return 8;
}

export default function password(value) {
    let pwd = value;
    let result = 0;
    for (var i = 0, len = pwd.length; i < len; ++i) {
        result |= charType(pwd.charCodeAt(i));
    }

    var level = 0;
    //对result进行四次循环，计算其level
    for (var i = 0; i <= 4; i++) {
        if (result & 1) {
            level++;
        }
        //右移一位
        result = result >>> 1;
    }

    if (pwd.length >= 6) {
        switch (level) {
            case 1:
                return "weak";
                break;
            case 2:
                return "medium";
                break;
            case 3:
            case 4:
                return "strong";
                break;
            default:
                return "default";
        }
    }
}