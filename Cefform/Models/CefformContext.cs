using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace Cefform.Models;

public partial class CefformContext : DbContext
{
    public CefformContext()
    {
    }

    public CefformContext(DbContextOptions<CefformContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Form> Forms { get; set; }

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<Response> Responses { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=192.168.20.129;database=cefform;user=root;password=password", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.41-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb3_general_ci")
            .HasCharSet("utf8mb3");

        modelBuilder.Entity<Form>(entity =>
        {
            entity.HasKey(e => e.Idform).HasName("PRIMARY");

            entity.ToTable("form");

            entity.HasIndex(e => e.UserIduser, "fk_form_user_idx");

            entity.Property(e => e.Idform).HasColumnName("idform");
            entity.Property(e => e.Anonym).HasColumnName("anonym");
            entity.Property(e => e.Description)
                .HasMaxLength(125)
                .HasColumnName("description");
            entity.Property(e => e.EndTime)
                .HasColumnType("datetime")
                .HasColumnName("end_time");
            entity.Property(e => e.Name)
                .HasMaxLength(60)
                .HasColumnName("name");
            entity.Property(e => e.Published).HasColumnName("published");
            entity.Property(e => e.UserIduser).HasColumnName("user_iduser");

            entity.HasOne(d => d.UserIduserNavigation).WithMany(p => p.Forms)
                .HasForeignKey(d => d.UserIduser)
                .HasConstraintName("fk_form_user");
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.Idquestion).HasName("PRIMARY");

            entity.ToTable("question");

            entity.HasIndex(e => e.FormIdform, "fk_question_form1_idx");

            entity.Property(e => e.Idquestion).HasColumnName("idquestion");
            entity.Property(e => e.Content)
                .HasMaxLength(235)
                .HasColumnName("content");
            entity.Property(e => e.FormIdform).HasColumnName("form_idform");
            entity.Property(e => e.Page)
                .HasDefaultValueSql("'1'")
                .HasColumnName("page");
            entity.Property(e => e.Type).HasColumnName("type");

            entity.HasOne(d => d.FormIdformNavigation).WithMany(p => p.Questions)
                .HasForeignKey(d => d.FormIdform)
                .HasConstraintName("fk_question_form");
        });

        modelBuilder.Entity<Response>(entity =>
        {
            entity.HasKey(e => e.Idresponse).HasName("PRIMARY");

            entity.ToTable("response");

            entity.HasIndex(e => e.QuestionIdquestion, "fk_response_question1_idx");

            entity.HasIndex(e => e.UserIduser, "fk_response_user1_idx");

            entity.Property(e => e.Idresponse).HasColumnName("idresponse");
            entity.Property(e => e.Content)
                .HasMaxLength(300)
                .HasColumnName("content");
            entity.Property(e => e.QuestionIdquestion).HasColumnName("question_idquestion");
            entity.Property(e => e.UserIduser).HasColumnName("user_iduser");

            entity.HasOne(d => d.QuestionIdquestionNavigation).WithMany(p => p.Responses)
                .HasForeignKey(d => d.QuestionIdquestion)
                .HasConstraintName("fk_response_question");

            entity.HasOne(d => d.UserIduserNavigation).WithMany(p => p.Responses)
                .HasForeignKey(d => d.UserIduser)
                .HasConstraintName("fk_response_user1");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Iduser).HasName("PRIMARY");

            entity.ToTable("user");

            entity.HasIndex(e => e.Username, "UNIQUE");

            entity.Property(e => e.Iduser).HasColumnName("iduser");
            entity.Property(e => e.Ceff)
                .HasDefaultValueSql("'-1'")
                .HasColumnName("ceff");
            entity.Property(e => e.Email)
                .HasMaxLength(115)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(40)
                .HasColumnName("first_name");
            entity.Property(e => e.LastName)
                .HasMaxLength(60)
                .HasColumnName("last_name");
            entity.Property(e => e.Token)
                .HasMaxLength(255)
                .HasColumnName("token");
            entity.Property(e => e.Username)
                .HasMaxLength(10)
                .HasColumnName("username");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
