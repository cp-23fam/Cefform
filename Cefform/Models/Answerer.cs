using System;
using System.Collections.Generic;

namespace Cefform.Models;

public partial class Answerer
{
    public uint Idanswerer { get; set; }

    public string Email { get; set; } = null!;

    public virtual ICollection<Response> Responses { get; set; } = new List<Response>();
}
