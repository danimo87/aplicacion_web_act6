import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('tbl_configuracion')
export class Configuracion {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  clave!: string;

  @Column({ type: 'text' })
  valor!: string;
}
