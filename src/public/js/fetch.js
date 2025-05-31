document.getElementById('enviar-btn').addEventListener('click', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const comentario = document.getElementById('comentario').value;

    try {
        const response = await fetch('/contact/add', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, nombre, comentario })
        });

        const res = await response.json();
        
        if(res.status === true) {
            Swal.fire('¡Datos de Contacto creados Correctamente!').then(() => {
                window.location.href = '/admin/contacts';
            });
        } else {
            Swal.fire('¡Los Datos no se pudieron crear correctamente!');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error al enviar los datos');
    }
});