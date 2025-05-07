using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cefform.Models;

namespace Cefform.Controllers
{
    [Route("api/response")]
    [ApiController]
    public class ResponsesController : ControllerBase
    {
        private readonly CefformContext _context;

        public ResponsesController(CefformContext context)
        {
            _context = context;
        }

        // GET: api/Responses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Response>>> GetResponses()
        {
            return await _context.Responses.ToListAsync();
        }

        // GET: api/Responses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Response>> GetResponse(uint id)
        {
            var response = await _context.Responses.FindAsync(id);

            if (response == null)
            {
                return NotFound();
            }

            return response;
        }

        // PUT: api/Responses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutResponse(uint id, Response response)
        {
            if (id != response.Idresponse)
            {
                return BadRequest();
            }

            _context.Entry(response).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ResponseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Responses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Response>> PostResponse(Response response)
        {
            _context.Responses.Add(response);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetResponse", new { id = response.Idresponse }, response);
        }

        // DELETE: api/Responses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResponse(uint id)
        {
            var response = await _context.Responses.FindAsync(id);
            if (response == null)
            {
                return NotFound();
            }

            _context.Responses.Remove(response);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ResponseExists(uint id)
        {
            return _context.Responses.Any(e => e.Idresponse == id);
        }
    }
}
