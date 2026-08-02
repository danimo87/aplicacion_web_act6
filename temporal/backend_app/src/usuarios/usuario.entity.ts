import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Rol } from './rol.entity';

@Entity({ name: 'tbl_usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario!: number;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  telefono!: string;

  @Column()
  password!: string;

  @Column({ default: 1 })
  id_rol!: number; 

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'id_rol' })
  rol!: Rol;
}