import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reserva } from './reserva.entity';

@Entity('tbl_estado_reserva')
export class EstadoReserva {
  @PrimaryGeneratedColumn()
  id_estado_reserva!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre_estado!: string;

  @OneToMany(() => Reserva, (reserva) => reserva.estado)
  reservas!: Reserva[];
}
