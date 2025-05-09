using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Cefform.Models;

public partial class User
{
    public uint Iduser { get; set; }

    public string Username { get; set; } = null!;

    public string Token { get; set; } = null!;

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Email { get; set; }

    public sbyte Ceff { get; set; } = 0;

    [JsonIgnore]
    public virtual ICollection<Form> Forms { get; set; } = new List<Form>();
}
