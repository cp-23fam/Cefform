using Cefform.Models;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;

namespace Cefform.DTO
{
    public class UserDTO
    {
        public uint Id { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int Ceff {  get; set; }

        public static UserDTO fromUser(User user)
        {
            return new UserDTO { FirstName = user.FirstName ?? "", LastName = user.LastName ?? "", Email = user.Email ?? "", Ceff = user.Ceff, Id = user.Iduser, Username = user.Username };
        }
    }
}
