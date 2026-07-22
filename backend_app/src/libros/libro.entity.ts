import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EstadoLibro } from './estado-libro.entity';

@Entity('tbl_libros')
export class Libro {
  @PrimaryGeneratedColumn()
  id_libro!: number; 

  @Column({ type: 'varchar', length: 200 })
  titulo!: string;

  @Column({ type: 'varchar', length: 150 })
  autor!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tema!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  isbn!: string;

  @Column({ type: 'int', default: 1 })
  stock!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  editorial!: string;

  @Column({ type: 'int', default: 1 })
  id_estado_libro!: number;

  // Esta es la relación que completa los 9 errores
  @ManyToOne(() => EstadoLibro, (estado) => estado.libros)
  @JoinColumn({ name: 'id_estado_libro' })
  estado!: EstadoLibro;
}
