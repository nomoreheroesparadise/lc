import * as rp from 'request-promise';
import * as crypto from 'crypto';

function splitBuffer(buffer, padding) {
    const chunkArray = [];
    let start = 0;

    while (start < buffer.length) {
        const chunk = buffer.slice(start, start + padding);
        chunkArray.push(chunk);
        start += padding;
    }

    return chunkArray;
}

export function generateRsaKeys() {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
    });
}

export async function encryptPdf(publicKey) {
    const url = 'http://www.africau.edu/images/default/sample.pdf';

    const data = await rp({ uri: url });
    const dataBuffer = Buffer.from(data);
    const dataBufferArray = splitBuffer(dataBuffer, 250);
    const encrypted = dataBufferArray.reduce((acc, curr) =>
        acc + crypto.publicEncrypt({
            key: publicKey,
        }, curr).toString('base64') + '.'
    , '');

    return encrypted;
}

/*
    Decrypt function for test purposes.
*/
function decryptPdf(data, privateKey) {
    const dataBufferArray = data.split('.');
    const decrypted = dataBufferArray.reduce((acc, curr) => {
        if (curr) {
            return acc + crypto.privateDecrypt({
                key: privateKey,
            }, Buffer.from(curr, 'base64')).toString('utf8');
        }

        return acc;
    }, '');

    return decrypted;
}
