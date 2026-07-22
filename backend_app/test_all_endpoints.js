(async () => {
  const base = 'http://localhost:3000';
  const log = (k,v) => console.log(k, JSON.stringify(v, null, 2));
  try {
    // 1. GET libros
    let res = await fetch(`${base}/libros`);
    let libros = await res.json(); log('GET /libros count', {count: libros.length});

    // 2. Create libro with stock 1
    const isbnA = 'E2E-' + Date.now();
    res = await fetch(`${base}/libros`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({titulo:'E2E Libro A', autor:'Tester', tema:'E2E', isbn:isbnA, stock:1, editorial:'TestPub'})});
    const createdA = await res.json(); log('POST /libros createdA', createdA);

    // 3. Create libro with stock 0
    const isbnB = 'E2E-' + (Date.now()+1);
    res = await fetch(`${base}/libros`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({titulo:'E2E Libro B', autor:'Tester', tema:'E2E', isbn:isbnB, stock:0, editorial:'TestPub'})});
    const createdB = await res.json(); log('POST /libros createdB', createdB);

    // 4. Register a new usuario
    const email = 'e2e+' + Date.now() + '@utm.edu.ec';
    res = await fetch(`${base}/usuarios/registro`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({nombre:'E2E', apellido:'User', email, telefono:'0990001111', password:'123456'})});
    const reg = await res.json(); log('POST /usuarios/registro', {status: res.status, body: reg});

    // 5. Use created user id from registration response (avoid protected GET /usuarios)
    let userId = null;
    if (reg && reg.id_usuario) {
      userId = reg.id_usuario;
      log('created user id', { userId });
    } else {
      res = await fetch(`${base}/usuarios`);
      const usuarios = await res.json();
      const user = Array.isArray(usuarios) ? (usuarios.find(u=>u.email===email) || usuarios[0]) : null;
      log('found user', user);
      userId = user?.id_usuario;
    }

    // 6. Create prestamo for libro A
    // Find libro A id
    res = await fetch(`${base}/libros`);
    const allLibros = await res.json();
    const libroA = allLibros.find(l=>l.isbn===isbnA);
    const libroB = allLibros.find(l=>l.isbn===isbnB);
    log('libroA,B', {libroA, libroB});
    res = await fetch(`${base}/prestamos`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id_usuario: userId, id_libro: libroA.id_libro})});
    const prest = await res.json(); log('POST /prestamos', {status: res.status, body: prest});
    const prestId = prest.prestamo?.id_prestamo || prest.id_prestamo || null;

    // 7. Renovar prestamo
    if (prestId) {
      res = await fetch(`${base}/prestamos/${prestId}/renovar`, {method:'PATCH'});
      const ren = await res.json(); log('PATCH renovar', {status: res.status, body: ren});

      // 8. Devolver prestamo
      res = await fetch(`${base}/prestamos/${prestId}/devolucion`, {method:'PATCH'});
      const dev = await res.json(); log('PATCH devolucion', {status: res.status, body: dev});
    }

    // 9. Create reserva for libro B (stock 0) should succeed
    res = await fetch(`${base}/reservas`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id_usuario: userId, id_libro: libroB.id_libro})});
    const reserva = await res.json(); log('POST /reservas (libroB)', {status: res.status, body: reserva});

    // 10. Get reportes prestamos and inventario
    res = await fetch(`${base}/reportes/prestamos`); const repP = await res.json(); log('GET /reportes/prestamos count', {count: repP.length});
    res = await fetch(`${base}/reportes/inventario`); const repI = await res.json(); log('GET /reportes/inventario count', {count: repI.length});

    // 11. Final lists
    res = await fetch(`${base}/reservas`); const listR = await res.json(); log('GET /reservas count', {count: listR.length});
    res = await fetch(`${base}/libros`); const listL = await res.json(); log('GET /libros count', {count: listL.length});

    console.log('\nE2E completed');
  } catch (e) {
    console.error('E2E ERROR', e && e.message);
  }
})();
