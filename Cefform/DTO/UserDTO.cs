using Cefform.Models;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using NuGet.Common;

namespace Cefform.DTO
{
    public class UserDTO
    {
        public uint Id { get; set; }
        public string? Username { get; set; }
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string Email { get; set; } = "";
        public int Ceff {  get; set; }
        public string? Token { get; set; }

        public static UserDTO fromUser(User user)
        {
            return new UserDTO { FirstName = user.FirstName ?? "", LastName = user.LastName ?? "", Email = user.Email ?? "", Ceff = user.Ceff, Id = user.Iduser };
        }

        public static User toUser(UserDTO dto, User? user = null) { 
            if (user == null)
            {
                return new User() { Iduser = dto.Id, Username = dto.Username ?? "", FirstName = dto.FirstName, LastName = dto.LastName, Email = dto.Email, Ceff = Convert.ToSByte(dto.Ceff) };
            } else
            {
                user.Username = dto.Username ?? user.Username;
                user.FirstName = dto.FirstName;
                user.LastName = dto.LastName;
                user.Email = dto.Email;
                user.Ceff = Convert.ToSByte(dto.Ceff);

                return user;
            }
        }
    }
}
