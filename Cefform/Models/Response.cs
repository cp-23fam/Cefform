using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Cefform.Models;

public partial class Response
{
    public uint Idresponse { get; set; }

    public string Content { get; set; } = null!;

    public uint QuestionIdquestion { get; set; }

    public uint? UserIduser { get; set; }

    [JsonIgnore]
    public virtual Question? QuestionIdquestionNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual User? UserIduserNavigation { get; set; }
}
