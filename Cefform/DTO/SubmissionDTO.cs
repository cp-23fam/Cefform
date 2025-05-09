using Cefform.Models;

namespace Cefform.DTO
{
    public class SubmissionDTO
    {
        public uint IdForm {  get; set; }
        public uint? IdUser { get; set; }
        public List<Response> Responses { get; set; }
    }
}
