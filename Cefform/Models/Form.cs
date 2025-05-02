using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Cefform.Models;

public partial class Form
{
    public uint Idform { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    [JsonIgnore]
    public DateTime CreateTime { get; set; }

    [JsonIgnore]
    public DateTime EndTime { get; set; }

    public sbyte Anonym { get; set; }

    public sbyte Published { get; set; }

    public uint UserIduser { get; set; }

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();

    [JsonIgnore]
    public virtual User? UserIduserNavigation { get; set; } = null!;
}
