const e = 13;
const d = 2197;
const n = 2987;

export function setup() {
    const encodeButton = document.getElementById("encodeButton")!;
    encodeButton.addEventListener("click", encodeText);
    const encryptButton = document.getElementById("encryptButton")!;
    encryptButton.addEventListener("click", encryptText);
    const decryptButton = document.getElementById("decryptButton")!;
    decryptButton.addEventListener("click", decryptText);
    const decodeButton = document.getElementById("decodeButton")!;
    decodeButton.addEventListener("click", decodeText);
}

function modExp(base: number, exp: number, mod: number) {
    if (mod === 1) return 0;
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}


function encodeText() {
    const inputTextElement = <HTMLInputElement>document.getElementById("inputText")!;
    const inputText = inputTextElement.value;
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(inputText);
    const encodedOutput = document.getElementById("encodedOutput")!;
    encodedOutput.textContent = encodedText + "";
    return encodedText;
}

function encryptText() {
    const encodedText = encodeText();
    const encryptedOutput = document.getElementById("encryptedOutput")!;
    const encryptCalc = document.getElementById("encryptCalc")!;
    let encryptedText: number[] = [];

    for (let i = 0; i < encodedText.length; i++) {
        const charCode = encodedText[i];
        const encryptedCharCode = modExp(charCode, e, n);
        encryptedText.push(encryptedCharCode); // Change 'ciphertext' to 'encryptedText'
    }
    
    encryptCalc.textContent = `例えば${encodedText[0]}の${e}乗を${n}で割った余りは${encryptedText[0]}です`;
    encryptedOutput.textContent = encryptedText.join(",");
    return encryptedText;
}


function decryptText() {
    const encryptedText = encryptText();
    const decryptedOutput = document.getElementById("decryptedOutput")!;
    const decryptCalc = document.getElementById("decryptCalc")!;
    let decryptedText: number[] = [];

    for (let i = 0; i < encryptedText.length; i++) {
        const encryptedCharCode = encryptedText[i];
        const decryptedCharCode = modExp(encryptedCharCode, d, n);
        decryptedText.push(decryptedCharCode);
    }

    decryptCalc.textContent = `例えば${encryptedText[0]}の${d}乗を${n}で割った余りは${decryptedText[0]}です`;
    decryptedOutput.textContent = decryptedText.join(",");
    return decryptedText;
}

function decodeText() {
    const decoder = new TextDecoder();
    const decryptedText = decryptText(); // Assuming this returns an array of decrypted values
    //const decodedText = decoder.decode(new Uint8Array(decryptedText));
    const decodedText = decoder.decode(new Uint8Array(decryptedText));
    const decodedOutput = document.getElementById("decodedOutput")!
    decodedOutput.textContent = decodedText;
}
