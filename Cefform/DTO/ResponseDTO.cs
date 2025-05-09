using Cefform.Models;

namespace Cefform.DTO
{
    public class ResponseDTO
    {
        public int Count { get; set; }
        public string Content { get; set; }

        public uint QuestionIdquestion { get; set; }

        public static ResponseDTO FromReponse(Response response)
        {
            return new ResponseDTO { Content = response.Content, QuestionIdquestion = response.QuestionIdquestion, Count = 1 };
        }
    }
}
