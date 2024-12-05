export function randomHash(length : number) {
    let options = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let result = "";
    for(let i=0;i<length ; i++){
        result = result + options.charAt(Math.floor(Math.random() * options.length));
    }
    return result;
}

