import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'tbl_rol' })
export class Rol {
  @PrimaryGeneratedColumn()
  id_rol!: number; 

  @Column({ unique: true })
  nombre_rol!: string; 
}