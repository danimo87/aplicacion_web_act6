import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Libro } from './libro.entity';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro)
    private librosRepository: Repository<Libro>,
  ) {}

  // 📖 Consulta general del catálogo (Ordenado Alfabéticamente)
  async obtenerCatalogo(): Promise<Libro[]> {
    return this.librosRepository.find({
      relations: { estado: true },
      order: { titulo: 'ASC' },
    });
  }

  // 🔍 Búsqueda avanzada multivariable
  async buscarLibros(filtros: { titulo?: string; autor?: string; tema?: string; isbn?: string }): Promise<Libro[]> {
    const { titulo, autor, tema, isbn } = filtros;
    const condiciones: any = {};

    if (titulo) condiciones.titulo = ILike(`%${titulo}%`);
    if (autor) condiciones.autor = ILike(`%${autor}%`);
    if (tema) condiciones.tema = ILike(`%${tema}%`);
    if (isbn) condiciones.isbn = isbn;

    return this.librosRepository.find({
      where: condiciones,
      relations: { estado: true },
    });
  }

  // 🆔 Buscar un libro específico por su ID (Para la vista de detalles)
  async obtenerPorId(id: number): Promise<Libro> {
    const libro = await this.librosRepository.findOne({
      where: { id_libro: id }, 
      relations: { estado: true },
    });
    if (!libro) {
      throw new NotFoundException(`El libro con ID ${id} no existe en la biblioteca.`);
    }
    return libro;
  }

// 📝 Registrar un nuevo libro en el catálogo
async crearLibro(datosLibro: Partial<Libro>): Promise<Libro> { 
  const nuevoLibro = this.librosRepository.create(datosLibro);
  return this.librosRepository.save(nuevoLibro);
}

  // 🔄 Modificar datos de un libro (Stock, Estado, Título, etc.)
  async actualizarLibro(id: number, datosActualizar: any): Promise<Libro> {
    await this.obtenerPorId(id); 
    await this.librosRepository.update(id, datosActualizar);
    return this.obtenerPorId(id); 
  }

  // 🗑️ Eliminar un libro físicamente del sistema
  async eliminarLibro(id: number): Promise<void> {
    await this.obtenerPorId(id); 
    await this.librosRepository.delete(id);
  }
}