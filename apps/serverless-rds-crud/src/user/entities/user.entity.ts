import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export default class User {
  @Index()
  @PrimaryKey()
  id: string;

  @Property({ type: 'text' })
  name!: string;

  @Property({ defaultRaw: 'NOW()' })
  createdAt: Date = new Date();

  @Property({ defaultRaw: 'NOW()', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
