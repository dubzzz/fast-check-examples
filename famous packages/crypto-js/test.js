import * as fc from 'fast-check';
const CryptoJS = require('crypto-js');

const propertyDecryptItSelf = algorithmName => {
  it(`[${algorithmName}] should decrypt to original message`, () => {
    fc.assert(
      fc.property(fc.fullUnicodeString(), fc.fullUnicodeString(), (message, secret) => {
        const ciphertext = CryptoJS[algorithmName].encrypt(message, secret);
        const bytes = CryptoJS[algorithmName].decrypt(ciphertext.toString(), secret);
        const plaintext = bytes.toString(CryptoJS.enc.Utf8);
        return message === plaintext;
      })
    );
  });
};

describe('crypto-js', () => {
  propertyDecryptItSelf('AES');
  propertyDecryptItSelf('DES');
  propertyDecryptItSelf('TripleDES');
  propertyDecryptItSelf('RC4');
  propertyDecryptItSelf('RC4Drop');
  propertyDecryptItSelf('Rabbit');
  propertyDecryptItSelf('RabbitLegacy');
});
