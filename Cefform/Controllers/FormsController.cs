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
        public async Task<ActionResult<List<FormListDTO>>> GetFormsList(string? token)
        {
            List<Form>? forms;
            if (token != null)
            {
                uint? idUser = await _context.Users.AsNoTracking().Where(u => u.Token == token).Select(u => u.Iduser).FirstOrDefaultAsync();

                if (idUser == null)
                {
                    return BadRequest();
                }

                forms = await _context.Forms.FromSql($"SELECT * FROM form WHERE published = 1").ToListAsync();
            } else
            {
                forms = await _context.Forms.FromSql($"SELECT * FROM form WHERE published = 1 AND anonym = 1").ToListAsync();
            }
            
            var output = new List<FormListDTO>();

            foreach (var form in forms)
            {
                if (form.EndTime <= DateTime.Now)
                {
                    form.Published = 0;
                    await _context.SaveChangesAsync();
                    continue;
                }
                
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
            user.Token = "";

            form.UserIduserNavigation = user;
            await _context.Questions.FromSql($"SELECT * FROM question WHERE form_idform = {id}").ToListAsync();

            var output = new FormDTO { Name = form.Name, Description = form.Description, Anonym = (form.Anonym == 1), EndTime = form.EndTime, User = UserDTO.fromUser(form.UserIduserNavigation) };

            return output;
        }

        [HttpGet("{id}/questions")]
        public async Task<ActionResult<List<List<Question>>>> GetFormQuestions(uint id, int? page = null)
        {
            FormattableString sqlString = $"SELECT * FROM question WHERE form_idform = {id}";
            if (page != null) sqlString = $"SELECT * FROM question WHERE form_idform = {id} AND page = {page}";

            var questions = _context.Questions.FromSql(sqlString);
            var list = await questions.ToListAsync();
            List<List<Question>> output = [new List<Question> { }];

            foreach (var question in questions)
            {
                if (question.Page == 0) continue;
                if (page == null)
                {
                    if (output.Count < question.Page) output.Add(new List<Question> { });
                    output[question.Page - 1].Add(question);
                } else
                {
                    output[0].Add(question);
                }
            }


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

            form.EndTime = DateTime.Now.AddDays(30);
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

            form.EndTime = DateTime.Now.AddDays(30);

            if (user.Token != token)
            {
                return Unauthorized();
            }

            _context.Forms.Add(form);

            foreach (Question question in form.Questions)
            {
                if (question.Idquestion != form.Idform) return BadRequest();
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetForm", new { id = form.Idform }, form);
        }

        [HttpPost("{id}/submit")]
        public async Task<IActionResult> SubmitFormAnswer(uint id, SubmissionDTO submission)
        {
            var form = await _context.Forms.FindAsync(id);
            var sqlQuestions = await _context.Questions.FromSql($"SELECT * FROM question WHERE form_idform = {id}").ToListAsync();

            if (form == null)
            {
                return BadRequest();
            }

            var user = await _context.Users.FindAsync(submission.IdUser);

            if (form.Anonym == 0 && user == null)
            {
                return BadRequest();
            }

            form.Questions = sqlQuestions;

            if (form.Questions.Count != submission.Responses.Count || form.Idform != submission.IdForm)
            {
                return BadRequest();
            }

            List<Question> questions = form.Questions.ToList();
            for (int i = 0; i < submission.Responses.Count; i++)
            {
                var response = submission.Responses[i];

                response.QuestionIdquestion = questions[i].Idquestion;
                response.QuestionIdquestionNavigation = questions[i];

                if (form.Anonym == 0)
                {
                    response.UserIduser = user!.Iduser;
                    response.UserIduserNavigation = user;
                }
            }

            _context.AddRange(submission.Responses);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("{id}/answers")]
        public async Task<ActionResult<List<ResponseDTO>>> GetFormAnswers(uint id, string token, uint? userId)
        {
            uint? idUser = await _context.Users.AsNoTracking().Where(u => u.Token == token).Select(u => u.Iduser).FirstOrDefaultAsync();

            if (idUser == null)
            {
                return BadRequest();
            }

            var min = await _context.Questions.FromSql($"SELECT * FROM question WHERE form_idform = {id} ORDER BY idquestion LIMIT 1").FirstOrDefaultAsync();
            var max = await _context.Questions.FromSql($"SELECT * FROM question WHERE form_idform = {id} ORDER BY idquestion DESC LIMIT 1").FirstOrDefaultAsync();

            if (min == null || max == null)
            {
                return BadRequest();
            }

            List<Response> responses = [];
            if (userId != null)
            {
                var user = await _context.Users.FindAsync(userId);

                if (user == null)
                {
                    return BadRequest();
                }

                responses = await _context.Responses.FromSql($"SELECT * FROM cefform.response WHERE question_idquestion BETWEEN {min.Idquestion} AND {max.Idquestion} AND user_iduser = {user.Iduser}").ToListAsync();

            }

            responses = await _context.Responses.FromSql($"SELECT * FROM cefform.response WHERE question_idquestion BETWEEN {min.Idquestion} AND {max.Idquestion}").ToListAsync();

            List<ResponseDTO> output = [];
            foreach (Response rep in responses)
            {

                if (output.Where((e) => e.Content == rep.Content && e.QuestionIdquestion == rep.QuestionIdquestion).Count() > 0)
                {
                    output.Where((e) => e.Content == rep.Content && e.QuestionIdquestion == rep.QuestionIdquestion).ToList()[0].Count++;
                    continue;
                }

                output.Add(ResponseDTO.FromReponse(rep));
            }

            return output;
        }

        [HttpGet("{id}/answers/users")]
        public async Task<ActionResult<List<UserDTO>>> GetFormUserAnswer(uint id, string token)
        {
            uint? idUser = await _context.Users.AsNoTracking().Where(u => u.Token == token).Select(u => u.Iduser).FirstOrDefaultAsync();

            if (idUser == null)
            {
                return BadRequest();
            }

            var min = await _context.Questions.FromSql($"SELECT * FROM question WHERE form_idform = {id} ORDER BY idquestion LIMIT 1").FirstOrDefaultAsync();
            var max = await _context.Questions.FromSql($"SELECT * FROM question WHERE form_idform = {id} ORDER BY idquestion DESC LIMIT 1").FirstOrDefaultAsync();

            if (min == null || max == null)
            {
                return BadRequest();
            }
  
            var responses = await _context.Responses.FromSql($"SELECT * FROM cefform.response WHERE question_idquestion BETWEEN {min.Idquestion} AND {max.Idquestion}").ToListAsync();

            List<UserDTO> output = [];
            foreach (Response rep in responses)
            {
                var user = _context.Users.Find(rep.UserIduser);
                user.Token = "";

                if (output.Where((u) => u.Username == user.Username).Count() > 0)
                {
                    continue;
                }

                output.Add(UserDTO.fromUser(user!));
            }

            return output.ToHashSet().ToList();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutForm(uint id, [FromBody] Form form, string token)
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

            form.Idform = id;

            var min = await _context.Questions.FromSql($"SELECT * FROM question WHERE form_idform = {id} ORDER BY idquestion LIMIT 1").FirstOrDefaultAsync();
            var max = await _context.Questions.FromSql($"SELECT * FROM question WHERE form_idform = {id} ORDER BY idquestion DESC LIMIT 1").FirstOrDefaultAsync();

            if (min == null || max == null)
            {
                return BadRequest();
            }

            var responses = await _context.Responses.FromSql($"SELECT * FROM cefform.response WHERE question_idquestion BETWEEN {min.Idquestion} AND {max.Idquestion}").ToListAsync();
            _context.Responses.RemoveRange(responses);

            await _context.SaveChangesAsync();

            var dbq = _context.Questions.FromSql($"SELECT * FROM question WHERE form_idform = {id}");

            foreach (Question q in form.Questions)
            {
                q.FormIdform = form.Idform;

                var qid = await _context.Questions.AsNoTracking().Where(u => u.Content == q.Content).Select(u => u.Idquestion).FirstOrDefaultAsync();
                q.Idquestion = qid;
            }

            _context.Questions.RemoveRange(dbq);
            await _context.SaveChangesAsync();

            _context.Questions.AddRange(form.Questions);
            await _context.SaveChangesAsync();

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
