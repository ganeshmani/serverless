import { Migration } from '@mikro-orm/migrations';

export class Migration20240519193051 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "users" ("id" varchar(255) not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "users_pkey" primary key ("id"));');
    this.addSql('create index "users_id_index" on "users" ("id");');
  }

}
