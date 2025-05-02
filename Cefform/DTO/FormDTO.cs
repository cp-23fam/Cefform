using Cefform.Models;

namespace Cefform.DTO
{
    public class FormDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreateTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool Anonym {  get; set; }
        public UserDTO User { get; set; }
    }
}
