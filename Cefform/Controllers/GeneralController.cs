using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.DirectoryServices.AccountManagement;
using System.Security.Cryptography;


namespace Cefform.Controllers
{
    [Route("")]
    [ApiController]
    public class GeneralController : ControllerBase
    {
        
        [HttpGet("login")]
        public IActionResult GetLogin(string user, string pwd)
        {
            string clear = Encryption.Instance.Decrypt(pwd);

            using (PrincipalContext pc = new PrincipalContext(ContextType.Domain, "INTRA.CEFF.CH"))
                if (pc.ValidateCredentials(user, pwd)) {
                    return Ok();
                }

            return BadRequest();

        }
    }
}
