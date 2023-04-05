const data = {
    "text": {
        "plain": "",
        "pass": ""
    },
    "bits": 0
}

const decData = {
    "id": "",
    "cipher": "",
    "pass": ""

}

const userKey = {
    "public": {
        "id": "",
        "string": ""
    },
}
function print(string, color) {
    return console.log('%c' + string, 'color: ' + color + ';')
}

function jcopy() {
    let textarea = document.getElementById("resultgen");
    textarea.select();
    document.execCommand("copy");
    alert('Text Copied!')
}

let generate = () => {

    data.text.pass = document.getElementById('passphrase').value;
    data.text.plain = document.getElementById('plaintext').value;
    data.bits = document.getElementById('bits').value;


    const serverKey = "AlphaBravoCharlieDelta"

    var SamsRSAkey = cryptico.generateRSAKey(serverKey, data.bits);
    var SamsPublicKeyString = cryptico.publicKeyString(SamsRSAkey);

    userKey.public.string = SamsPublicKeyString;
    var SamsPublicKeyId = cryptico.publicKeyID(SamsPublicKeyString)
    userKey.public.id = SamsPublicKeyId;

    var MattsRSAkey = cryptico.generateRSAKey(data.text.pass, data.bits);
    var MattsPublicKeyString = cryptico.publicKeyString(MattsRSAkey);
    var MattsPublicKeyId = cryptico.publicKeyID(MattsPublicKeyString)


    var EncryptionResult = cryptico.encrypt(data.text.plain, MattsPublicKeyString, SamsRSAkey);

    print("The encrypted message:");
    print(EncryptionResult.cipher);

    // var DecryptionResult = cryptico.decrypt(EncryptionResult.cipher, MattsRSAkey);

    // print("The decrypted message:");
    // print(DecryptionResult.plaintext, "yellow");
    // console.log("DecryptionResult.signature: " + '%c' + DecryptionResult.signature, 'color:green');


    // console.log('%c' + SamsRSAkey.cipher, 'color: aqua;')
    let divar = `
    <label class="form-label">Key ID</label>
    <input type="text" class="form-control mb-5" readonly value="${SamsPublicKeyId}">
    <label class="form-label">Key String</label>    <small class='text-muted'>This will be used for verification</small>
    <input type="text" class="form-control mb-5" readonly value="${SamsPublicKeyString}">\

    <label class="form-label">Encrypted Text</label>

        <textarea rows="5" id="resultgen" class="form-control" readonly>${EncryptionResult.cipher}</textarea>
    `;
    document.getElementById("returnDiv").innerHTML = divar;
    decData.cipher = EncryptionResult.cipher;
    return EncryptionResult.cipher;
}

function verify(code) {
    if (code == 'verified') {
        return `<i class='fas fa-check></i> Verified`
    }
    else {
        return `<i class='fas fa-alert></i> Forged`
    }
}

// let compKey = () => {


// }

function decrypt() {
    const bits = 512
    decData.pass = document.getElementById('passphrase').value;
    decData.cipher = document.getElementById('ciphertext').value;
    decData.id = document.getElementById('keyid').value;

    var MattsRSAkey = cryptico.generateRSAKey(decData.pass, bits);
    var MattsPublicKeyString = cryptico.publicKeyString(MattsRSAkey);
    var MattsPublicKeyId = cryptico.publicKeyID(MattsPublicKeyString)

    var DecryptionResult = cryptico.decrypt(decData.cipher, MattsRSAkey);
    if (decData.id != null) {
        if (DecryptionResult.publicKeyString == decData.id) {
            console.log("true");
        } else {
            console.log("false");
        }
    } else {
        console.log("No Key ID provided");
    }
    let divar = `
    <span class="badge bg-primary">${DecryptionResult.signature}</span>
    <label class="form-label fw-bolder">Decrypted Text:</label>
    ${DecryptionResult.plaintext}  <hr/>`;
    document.getElementById("returnDiv").innerHTML = divar;
}

let saveFile = () => {
    let data = `${decData.cipher}`
    const textToBLOB = new Blob([data], { type: 'text/plain' });
    const sFileName = userKey.public.id + '.txt';
    let newLink = document.createElement("a");
    newLink.download = sFileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }

    newLink.click();
}
function loadFileAsText() {
    var fileToLoad = document.getElementById("fileToLoad").files[0];
    var namekeyId = fileToLoad.name
    namekeyId = namekeyId.replace(".txt", "")
    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        document.getElementById("ciphertext").value = textFromFileLoaded;
        document.getElementById("keyid").value = namekeyId;
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}
