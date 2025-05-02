using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cefform.Models;
using Cefform.DTO;
using MySqlConnector;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Cefform.Controllers
{
    [Route("api/form/")]
    [ApiController]
    public class FormsController : ControllerBase
    {
        private readonly CefformContext _context;

        public FormsController(CefformContext context)
        {
            _context = context;
        }

        [HttpGet("list")]
        public async Task<ActionResult<List<FormListDTO>>> GetFormsList()
        {

            var forms = await _context.Forms.FromSql($"SELECT * FROM form WHERE published = 1").ToListAsync();
            var output = new List<FormListDTO>();

            foreach (var form in forms)
            {
                var user = await _context.Users.FindAsync(form.UserIduser);

                if (user == null)
                {
                    return NotFound();
                }

                form.UserIduserNavigation = user;

                output.Add(new FormListDTO { Name = form.Name, Description = form.Description, Id = form.Idform, Author = form.UserIduserNavigation!.Email ?? form.UserIduserNavigation!.Username, Ceff = form.UserIduserNavigation.Ceff });
            }

            return output;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FormDTO>> GetForm(uint id)
        {
            var form = await _context.Forms.FindAsync(id);
            var user = await _context.Users.FindAsync(form?.UserIduser);

            if (form == null || user == null)
            {
                return NotFound();
            }

            form.UserIduserNavigation = user;
            await _context.Questions.FromSql($"SELECT * FROM question WHERE form_idform = {id}").ToListAsync();

            var output = new FormDTO { Name = form.Name, Description = form.Description, Anonym = (form.Anonym == 1), CreateTime = form.CreateTime, EndTime = form.EndTime, User = UserDTO.fromUser(form.UserIduserNavigation) };

            return output;
        }

        [HttpGet("{id}/questions")]
        public async Task<ActionResult<List<Question>>> GetFormQuestions(uint id, int page = 1)
        {
            var questions = _context.Questions.FromSql($"SELECT * FROM question WHERE form_idform = {id} AND page = {page}");

            var output = await questions.ToListAsync();

            return output;
        }

        [HttpPatch("{id}/publish")]
        public async Task<IActionResult> PublishForm(uint id, string token)
        {
            var form = await _context.Forms.FindAsync(id);
            var user = await _context.Users.FindAsync(form?.UserIduser);

            if (form == null || user == null)
            {
                return NotFound();
            }

            form.UserIduserNavigation = user;

            if (form.UserIduserNavigation!.Token != token)
            {
                return Unauthorized();
            }

            form.Published = 1;

            await _context.SaveChangesAsync();

            return Ok(form);
        }
        
        [HttpPatch("{id}/hide")]
        public async Task<IActionResult> HideForm(uint id, string token)
        {
            var form = await _context.Forms.FindAsync(id);
            var user = await _context.Users.FindAsync(form?.UserIduser);

            if (form == null || user == null)
            {
                return NotFound();
            }

            form.UserIduserNavigation = user;

            if (form.UserIduserNavigation!.Token != token)
            {
                return Unauthorized();
            }

            form.Published = 0;

            await _context.SaveChangesAsync();

            return Ok(form);
        }

        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Form>> PostForm(Form form, string token)
        {
            var user = await _context.Users.FindAsync(form.UserIduser);
            if (user == null)
            {
                return BadRequest();
            }

            form.UserIduserNavigation = user;

            form.CreateTime = DateTime.Now;
            form.EndTime = DateTime.Now.AddDays(10);

            if (user.Token != token)
            {
                Unauthorized();
            }

            _context.Forms.Add(form);

            foreach (Question question in form.Questions)
            {
                if (question.Idquestion != form.Idform) return BadRequest();
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetForm", new { id = form.Idform }, form);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutForm(uint id, Form form, string token)
        {
            var user = await _context.Users.FindAsync(form.UserIduser);
            if (user == null)
            {
                return BadRequest();
            }

            form.UserIduserNavigation = user;

            if (user.Token != token)
            { 
                return Unauthorized();
            }

            _context.Entry(form).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteForm(uint id, string token)
        {
            var form = await _context.Forms.FindAsync(id);
            var user = await _context.Users.FindAsync(form?.UserIduser);

            if (form == null || user == null)
            {
                return NotFound();
            }

            form.UserIduserNavigation = user;
            if (form.UserIduserNavigation!.Token != token)
            {
                return Unauthorized();
            }

            _context.Forms.Remove(form);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
