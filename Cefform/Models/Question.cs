using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Cefform.Models;

public partial class Question
{
    public uint Idquestion { get; set; }

    public string Content { get; set; } = null!;

    public sbyte Type { get; set; }

    public int Page { get; set; }

    public uint FormIdform { get; set; }

    [JsonIgnore]
    public virtual Form? FormIdformNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Response> Responses { get; set; } = new List<Response>();
}
