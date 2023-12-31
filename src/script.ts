export default class RSA {
    e: number;
    d: number;
    n: number;
    p: number;
    q: number;
    encryptedM: number;
    encodedValues: number[];
    encryptedValues: number[];
    decryptedValues: number[];

    constructor(e :number, d: number, n: number, p: number, q: number) {
        this.e = e;
        this.d = d;
        this.n = n;
        this.p = p;
        this.q = q;
        this.encryptedM = 0;
        this.encodedValues = [];
        this.encryptedValues = [];
        this.decryptedValues = [];
        this.setup();
    }

    setup() {
        const encryptMButton = document.getElementById("encryptMButton")!;
        encryptMButton.addEventListener("click", this.encryptM.bind(this));
        const decryptMButton = document.getElementById("decryptMButton")!;
        decryptMButton.addEventListener("click", this.decryptM.bind(this));
        const suggestPrimeButton = document.getElementById("suggestPrime")!;
        suggestPrimeButton.addEventListener("click", this.suggestPrime.bind(this));
        const calculateNButton = document.getElementById("calculateN")!;
        calculateNButton.addEventListener("click", this.calculateN.bind(this));
        const suggestEbutton = document.getElementById("suggestE")!;
        suggestEbutton.addEventListener("click", this.suggestE.bind(this));
        const calculateDbutton = document.getElementById("calculateD")!;
        calculateDbutton.addEventListener("click", this.calculateD.bind(this));
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

    static isPrime(num: number){
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) {
                return false;
            }
        }
        return num > 1;
    }

    static findNextPrime(startingNumber: number){
        let currentNumber = startingNumber;
    
        while (true) {
            if (RSA.isPrime(currentNumber)) {
                return currentNumber;
            }
            currentNumber++;
        }
    }

    static isValidNumber(value: string): boolean {
        const regex = /^[0-9]+/;
        return regex.test(value);
    }

    static findSmallPrimes(phiN: number): number[] {
        const smallPrimes: number[] = [];
    
        for (let e = 2; e < phiN; e++) {
            if (RSA.isPrime(e) && phiN % e !== 0) {
                smallPrimes.push(e);
    
                if (smallPrimes.length === 3) {
                    break;
                }
            }
        }
    
        return smallPrimes;
    }

    static modInverse(e: number, phiN: number): number | null {
        let d = 0;
        let x1 = 0;
        let x2 = 1;
        let y1 = 1;
        let tempPhiN = phiN;
    
        while (e > 0) {
            let temp1 = Math.floor(tempPhiN / e);
            let temp2 = tempPhiN - temp1 * e;
            tempPhiN = e;
            e = temp2;
    
            let x = x2 - temp1 * x1;
            let y = d - temp1 * y1;
    
            x2 = x1;
            x1 = x;
            d = y1;
            y1 = y;
        }
    
        if (tempPhiN === 1) {
            return (d + phiN) % phiN;
        }
    
        return null;
    }
    
    encrypt(m: number) {
        return RSA.modExp(m, this.e, this.n);
    }
    
    decrypt(c: number) {
        return RSA.modExp(c, this.d, this.n);
    }

    encryptM() {
        this.e = 13;
        this.d = 2197;
        this.n = 2987;
        this.p = 29;
        this.q = 103;
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
    
    suggestPrime(){
        const inputA = document.getElementById("inputA") as HTMLInputElement;
        const inputB = document.getElementById("inputB") as HTMLInputElement;
        const primesElement = document.getElementById("primes");
    
        if (!inputA || !inputB || !RSA.isValidNumber(inputA.value) || !RSA.isValidNumber(inputB.value)) {
            alert("a, bには半角数字を入力してください。");
            return;
        }
        const A = parseInt(inputA.value);
        const B = parseInt(inputB.value);
        if (A < 256 || B < 256 || A > 9999 || B > 9999) {
            alert("a, bには256以上9999以下の自然数を入力してください。");
            return;
        }

        const p = RSA.findNextPrime(A);
        const q_candidate = RSA.findNextPrime(B);
        const q = p === q_candidate ? RSA.findNextPrime(q_candidate + 1) : q_candidate;
    
        this.p = p;
        this.q = q;
        primesElement!.textContent = `p = ${p}, q = ${q}`;
    }
    
    calculateN(){
        const n = this.p * this.q;
        const phiN = (this.p - 1) * (this.q - 1);
    
        const nTextElement = document.getElementById("nText");
        const phiNTextElement = document.getElementById("phiNText");
    
        if (nTextElement && phiNTextElement) {
            nTextElement.textContent = `n = ${n}`;
            phiNTextElement.textContent = `φ(n) = ${phiN}`;
        }
    }
    
    suggestE(){
        const phiN = (this.p - 1) * (this.q - 1);
        const suggestedE = document.getElementById("suggestedE");
        const smallPrimes = RSA.findSmallPrimes(phiN);
        if (suggestedE) {
            suggestedE.textContent = `e = ${smallPrimes[0]}`;
        }
    }
    
    calculateD(){
        const phiN = (this.p - 1) * (this.q - 1);
        const smallPrimes = RSA.findSmallPrimes(phiN);
        const calculatedD = document.getElementById("calculatedD");
        const dArray: number[] = [];
    
        for (let i = 0; i < smallPrimes.length; i++) {
            const e = smallPrimes[i];
            const d = RSA.modInverse(e, phiN);
    
            if (d !== null) {
                dArray.push(d);
            }
        }
    
        if (calculatedD) {
            calculatedD.textContent = `d = ${dArray[0]}`;
        }
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
        this.encodedValues = Array.from(encodedText);
        // return encodedText;
    }

    encryptText() {
        // const encodedText = this.encodeText()!;
        this.encryptedValues = [];
        const encryptedOutput = document.getElementById("encryptedOutput")!;
        const encryptCalc = document.getElementById("encryptCalc")!;

        for (let i = 0; i < this.encodedValues.length; i++) {
            const charCode = this.encodedValues[i];
            const encryptedCharCode = this.encrypt(charCode);
            this.encryptedValues.push(encryptedCharCode); // Change 'ciphertext' to 'encryptedText'
        }
        
        encryptCalc.textContent = `例えば${this.encodedValues[0]}の${this.e}乗を${this.n}で割った余りは${this.encryptedValues[0]}です`;
        encryptedOutput.textContent = this.encryptedValues.join(",");
    }

    decryptText() {
        this.decryptedValues = [];
        const decryptedOutput = document.getElementById("decryptedOutput")!;
        const decryptCalc = document.getElementById("decryptCalc")!;
        // let decryptedText: number[] = [];

        for (let i = 0; i < this.encryptedValues.length; i++) {
            const encryptedCharCode = this.encryptedValues[i];
            const decryptedCharCode = this.decrypt(encryptedCharCode);
            this.decryptedValues.push(decryptedCharCode);
        }

        decryptCalc.textContent = `例えば${this.encryptedValues[0]}の${this.d}乗を${this.n}で割った余りは${this.decryptedValues[0]}です`;
        decryptedOutput.textContent = this.decryptedValues.join(",");;
    }

    decodeText() {
        const decoder = new TextDecoder();
        // const decryptedText = this.decryptText(); // Assuming this returns an array of decrypted values
        //const decodedText = decoder.decode(new Uint8Array(decryptedText));
        const decodedText = decoder.decode(new Uint8Array(this.decryptedValues));
        const decodedOutput = document.getElementById("decodedOutput")!
        decodedOutput.textContent = decodedText;
    }
}
