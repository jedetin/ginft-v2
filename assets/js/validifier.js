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
    "private": "",
    "public": "",
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
    var SamsPublicKeyId = cryptico.publicKeyID(SamsPublicKeyString)

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

    <input type="text" class="form-control mb-5" readonly value="${SamsPublicKeyString}">
    <label class="form-label">Encrypted Text</label>

        <textarea rows="5" id="resultgen" class="form-control" readonly>${EncryptionResult.cipher}</textarea>
    `;
    document.getElementById("returnDiv").innerHTML = divar;
    //  return EncryptionResult.cipher;
}

function verify(code) {
    if (code == 'verified') {
        return `<i class='fas fa-check></i> Verified`
    }
    else {
        return `<i class='fas fa-alert></i> Forged`
    }
}
function decrypt() {
    const bits = 512
    decData.pass = document.getElementById('passphrase').value;
    decData.cipher = document.getElementById('ciphertext').value;
    decData.id = document.getElementById('keyid').value;

    var MattsRSAkey = cryptico.generateRSAKey(decData.pass, bits);
    var MattsPublicKeyString = cryptico.publicKeyString(MattsRSAkey);
    var MattsPublicKeyId = cryptico.publicKeyID(MattsPublicKeyString)

    var DecryptionResult = cryptico.decrypt(decData.cipher, MattsRSAkey);

    print("The decrypted message:");
    print(DecryptionResult.plaintext);
    print("DecryptionResult.signature: " + DecryptionResult.signature);
    let divar = `
    <span class="badge bg-primary">${DecryptionResult.signature}</span>
    <label class="form-label fw-bolder">Decrypted Text:</label>
    ${DecryptionResult.plaintext}  <hr/>
    
    ${DecryptionResult.publicKeyString}

`;

    document.getElementById("returnDiv").innerHTML = divar;
}