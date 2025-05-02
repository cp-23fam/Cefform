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

    public virtual DbSet<Answerer> Answerers { get; set; }

    public virtual DbSet<Form> Forms { get; set; }

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<Response> Responses { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseMySql("server=192.168.20.129;database=cefform;user=root;password=password", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.41-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb3_general_ci")
            .HasCharSet("utf8mb3");

        modelBuilder.Entity<Answerer>(entity =>
        {
            entity.HasKey(e => e.Idanswerer).HasName("PRIMARY");

            entity.ToTable("answerer");

            entity.Property(e => e.Idanswerer).HasColumnName("idanswerer");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
        });

        modelBuilder.Entity<Form>(entity =>
        {
            entity.HasKey(e => e.Idform).HasName("PRIMARY");

            entity.ToTable("form");

            entity.HasIndex(e => e.UserIduser, "fk_form_user_idx");

            entity.Property(e => e.Idform).HasColumnName("idform");
            entity.Property(e => e.Anonym).HasColumnName("anonym");
            entity.Property(e => e.CreateTime)
                .HasColumnType("datetime")
                .HasColumnName("create_time");
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

            entity.HasIndex(e => e.AnswererIdanswerer, "fk_response_answerer1_idx");

            entity.HasIndex(e => e.QuestionIdquestion, "fk_response_question1_idx");

            entity.Property(e => e.Idresponse).HasColumnName("idresponse");
            entity.Property(e => e.AnswererIdanswerer).HasColumnName("answerer_idanswerer");
            entity.Property(e => e.Content)
                .HasMaxLength(300)
                .HasColumnName("content");
            entity.Property(e => e.QuestionIdquestion).HasColumnName("question_idquestion");

            entity.HasOne(d => d.AnswererIdanswererNavigation).WithMany(p => p.Responses)
                .HasForeignKey(d => d.AnswererIdanswerer)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_response_answerer1");

            entity.HasOne(d => d.QuestionIdquestionNavigation).WithMany(p => p.Responses)
                .HasForeignKey(d => d.QuestionIdquestion)
                .HasConstraintName("fk_response_question");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Iduser).HasName("PRIMARY");

            entity.ToTable("user");

            entity.HasIndex(e => e.Username, "UNIQUE");

            entity.Property(e => e.Iduser).HasColumnName("iduser");
            entity.Property(e => e.Ceff).HasColumnName("ceff");
            entity.Property(e => e.Email)
                .HasMaxLength(115)
                .HasColumnName("email");
            entity.Property(e => e.Expiration)
                .HasColumnType("datetime")
                .HasColumnName("expiration");
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
