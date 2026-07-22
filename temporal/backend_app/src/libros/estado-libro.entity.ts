import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Libro } from './libro.entity';
@Entity('tbl_estado_libro')
export class EstadoLibro {
  @PrimaryGeneratedColumn()
  id_estado_libro!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre_estado!: string;

  @OneToMany(() => Libro, (libro) => libro.estado)
  libros!: Libro[];
}