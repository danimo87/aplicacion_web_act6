const path = require('path');
const fs = require('fs');
const dbFile = path.resolve(__dirname, 'database.sqlite');
console.log('DB file:', dbFile, 'exists:', fs.existsSync(dbFile));
if (!fs.existsSync(dbFile)) process.exit(0);
const sqlite3 = require('./node_modules/better-sqlite3');
const db = sqlite3(dbFile, { readonly: true });
function show(name, rows) {
  console.log('\n== ' + name + ' (' + rows.length + ') ==');
  console.log(rows.slice(0,50));
}
try {
  const prestamos = db.prepare("SELECT * FROM tbl_prestamos").all();
  show('tbl_prestamos', prestamos);
  const reservas = db.prepare("SELECT * FROM tbl_reservas").all();
  show('tbl_reservas', reservas);
  const usuarios = db.prepare("SELECT id_usuario, nombre, apellido, email FROM tbl_usuarios").all();
  show('tbl_usuarios', usuarios);
  const libros = db.prepare("SELECT id_libro, titulo, autor, stock, id_estado_libro FROM tbl_libros").all();
  show('tbl_libros', libros);
  const reporte = db.prepare(`SELECT 
    p.id_prestamo, u.nombre || ' ' || u.apellido AS usuario, u.email AS usuario_email, l.titulo AS libro_titulo,
    l.autor AS libro_autor, p.fecha_prestamo, p.fecha_devolucion, p.fecha_devolucion_real, ep.nombre_estado AS estado_prestamo
    FROM tbl_prestamos p
    INNER JOIN tbl_usuarios u ON p.id_usuario = u.id_usuario
    INNER JOIN tbl_libros l ON p.id_libro = l.id_libro
    LEFT JOIN tbl_estado_prestamo ep ON p.id_estado_prestamo = ep.id_estado_prestamo
    ORDER BY p.fecha_prestamo DESC`).all();
  show('reporte_prestamos', reporte);
} catch (e) {
  console.error('ERROR QUERY', e && e.message);
} finally {
  db.close();
}
