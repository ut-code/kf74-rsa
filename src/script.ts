export default class RSA {
    e: number;
    d: number;
    n: number;
    encryptedM: number;
    encryptedValues: number[];

    constructor(e :number, d: number, n: number) {
        this.e = e;
        this.d = d;
        this.n = n;
        this.encryptedM = 0;
        this.encryptedValues = [];
        this.setup();
    }

    setup() {
        const encryptMButton = document.getElementById("encryptMButton")!;
        encryptMButton.addEventListener("click", this.encryptM.bind(this));
        const decryptMButton = document.getElementById("decryptMButton")!;
        decryptMButton.addEventListener("click", this.decryptM.bind(this));
        const encodeButton = document.getElementById("encodeButton")!;
        encodeButton.addEventListener("click", this.encodeText.bind(this));
        const encryptButton = document.getElementById("encryptButton")!;
        encryptButton.addEventListener("click", this.encryptText.bind(this));
        const decryptButton = document.getElementById("decryptButton")!;
        decryptButton.addEventListener("click", this.decryptText.bind(this));
        const decodeButton = document.getElementById("decodeButton")!;
        decodeButton.addEventListener("click", this.decodeText.bind(this));
    }

    static modExp(base: number, exp: number, mod: number) {
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
    
    encrypt(m: number) {
        return RSA.modExp(m, this.e, this.n);
    }
    
    decrypt(c: number) {
        return RSA.modExp(c, this.d, this.n);
    }

    encryptM() {
        const inputM = (<HTMLInputElement>document.getElementById("inputM")!).value;
        const encryptedM = document.getElementById("encryptedM")!;
        const isNumeric = /^[0-9]+$/.test(inputM);
        if (!isNumeric) {
            alert("Mには半角数字を入力してください。");
            return;
        }
        const inputMNumber = Number(inputM);
        
        if (inputMNumber >= this.n) {
            alert("Mにはn未満の自然数を入力してください。");
            return;
        }
        this.encryptedM = this.encrypt(inputMNumber);
        encryptedM.textContent = `C = ${this.encryptedM}`;
    }

    decryptM(){
        const decryptedM = document.getElementById("decryptedM")!;
        decryptedM.textContent = `M' = ${this.decrypt(this.encryptedM)}`;
    }


    encodeText() {
        const encryptExplain = document.getElementById("encryptExplain")!;
        const decryptExplain = document.getElementById("decryptExplain")!;
        const inputE = (<HTMLInputElement>document.getElementById("inputE")!).value;
        const inputD = (<HTMLInputElement>document.getElementById("inputD")!).value;
        const inputN = (<HTMLInputElement>document.getElementById("inputN")!).value;

        // 正規表現を使って半角数字かどうかを確認
        const isNumeric = /^[0-9]+$/.test(inputE) && /^[0-9]+$/.test(inputD) && /^[0-9]+$/.test(inputN);

        if (!isNumeric) {
                alert("e, d, nには半角数字を入力してください。");
                return; // 数値でない場合は処理を中断
        }
        this.e = Number(inputE);
        this.d = Number(inputD);
        this.n = Number(inputN);

        const inputTextElement = <HTMLInputElement>document.getElementById("inputText")!;
        const inputText = inputTextElement.value;
        const encoder = new TextEncoder();
        const encodedText = encoder.encode(inputText);
        const encodedOutput = document.getElementById("encodedOutput")!;
        encodedOutput.textContent = encodedText + "";
        encryptExplain.textContent = `e = ${this.e}, n = ${this.n}を用いて暗号化します`; 
        decryptExplain.textContent = `d = ${this.d}, n = ${this.n}を用いて復号します`; 
        return encodedText;
    }

    encryptText() {
        const encodedText = this.encodeText()!;
        const encryptedOutput = document.getElementById("encryptedOutput")!;
        const encryptCalc = document.getElementById("encryptCalc")!;

        for (let i = 0; i < encodedText.length; i++) {
            const charCode = encodedText[i];
            const encryptedCharCode = this.encrypt(charCode);
            this.encryptedValues.push(encryptedCharCode); // Change 'ciphertext' to 'encryptedText'
        }
        
        encryptCalc.textContent = `例えば${encodedText[0]}の${this.e}乗を${this.n}で割った余りは${this.encryptedValues[0]}です`;
        encryptedOutput.textContent = this.encryptedValues.join(",");
    }

    decryptText() {
        const decryptedOutput = document.getElementById("decryptedOutput")!;
        const decryptCalc = document.getElementById("decryptCalc")!;
        let decryptedText: number[] = [];

        for (let i = 0; i < this.encryptedValues.length; i++) {
            const encryptedCharCode = this.encryptedValues[i];
            const decryptedCharCode = this.decrypt(encryptedCharCode);
            decryptedText.push(decryptedCharCode);
        }

        decryptCalc.textContent = `例えば${this.encryptedValues[0]}の${this.d}乗を${this.n}で割った余りは${decryptedText[0]}です`;
        decryptedOutput.textContent = decryptedText.join(",");
        return decryptedText;
    }

    decodeText() {
        const decoder = new TextDecoder();
        const decryptedText = this.decryptText(); // Assuming this returns an array of decrypted values
        //const decodedText = decoder.decode(new Uint8Array(decryptedText));
        const decodedText = decoder.decode(new Uint8Array(decryptedText));
        const decodedOutput = document.getElementById("decodedOutput")!
        decodedOutput.textContent = decodedText;
    }
}
