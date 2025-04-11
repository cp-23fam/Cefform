using Cefform.Models;

namespace Cefform.DTO
{
    public class UserDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int Ceff {  get; set; }

        public static UserDTO fromUser(User user)
        {
            return new UserDTO { FirstName = user.FirstName, LastName = user.LastName, Email = user.Email, Ceff = user.Ceff };
        }
    }
}
