import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Libro } from '../libros/libro.entity';
import { EstadoPrestamo } from './estado-prestamo.entity';

@Entity('tbl_prestamos')
export class Prestamo {
  @PrimaryGeneratedColumn()
  id_prestamo!: number;

  @Column({ type: 'int' })
  id_usuario!: number;

  @Column({ type: 'int' })
  id_libro!: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_prestamo!: string;

  @Column({ type: 'date' })
  fecha_devolucion!: string;

  @Column({ type: 'date', nullable: true })
  fecha_devolucion_real?: string;

  @Column({ type: 'int', default: 1 })
  id_estado_prestamo!: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @ManyToOne(() => Libro)
  @JoinColumn({ name: 'id_libro' })
  libro!: Libro;

  @ManyToOne(() => EstadoPrestamo)
  @JoinColumn({ name: 'id_estado_prestamo' })
  estado!: EstadoPrestamo;
}
