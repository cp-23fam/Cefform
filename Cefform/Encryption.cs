using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.DataProtection.XmlEncryption;

namespace Cefform
{
    public class Encryption
    {
        private string PrivateKey { get; set; }
        public string PublicKey { get; set; }

        public static Encryption Instance = new Encryption();
        public Encryption() {
            using (var rsa = new RSACryptoServiceProvider(2048))
            {
                // Export public key
                string publicKey = rsa.ExportSubjectPublicKeyInfoPem();
                PublicKey = publicKey;


                // Export private key
                string privateKey = rsa.ToXmlString(true);
                PrivateKey = privateKey;
            }
        }

        public string Decrypt(string encrypted)
        {
            using (var rsa = new RSACryptoServiceProvider(2048))
            {
                rsa.FromXmlString(PrivateKey);

                var resultBytes = Convert.FromBase64String(encrypted);
                var bytes = rsa.Decrypt(resultBytes, true);
                var decryptedData = Encoding.UTF8.GetString(bytes);
                return decryptedData.ToString();
            }

        }
    }
}
