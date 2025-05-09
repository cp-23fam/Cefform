using Cefform.DTO;
using Cefform.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using System.DirectoryServices.AccountManagement;
using System.Security.Cryptography;
using System.Text;


namespace Cefform.Controllers
{
    [Route("api/")]
    [ApiController]
    public class GeneralController : ControllerBase
    {
        private readonly CefformContext _context;

        public GeneralController(CefformContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        async public Task<IActionResult> GetLogin(string user, string pwd)
        {
            string clear = Encryption.Instance.Decrypt(pwd);

            using (PrincipalContext pc = new(ContextType.Domain, "INTRA.CEFF.CH"))
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

                        string token = sb.ToString();

                        var userId = await _context.Users.AsNoTracking().Where(u => u.Username == user).Select(u => u.Iduser).FirstOrDefaultAsync();

                        if (userId != 0)
                        {
                            User? dbUser = await _context.Users.FindAsync(userId);

                            if (dbUser != null)
                            {
                                dbUser.Token = token;

                                await _context.SaveChangesAsync();
                            }
                        } else
                        {
                            _context.Users.Add(new User() { Username = user, Token = sb.ToString(), Ceff = 0 });
                            await _context.SaveChangesAsync();
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

        [HttpGet("token")]
        async public Task<ActionResult<UserDTO>> VerifyToken(string token)
        {
            var user = await _context.Users.FromSql($"SELECT * from user WHERE token = {token}").ToListAsync();

            if (user == null || user.Count < 1)
            {
                return NotFound();
            }

            return UserDTO.fromUser(user[0]);
        }
    }
}
