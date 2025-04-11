using Cefform.Models;

namespace Cefform.DTO
{
    public class FormDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateOnly CreateTime { get; set; }
        public DateOnly EndTime { get; set; }
        public bool Anonym {  get; set; }
        public UserDTO User { get; set; }
        public int Questions { get; set; }
    }
}
