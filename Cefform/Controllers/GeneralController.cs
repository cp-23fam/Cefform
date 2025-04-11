using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.DirectoryServices.AccountManagement;
using System.Security.Cryptography;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;


namespace Cefform.Controllers
{
    [Route("")]
    [ApiController]
    public class GeneralController : ControllerBase
    {
        
        [HttpPost("login")]
        public IActionResult GetLogin(string user, string pwd)
        {
            string clear = Encryption.Instance.Decrypt(pwd);

            using (PrincipalContext pc = new PrincipalContext(ContextType.Domain, "INTRA.CEFF.CH"))
                if (pc.ValidateCredentials(user, clear)) {
                    using (SHA512 sha512 = SHA512.Create())
                    {
                        byte[] inputBytes = Encoding.UTF8.GetBytes(user + DateTime.Now.ToString());
                        byte[] hashBytes = sha512.ComputeHash(inputBytes);
                        StringBuilder sb = new StringBuilder();
                        for (int i = 0; i < hashBytes.Length; i++)
                        {
                            sb.Append(hashBytes[i].ToString("X2"));
                        }
                        return Ok(sb.ToString());
                    }
                }

            return Unauthorized();

        }

        [HttpGet("publickey")]
        public IActionResult GetPublicKey()
        {
            return Ok(Encryption.Instance.PublicKey);
        }
    }
}
