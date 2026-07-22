const sqlite3 = require('better-sqlite3');
const fs = require('fs');
const dbFile = 'database.sqlite';
console.log('DB file:', dbFile, 'exists:', fs.existsSync(dbFile));
if (!fs.existsSync(dbFile)) process.exit(1);
const db = sqlite3(dbFile, { readonly: true });
function showCount(name, q) {
  try {
    const r = db.prepare(q).get();
    console.log(name, r);
  } catch (e) {
    console.error(name, 'ERROR', e && e.message);
  }
}
showCount('prestamos_count', "SELECT count(*) as c FROM tbl_prestamos");
showCount('reservas_count', "SELECT count(*) as c FROM tbl_reservas");
showCount('usuarios_count', "SELECT count(*) as c FROM tbl_usuarios");
showCount('libros_count', "SELECT count(*) as c FROM tbl_libros");
try {
  const samplePrest = db.prepare("SELECT id_prestamo, id_usuario, id_libro, fecha_prestamo, fecha_devolucion, fecha_devolucion_real, id_estado_prestamo FROM tbl_prestamos ORDER BY id_prestamo DESC LIMIT 10").all();
  console.log('sample_prestamos', samplePrest);
} catch (e) {
  console.error('sample_prestamos ERROR', e && e.message);
}
try {
  const sampleReservas = db.prepare("SELECT id_reserva, id_usuario, id_libro, fecha_reserva, id_estado_reserva FROM tbl_reservas ORDER BY id_reserva DESC LIMIT 10").all();
  console.log('sample_reservas', sampleReservas);
} catch (e) {
  console.error('sample_reservas ERROR', e && e.message);
}
db.close();
