import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Libro } from '../libros/libro.entity';
import { EstadoReserva } from './estado-reserva.entity';

@Entity('tbl_reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id_reserva!: number;

  @Column({ type: 'int' })
  id_usuario!: number;

  @Column({ type: 'int' })
  id_libro!: number;

  @Column({ type: 'int', default: 1 })
  id_estado_reserva!: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @ManyToOne(() => Libro)
  @JoinColumn({ name: 'id_libro' })
  libro!: Libro;

  @ManyToOne(() => EstadoReserva)
  @JoinColumn({ name: 'id_estado_reserva' })
  estado!: EstadoReserva;
}
