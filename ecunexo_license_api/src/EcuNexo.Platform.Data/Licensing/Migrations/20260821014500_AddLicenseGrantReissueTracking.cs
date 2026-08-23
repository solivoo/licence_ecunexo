using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EcuNexo.Platform.Data.Licensing.Migrations
{
    /// <inheritdoc />
    public partial class AddLicenseGrantReissueTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "generation",
                schema: "licensing",
                table: "license_grants",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<string>(
                name: "previous_plan_code",
                schema: "licensing",
                table: "license_grants",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "previous_plan_label",
                schema: "licensing",
                table: "license_grants",
                type: "character varying(120)",
                maxLength: 120,
                nullable: true);

            migrationBuilder.AddColumn<short>(
                name: "reissue_kind",
                schema: "licensing",
                table: "license_grants",
                type: "smallint",
                nullable: true);

            migrationBuilder.Sql(
                """
                WITH RECURSIVE chain AS (
                    SELECT id, supersedes_grant_id, 1 AS gen
                    FROM licensing.license_grants
                    WHERE supersedes_grant_id IS NULL
                    UNION ALL
                    SELECT g.id, g.supersedes_grant_id, chain.gen + 1
                    FROM licensing.license_grants g
                    INNER JOIN chain ON g.supersedes_grant_id = chain.id
                )
                UPDATE licensing.license_grants g
                SET generation = chain.gen
                FROM chain
                WHERE g.id = chain.id;
                """);

            migrationBuilder.Sql(
                """
                UPDATE licensing.license_grants g
                SET
                    reissue_kind = CASE
                        WHEN prev.plan_code IS DISTINCT FROM g.plan_code THEN 1
                        ELSE 0
                    END,
                    previous_plan_code = prev.plan_code,
                    previous_plan_label = prev.plan_label
                FROM licensing.license_grants prev
                WHERE g.supersedes_grant_id = prev.id;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "generation",
                schema: "licensing",
                table: "license_grants");

            migrationBuilder.DropColumn(
                name: "previous_plan_code",
                schema: "licensing",
                table: "license_grants");

            migrationBuilder.DropColumn(
                name: "previous_plan_label",
                schema: "licensing",
                table: "license_grants");

            migrationBuilder.DropColumn(
                name: "reissue_kind",
                schema: "licensing",
                table: "license_grants");
        }
    }
}
