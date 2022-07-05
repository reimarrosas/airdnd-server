import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("users", (t) => {
      t.bigIncrements("id").primary();
      t.text("fullName").notNullable();
      t.text("email").notNullable();
      t.text("password").notNullable();
      t.text("phoneNumber").notNullable();
      t.text("extension");
      t.boolean("isVerified").defaultTo(false);
      t.timestamp("createdAt").defaultTo(knex.fn.now());
      t.timestamp("updatedAt").defaultTo(knex.fn.now());
    })
    .createTable("verifications", (t) => {
      t.text("id").primary();
      t.bigInteger("userId")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("verifications").dropTable("users");
}
