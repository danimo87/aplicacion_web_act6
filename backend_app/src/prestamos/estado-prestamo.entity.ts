import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Prestamo } from './prestamo.entity';

@Entity('tbl_estado_prestamo')
export class EstadoPrestamo {
  @PrimaryGeneratedColumn()
  id_estado_prestamo!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre_estado!: string;

  @OneToMany(() => Prestamo, (prestamo) => prestamo.estado)
  prestamos!: Prestamo[];
}
