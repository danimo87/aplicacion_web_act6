const Database = require('better-sqlite3');
const db = new Database('database.sqlite', { readonly: true });
function info(table) {
  try {
    const rows = db.prepare(`PRAGMA table_info('${table}')`).all();
    console.log('\nPRAGMA for', table);
    console.log(rows);
  } catch (e) {
    console.error('ERROR PRAGMA', table, e && e.message);
  }
}
info('tbl_reservas');
info('tbl_prestamos');
info('tbl_libros');
info('tbl_usuarios');
db.close();
