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

        [HttpGet("{id}/form")]
        public async Task<ActionResult<List<Form>>> GetUserForms(uint id, string token)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return BadRequest();
            }

            if (token != user.Token)
            {
                return Unauthorized();
            }

            var forms = await _context.Forms.FromSql($"SELECT * FROM form WHERE user_iduser = {id}").ToListAsync();

            if (forms == null)
            {
                return NotFound();
            }

            return forms.ToList();
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PatchUser(UserDTO patch)
        {
            var userId = await _context.Users.AsNoTracking().Where(u => u.Token == patch.Token).Select(u => u.Iduser).FirstOrDefaultAsync();
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return BadRequest();
            }

            if (patch.Token != user.Token)
            {
                return Unauthorized();
            }

            UserDTO.toUser(patch, user);
            await _context.SaveChangesAsync();

            return Ok(user);

        }
    }
}
