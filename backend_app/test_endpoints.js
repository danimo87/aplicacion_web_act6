(async () => {
  try {
    console.log('GET /reportes/prestamos');
    let res = await fetch('http://localhost:3000/reportes/prestamos');
    let json = await res.json();
    console.log('reportes/prestamos ->', JSON.stringify(json, null, 2));

    console.log('\nGET /reservas');
    res = await fetch('http://localhost:3000/reservas');
    json = await res.json();
    console.log('reservas ->', JSON.stringify(json, null, 2));

    // Intentar crear una reserva (usuario 4, libro 3) — si falla, lo ignoramos
    console.log('\nPOST /reservas (crear)');
    try {
      res = await fetch('http://localhost:3000/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: 4, id_libro: 3 }),
      });
      const created = await res.json();
      console.log('create reserva ->', JSON.stringify(created, null, 2));
    } catch (e) {
      console.error('create reserva error', e.message || e);
    }

    // Intentar crear un préstamo (usuario 4, libro 1)
    console.log('\nPOST /prestamos (crear)');
    try {
      res = await fetch('http://localhost:3000/prestamos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: 4, id_libro: 1 }),
      });
      const createdP = await res.json();
      console.log('create prestamo ->', JSON.stringify(createdP, null, 2));
    } catch (e) {
      console.error('create prestamo error', e.message || e);
    }

    console.log('\nGET /reportes/prestamos (after create)');
    res = await fetch('http://localhost:3000/reportes/prestamos');
    json = await res.json();
    console.log('reportes/prestamos ->', JSON.stringify(json, null, 2));

    console.log('\nGET /reservas (after create)');
    res = await fetch('http://localhost:3000/reservas');
    json = await res.json();
    console.log('reservas ->', JSON.stringify(json, null, 2));

  } catch (e) {
    console.error('TEST ERROR', e && e.message);
  }
})();
