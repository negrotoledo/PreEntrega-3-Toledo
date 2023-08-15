//constructor de cliente 
    const clientes = [];
    class Cliente {
      constructor(fechaLectura, numeroMedidor, lecturaAnterior, lecturaActual) {
        this.fechaLectura = fechaLectura;
        this.numeroMedidor = numeroMedidor;
        this.lecturaAnterior = lecturaAnterior;
        this.lecturaActual = lecturaActual;
      }
//calculo de consumo
      calcularConsumo() {
        return this.lecturaActual - this.lecturaAnterior;
      }
      // uso de funciones de orden superior y operadores avanzados 
      calcularPrecio() {
        const consumo = this.calcularConsumo();
        const valorM3 = 10;
        return consumo > 40
          ? consumo * valorM3 * 1.2
          : consumo > 30
          ? consumo * valorM3
          : consumo * valorM3 * 0.8;
      }
//define categoria  segun el consumo 
      obtenerCategoria() {
        const consumo = this.calcularConsumo();
        return consumo > 40
          ? "Cambio su tipo de cliente" : consumo > 30
          ? "Cuide su consumo" : "Categoria A";
      }
    }

    function agregarCliente(fechaLectura, numeroMedidor, lecturaAnterior, lecturaActual) {
      const clienteExistente = clientes.find(cliente => cliente.numeroMedidor === numeroMedidor);
      if (clienteExistente) {
        Swal.fire("Error", "Ya existe un cliente con este número de medidor", "error");
        return;
      }

      const cliente = new Cliente(fechaLectura, numeroMedidor, lecturaAnterior, lecturaActual);
      clientes.push(cliente);
      guardarEnLocalStorage();
      mostrarTabla();
    }

    function clienteExiste(numeroMedidor) {
        return clientes.some(cliente => cliente.numeroMedidor === numeroMedidor);
      } 
      
// eliminar clientes use la libreria SweetAlert
    function eliminarCliente(numeroMedidor) {
        Swal.fire({
          title: "¿Estás seguro?",
          text: "Esta acción eliminará el registro del cliente. ¿Deseas continuar?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
            const indice = clientes.findIndex(cliente => cliente.numeroMedidor === numeroMedidor);
            if (indice !== -1) {
              clientes.splice(indice, 1);
              guardarEnLocalStorage();
              mostrarTabla();
              Swal.fire("Eliminado", "El registro del cliente ha sido eliminado.", "success");
            }
          }
        });
      }

// levanta el localStorage

    function guardarEnLocalStorage() {
      localStorage.setItem("clientes", JSON.stringify(clientes));
    }

    function cargarDesdeLocalStorage() {
      const datosGuardados = localStorage.getItem("clientes");
      if (datosGuardados) {
        clientes.length = 0;
        const datosParseados = JSON.parse(datosGuardados);
        datosParseados.forEach(cliente => {
          agregarCliente(fechaLectura, cliente.numeroMedidor, cliente.lecturaAnterior, cliente.lecturaActual);
        });
      }
    }

//muestra los clientes
    function mostrarTabla(clientesMostrar = clientes) {
      const tabla = document.createElement("table");
      const encabezados = ["fecha de Lectura", "Número de Medidor", "Lectura Anterior", "Lectura Actual", "Consumo (m³)", "Precio", "Categoría", "Acciones"];
      const headerRow = document.createElement("tr");

      encabezados.forEach(encabezado => {
        const th = document.createElement("th");
        th.textContent = encabezado;
        headerRow.appendChild(th);
      });

      tabla.appendChild(headerRow);

      clientesMostrar.forEach(cliente => {
        const consumo = cliente.calcularConsumo();
        const precio = cliente.calcularPrecio();
        const categoria = cliente.obtenerCategoria();



        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${cliente.fechaLectura}</td>
          <td>${cliente.numeroMedidor}</td>
          <td>${cliente.lecturaAnterior}</td>
          <td>${cliente.lecturaActual}</td>
          <td>${consumo}</td>
          <td>${precio}</td>
          <td>${categoria}</td>
          <td><button onclick="eliminarCliente('${cliente.numeroMedidor}')">Eliminar</button></td>
        `;

        tabla.appendChild(row);
      });

      const resultadosDiv = document.getElementById("resultados");
      resultadosDiv.innerHTML = "";
      resultadosDiv.appendChild(tabla);
    }

    cargarDesdeLocalStorage();
    mostrarTabla();





// Agrega un evento al botón de filtrar usando la libreria sweetAlert
function filtrarPorNumeroMedidor() {
    Swal.fire({
      title: 'Filtrar por Número de Medidor',
      html: '<input type="text" id="filtroNumeroMedidor" class="swal2-input" placeholder="Número de Medidor">',
      confirmButtonText: 'Filtrar',
      preConfirm: () => {
        const filtro = document.getElementById('filtroNumeroMedidor').value;
        if (filtro.trim() === "") {
          Swal.fire('Filtro vacío', 'Ingresa un número de medidor para filtrar.', 'warning');
          return false;
        }
        const resultadosFiltrados = clientes.filter(cliente => cliente.numeroMedidor.includes(filtro));
        mostrarTabla(resultadosFiltrados);
      }
    });
  }

    function clienteExiste(numeroMedidor) {
        return clientes.some(cliente => cliente.numeroMedidor === numeroMedidor);
      }
  
// generar un archivo JSON
      function generarArchivoJSON() {
        const contenidoJSON = JSON.stringify(clientes, null, 2);
        const blob = new Blob([contenidoJSON], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "clientes.json";
        a.textContent = "Descargar Archivo JSON";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
          

  // formulario de entrada para la carga de lecturas     
      function mostrarFormularioIngreso() {
        Swal.fire({
          title: "Ingresar Lecturas",
          html: `
            <input type="text" id="numeroMedidor" placeholder="Número de Medidor" required>
            <input type="number" id="lecturaAnterior" placeholder="Lectura Anterior" required>
            <input type="number" id="lecturaActual" placeholder="Lectura Actual" required>
            <input type="date" id="fechaLectura" required>
          `,
          showCancelButton: true,
          confirmButtonText: "Guardar",
          focusConfirm: false,
          preConfirm: () => {
            const fechaLectura = document.getElementById("fechaLectura").value;
            const numeroMedidor = document.getElementById("numeroMedidor").value;
            const lecturaAnterior = parseFloat(document.getElementById("lecturaAnterior").value);
            const lecturaActual = parseFloat(document.getElementById("lecturaActual").value);
            //const fechaLectura = document.getElementById("fechaLectura").value;
            
            if (clienteExiste(numeroMedidor)) {
              Swal.fire("Error", "Ya existe un cliente con este número de medidor", "error");
              return false;
            }
      
            agregarCliente(fechaLectura, numeroMedidor, lecturaAnterior, lecturaActual);
          }
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire(
              'Guardado',
              'El cliente ha sido agregado correctamente.',
              'success'
            );
          }
        });
      }
      