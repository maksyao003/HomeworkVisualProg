using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace commDB.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLogRecordModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Timestamp",
                table: "logs",
                newName: "timestamp");

            migrationBuilder.RenameColumn(
                name: "Source",
                table: "logs",
                newName: "source");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "logs",
                newName: "message");

            migrationBuilder.RenameColumn(
                name: "Level",
                table: "logs",
                newName: "level");

            migrationBuilder.RenameColumn(
                name: "Exception",
                table: "logs",
                newName: "exception");

            migrationBuilder.RenameColumn(
                name: "Action",
                table: "logs",
                newName: "action");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "logs",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "logs",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "RequestPath",
                table: "logs",
                newName: "request_path");

            migrationBuilder.AlterColumn<string>(
                name: "message",
                table: "logs",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "level",
                table: "logs",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "timestamp",
                table: "logs",
                newName: "Timestamp");

            migrationBuilder.RenameColumn(
                name: "source",
                table: "logs",
                newName: "Source");

            migrationBuilder.RenameColumn(
                name: "message",
                table: "logs",
                newName: "Message");

            migrationBuilder.RenameColumn(
                name: "level",
                table: "logs",
                newName: "Level");

            migrationBuilder.RenameColumn(
                name: "exception",
                table: "logs",
                newName: "Exception");

            migrationBuilder.RenameColumn(
                name: "action",
                table: "logs",
                newName: "Action");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "logs",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "logs",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "request_path",
                table: "logs",
                newName: "RequestPath");

            migrationBuilder.AlterColumn<string>(
                name: "Message",
                table: "logs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Level",
                table: "logs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
