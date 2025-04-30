using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cefform.Models;
using Cefform.DTO;

namespace Cefform.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly CefformContext _context;

        public UsersController(CefformContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(uint id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpGet("{id}/form")]
        public async Task<ActionResult<List<Form>>> GetUserForms(uint id)
        {
            var forms = await _context.Forms.FromSql($"SELECT * FROM form WHERE user_iduser = {id}").ToListAsync();

            if (forms == null)
            {
                return NotFound();
            }

            return forms.ToList();
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PatchUser(uint id, UserDTO patch)
        {
            var userId = await _context.Users.AsNoTracking().Where(u => u.Token == patch.Token).Select(u => u.Iduser).FirstOrDefaultAsync();
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return BadRequest();
            }

            if (patch.Token != user.Token)
            {
                return BadRequest();
            }

            UserDTO.toUser(patch, user);
            await _context.SaveChangesAsync();

            return Ok(user);

        }

        private bool UserExists(uint id)
        {
            return _context.Users.Any(e => e.Iduser == id);
        }
    }
}
