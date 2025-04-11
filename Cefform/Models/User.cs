using System;
using System.Collections.Generic;

namespace Cefform.Models;

public partial class User
{
    public uint Iduser { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public sbyte Ceff { get; set; }

    public virtual ICollection<Form> Forms { get; set; } = new List<Form>();
}
