let graficaPredicciones = null;
let graficaBecasChart = null;
let graficaGenero = null;
let graficaEdadChart = null;
let graficaBecaChart = null;
let barrasChart = null;
let barrasSem2Chart = null;
let boxplotGradesChart = null;
let archivoCargado = false;
async function fetchDashboard() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "/inicio/";
    return;
  }

  try {
    const response = await fetch("/api/dashboard/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const username = document.getElementById("userName");

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      username.textContent = `Hola, ${data.nombre}`;
    } else if (response.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/inicio/";
    } else {
      alert("Error: " + response.statusText);
    }
  } catch (error) {
    console.error("Error al obtener el dashboard:", error);
    localStorage.removeItem("access_token");
    window.location.href = "/inicio/";
  }
}

async function logout() {
  const refreshToken = localStorage.getItem("refresh_token");

  try {
    await fetch("/api/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/inicio/";
  }
}
/*-----------------------------------------------------------------------------------------*/
async function scholarship_holder() {
  try {
    const response = await fetch("/api/scholarship_holder/");

    if (!response.ok) {
      throw new Error("Error al obtener los datos.");
    }

    const data = await response.json();

    // Calcular total y porcentajes
    const total = data["0"] + data["1"];
    const porcentajes = {
      0: ((data["0"] / total) * 100).toFixed(1),
      1: ((data["1"] / total) * 100).toFixed(1),
    };

    // Asegurarse de destruir la gráfica anterior si existe
    if (graficaBecasChart) {
      graficaBecasChart.destroy();
    }

    // Crear datasets separados para "No" y "Si"
    graficaBecasChart = new Chart(
      document.getElementById("graficaBecas").getContext("2d"),
      {
        type: "bar",
        data: {
          labels: ["Estudiantes con/sin beca"],
          datasets: [
            {
              label: "No",
              data: [data["0"]],
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "#1e40af",
              borderWidth: 1,
            },
            {
              label: "Si",
              data: [data["1"]],
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "#1e40af",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const value = context.raw;
                  const isNo = context.dataset.label === "No";
                  const percent = isNo ? porcentajes["0"] : porcentajes["1"];
                  return [
                    `${context.dataset.label}: ${value} estudiantes`,
                    `Porcentaje: ${percent}%`,
                  ];
                },
              },
            },
            title: {
              display: true,
              text: "Estudiantes con/sin beca",
              font: {
                size: 16,
              },
            },
          },
          animation: {
            duration: 1200,
            easing: "easeOutQuart",
          },
        },
      }
    );
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

async function scholarship_holderCarga() {
  try {
    const response = await fetch("/api/scholarship_holderCarga/");

    if (!response.ok) {
      throw new Error("Error al obtener los datos.");
    }

    const data = await response.json();

    // Calcular total y porcentajes
    const total = data["0"] + data["1"];
    const porcentajes = {
      0: ((data["0"] / total) * 100).toFixed(1),
      1: ((data["1"] / total) * 100).toFixed(1),
    };

    // Definir etiquetas y valores
    const valores = [data["0"], data["1"]];

    const ctx = document.getElementById("graficaBecas").getContext("2d");

    if (graficaBecasChart) {
      graficaBecasChart.destroy();
    }

    // Definir colores
    const colores = [
      "rgba(0, 255, 255, 0.6)", // Color para "No"
      "rgba(255, 0, 55, 0.6)", // Color para "Si"
    ];

    graficaBecasChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Estudiantes con/sin beca"],
        datasets: [
          {
            label: "No",
            data: [valores[0]],
            backgroundColor: colores[0],
            borderColor: "#1e40af",
            borderWidth: 1,
            borderRadius: 4, // Bordes ligeramente redondeados
          },
          {
            label: "Si",
            data: [valores[1]],
            backgroundColor: colores[1],
            borderColor: "#1e40af",
            borderWidth: 1,
            borderRadius: 4, // Bordes ligeramente redondeados
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw;
                const isNo = context.dataset.label === "No";
                const percent = isNo ? porcentajes["0"] : porcentajes["1"];
                return [
                  `${context.dataset.label}: ${value} estudiantes`,
                  `Porcentaje: ${percent}%`,
                ];
              },
            },
          },
        },
        animation: {
          duration: 1200,
          easing: "easeOutQuart",
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}
/*-----------------------------------------------------------------------------------------*/
async function totaldataOriginal() {
  try {
    const response = await fetch("/api/totaldataOriginal/");

    if (!response.ok) {
      throw new Error("Error al obtener los datos.");
    }

    const data = await response.json();
    const total_dat = document.getElementById("dat");
    total_dat.textContent = data.total;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}
async function totaldataCarga() {
  try {
    const response = await fetch("/api/totaldataCarga/");

    if (!response.ok) {
      throw new Error("Error al obtener los datos.");
    }

    const data = await response.json();
    const total_dat = document.getElementById("dat");
    total_dat.textContent = data.total;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}
/*-----------------------------------------------------------------------------------------*/

async function cargarGraficaPredicciones() {
  try {
    const response = await fetch("/api/predicciones/");

    if (!response.ok) {
      throw new Error("Error al obtener los datos de predicciones.");
    }

    const data = await response.json();

    const rawKeys = Object.keys(data);
    const etiquetas = rawKeys.map((key) => {
      if (key === "Dropout") return "Abandonar";
      if (key === "Graduate") return "Graduado";
      if (key === "Enrolled") return "Inscrito";
      return key;
    });

    const valores = Object.values(data);

    // Calcular total y porcentajes
    const total = valores.reduce((sum, val) => sum + val, 0);
    const porcentajes = valores.map((val) => ((val / total) * 100).toFixed(1));

    const canvas = document.getElementById("graficaPredicciones");
    if (!canvas) {
      console.warn("No se encontró el elemento para la gráfica.");
      return;
    }

    const ctx = canvas.getContext("2d");

    if (graficaPredicciones) {
      graficaPredicciones.destroy();
    }

    const colores = [
      "rgba(0, 255, 255, 0.6)",
      "rgba(255, 0, 55, 0.6)",
      "rgba(255, 183, 0, 0.6)",
    ];

    graficaPredicciones = new Chart(ctx, {
      type: "pie",
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: "Frecuencia de Predicciones",
            data: valores,
            backgroundColor: etiquetas.map(
              (_, i) => colores[i % colores.length]
            ),
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
            labels: {
              font: {
                size: 14,
              },
              padding: 20,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw;
                const percent = porcentajes[context.dataIndex];
                return [
                  `${context.label}: ${value} estudiantes`,
                  `Porcentaje: ${percent}%`,
                ];
              },
            },
          },
          title: {
            display: true,
            text: "Predicciones del Modelo",
            font: {
              size: 16,
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500,
          easing: "easeOutCirc",
        },
      },
    });
  } catch (error) {
    console.error("Error al cargar datos de predicciones:", error);
  }
}

async function dataOriginal() {
  try {
    const response = await fetch("/api/dataOriginal/");

    if (!response.ok) {
      throw new Error("Error al obtener los datos originales.");
    }

    const data = await response.json();

    const rawKeys = Object.keys(data);
    const etiquetas = rawKeys.map((key) => {
      if (key === "Dropout") return "Abandonar";
      if (key === "Graduate") return "Graduado";
      if (key === "Enrolled") return "Inscrito";
      return key;
    });

    const valores = Object.values(data);

    // Calcular total y porcentajes
    const total = valores.reduce((sum, val) => sum + val, 0);
    const porcentajes = valores.map((val) => ((val / total) * 100).toFixed(1));

    const canvas = document.getElementById("graficaPredicciones");
    if (!canvas) {
      console.warn("No se encontró el elemento para la gráfica.");
      return;
    }

    const ctx = canvas.getContext("2d");

    if (graficaPredicciones) {
      graficaPredicciones.destroy();
    }

    const colores = [
      "rgba(75, 192, 192, 0.6)",
      "rgba(255, 99, 132, 0.6)",
      "rgba(255, 206, 86, 0.6)",
    ];

    graficaPredicciones = new Chart(ctx, {
      type: "pie",
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: "Distribución de Datos Originales",
            data: valores,
            backgroundColor: etiquetas.map(
              (_, i) => colores[i % colores.length]
            ),
            borderColor: "#fff",
            borderWidth: 2,
            hoverOffset: 15,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
            labels: {
              font: {
                size: 14,
              },
              padding: 20,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw;
                const percent = porcentajes[context.dataIndex];
                return [
                  `${context.label}: ${value} estudiantes`,
                  `Porcentaje: ${percent}%`,
                ];
              },
            },
          },
          title: {
            display: true,
            text: "Datos Originales",
            font: {
              size: 16,
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500,
          easing: "easeOutCirc",
        },
      },
    });
  } catch (error) {
    console.error("Error al cargar datos originales:", error);
  }
}
/*-----------------------------------------------------------------------------------------*/
async function GenderCarga() {
  try {
    const response = await fetch("/api/GenderCarga/");
    if (!response.ok) {
      throw new Error("Error al obtener los datos.");
    }

    const data = await response.json();

    const rawKeys = Object.keys(data); // ["0", "1"]
    const etiquetas = rawKeys.map((key) => {
      if (key === "0") return "Hombre";
      if (key === "1") return "Mujer";
      return key;
    });

    const valores = Object.values(data); // [1500, 2800]

    // Calcular porcentajes
    const total = valores.reduce((sum, val) => sum + val, 0);
    const porcentajes = valores.map((val) => ((val / total) * 100).toFixed(1));

    const ctx = document.getElementById("graficaGenero").getContext("2d");

    if (graficaGenero) {
      graficaGenero.destroy();
    }

    graficaGenero = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: "Género",
            data: valores,
            backgroundColor: etiquetas.map((etiqueta) =>
              etiqueta === "Hombre"
                ? "rgba(0, 255, 255, 0.6)"
                : "rgba(255, 0, 55, 0.6)"
            ),
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw;
                const percent = porcentajes[context.dataIndex];
                return [
                  `${context.label}: ${value} estudiantes`,
                  `Porcentaje: ${percent}%`,
                ];
              },
            },
          },
        },
        animation: {
          duration: 1200,
          animateRotate: true,
          animateScale: true,
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    alert("Hubo un error al obtener los datos del género.");
  }
}

async function Gender() {
  try {
    const response = await fetch("/api/Gender/");

    if (!response.ok) {
      throw new Error("Error al obtener los datos.");
    }

    const data = await response.json();

    const rawKeys = Object.keys(data); // ["0", "1"]
    const etiquetas = rawKeys.map((key) => {
      if (key === "0") return "Hombre";
      if (key === "1") return "Mujer";
      return key;
    });

    const valores = Object.values(data); // [1500, 2800]

    // Calcular porcentajes
    const total = valores.reduce((sum, val) => sum + val, 0);
    const porcentajes = valores.map((val) => ((val / total) * 100).toFixed(1));

    const ctx = document.getElementById("graficaGenero").getContext("2d");

    if (graficaGenero) {
      graficaGenero.destroy();
    }

    graficaGenero = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: "Género",
            data: valores,
            backgroundColor: etiquetas.map((etiqueta) =>
              etiqueta === "Hombre"
                ? "rgba(75, 192, 192, 0.6)"
                : "rgba(255, 99, 132, 0.6)"
            ),
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw;
                const percent = porcentajes[context.dataIndex];
                return [
                  `${context.label}: ${value} estudiantes`,
                  `Porcentaje: ${percent}%`,
                ];
              },
            },
          },
        },
        animation: {
          duration: 1200,
          animateRotate: true,
          animateScale: true,
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}
/*-----------------------------------------------------------------------------------------*/

async function cargarHistogramaEdad() {
  try {
    const response = await fetch("/api/Age_at_enrollment/");

    if (!response.ok) {
      throw new Error("Error al obtener los datos de edad.");
    }

    const data = await response.json(); // Ej: {"18": 5, "19": 10, "20": 8, ...}

    // Convertir a array de números
    const edades = Object.entries(data).map(([edad, cantidad]) => ({
      edad: parseInt(edad),
      cantidad,
    }));

    // Ordenar por edad
    edades.sort((a, b) => a.edad - b.edad);

    // Agrupar en bins (intervalos de 5 años)
    const bins = {};
    for (const { edad, cantidad } of edades) {
      const inicio = Math.floor(edad / 5) * 5;
      const fin = inicio + 4;
      const rango = `${inicio}-${fin}`;
      bins[rango] = (bins[rango] || 0) + cantidad;
    }

    const etiquetas = Object.keys(bins);
    const valores = Object.values(bins);

    // Calcular estadísticas para mostrar en el tooltip
    const total = valores.reduce((sum, val) => sum + val, 0);
    const porcentajes = valores.map((val) => ((val / total) * 100).toFixed(1));

    const canvas = document.getElementById("graficaEdad");
    if (!canvas) {
      console.warn("No se encontró el elemento para el histograma.");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (graficaEdadChart) {
      graficaEdadChart.destroy();
    }

    // Generar un gradiente de colores en función de la cantidad
    const colorIntensity = valores.map((val) =>
      Math.min(0.9, Math.max(0.3, val / Math.max(...valores)))
    );

    const backgroundColors = etiquetas.map(
      (_, i) => `rgba(54, 162, 235, ${colorIntensity[i]})`
    );

    graficaEdadChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: "Estudiantes por edad de inscripción",
            data: valores,
            backgroundColor: backgroundColors,
            borderColor: "#1e40af",
            borderWidth: 1,
            borderRadius: 5,
            barPercentage: 0.8,
            categoryPercentage: 0.9,
          },
        ],
      },
      options: {
        responsive: true,
        indexAxis: "y",
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw;
                const percent = porcentajes[context.dataIndex];
                return [
                  `Cantidad: ${value} estudiantes`,
                  `Porcentaje: ${percent}% del total`,
                ];
              },
              title: function (context) {
                return `Rango de edad: ${context[0].label} años`;
              },
            },
          },
          title: {
            display: true,
            text: "Distribución de Estudiantes por Rango de Edad",
            font: {
              size: 16,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Cantidad de estudiantes",
              font: {
                weight: "bold",
              },
            },
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
          y: {
            title: {
              display: true,
              text: "Rangos de edad (años)",
              font: {
                weight: "bold",
              },
            },
            grid: {
              display: false,
            },
          },
        },
        animation: {
          duration: 1500,
          easing: "easeOutQuart",
        },
      },
    });
  } catch (error) {
    console.error("Error al cargar el histograma de edad:", error);
  }
}

async function cargarHistogramaEdadCarga() {
  try {
    const response = await fetch("/api/Age_at_enrollmentCarga/");

    if (!response.ok) {
      throw new Error("Error al obtener los datos de edad.");
    }

    const data = await response.json(); // Ej: {"18": 5, "19": 10, "20": 8, ...}

    // Convertir a array de números
    const edades = Object.entries(data).map(([edad, cantidad]) => ({
      edad: parseInt(edad),
      cantidad,
    }));

    // Ordenar por edad
    edades.sort((a, b) => a.edad - b.edad);

    // Agrupar en bins (intervalos de 5 años)
    const bins = {};
    for (const { edad, cantidad } of edades) {
      const inicio = Math.floor(edad / 5) * 5;
      const fin = inicio + 4;
      const rango = `${inicio}-${fin}`;
      bins[rango] = (bins[rango] || 0) + cantidad;
    }

    const etiquetas = Object.keys(bins);
    const valores = Object.values(bins);

    // Calcular estadísticas para mostrar en el tooltip
    const total = valores.reduce((sum, val) => sum + val, 0);
    const porcentajes = valores.map((val) => ((val / total) * 100).toFixed(1));

    const canvas = document.getElementById("graficaEdad");
    if (!canvas) {
      console.warn("No se encontró el elemento para el histograma.");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (graficaEdadChart) {
      graficaEdadChart.destroy();
    }

    // Generar un gradiente de colores en función de la cantidad
    const colorIntensity = valores.map((val) =>
      Math.min(0.9, Math.max(0.3, val / Math.max(...valores)))
    );

    const backgroundColors = etiquetas.map(
      (_, i) => `rgba(54, 162, 235, ${colorIntensity[i]})`
    );

    graficaEdadChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: "Estudiantes por edad de inscripción",
            data: valores,
            backgroundColor: backgroundColors,
            borderColor: "#1e40af",
            borderWidth: 1,
            borderRadius: 5,
            barPercentage: 0.8,
            categoryPercentage: 0.9,
          },
        ],
      },
      options: {
        responsive: true,
        indexAxis: "y",
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw;
                const percent = porcentajes[context.dataIndex];
                return [
                  `Cantidad: ${value} estudiantes`,
                  `Porcentaje: ${percent}% del total`,
                ];
              },
              title: function (context) {
                return `Rango de edad: ${context[0].label} años`;
              },
            },
          },
          title: {
            display: true,
            text: "Distribución de Estudiantes por Rango de Edad",
            font: {
              size: 16,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Cantidad de estudiantes",
              font: {
                weight: "bold",
              },
            },
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
          y: {
            title: {
              display: true,
              text: "Rangos de edad (años)",
              font: {
                weight: "bold",
              },
            },
            grid: {
              display: false,
            },
          },
        },
        animation: {
          duration: 1500,
          easing: "easeOutQuart",
        },
      },
    });
  } catch (error) {
    console.error("Error al cargar el histograma de edad:", error);
  }
}
/*-----------------------------------------------------------------------------------------*/
async function cargarGraficaBecaVsPrediccion() {
  try {
    const response = await fetch("/api/beca_vs_prediccion/");

    if (!response.ok) {
      throw new Error("Error al obtener los datos de beca vs predicción.");
    }

    const data = await response.json();

    const labels = data.labels.map((key) => {
      if (key === "Dropout") return "Abandonar";
      if (key === "Graduate") return "Graduado";
      if (key === "Enrolled") return "Inscrito";
      return key;
    });
    console.log("xd", labels);
    const conBeca = data.beca;
    const sinBeca = data.sin_beca;

    // Calcular porcentajes para cada categoría
    const totalesPorCategoria = labels.map((_, index) => {
      return conBeca[index] + sinBeca[index];
    });

    const porcentajesConBeca = conBeca.map((val, index) => {
      return totalesPorCategoria[index] > 0
        ? ((val / totalesPorCategoria[index]) * 100).toFixed(1)
        : 0;
    });

    const porcentajesSinBeca = sinBeca.map((val, index) => {
      return totalesPorCategoria[index] > 0
        ? ((val / totalesPorCategoria[index]) * 100).toFixed(1)
        : 0;
    });

    const canvas = document.getElementById("graficaBeca");
    if (!canvas) {
      console.warn("No se encontró el elemento para la gráfica de beca.");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (graficaBecaChart) {
      graficaBecaChart.destroy();
    }

    graficaBecaChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Con beca",
            data: conBeca,
            backgroundColor: "rgba(75, 192, 192, 0.7)",
            borderColor: "#1e40af",
            borderWidth: 1,
          },
          {
            label: "Sin beca",
            data: sinBeca,
            backgroundColor: "rgba(255, 99, 132, 0.7)",
            borderColor: "#1e40af",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Relación entre Beca y Predicción Académica",
            font: {
              size: 16,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const datasetIndex = context.datasetIndex;
                const index = context.dataIndex;
                const value = context.raw;

                // Determinar si estamos mostrando con beca o sin beca
                const porcentaje =
                  datasetIndex === 0
                    ? porcentajesConBeca[index]
                    : porcentajesSinBeca[index];

                const label = datasetIndex === 0 ? "Con beca" : "Sin beca";

                return [
                  `${label}: ${value} estudiantes`,
                  `Porcentaje: ${porcentaje}% de esta categoría`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Resultado Académico Predicho",
              font: {
                weight: "bold",
              },
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Cantidad de estudiantes",
              font: {
                weight: "bold",
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error al cargar la gráfica de beca vs predicción:", error);
  }
}

async function cargarGraficaBecaVsPrediccionCarga() {
  try {
    const response = await fetch("/api/beca_vs_prediccionCarga/");

    if (!response.ok) {
      throw new Error("Error al obtener los datos de beca vs predicción.");
    }

    const data = await response.json();

    const labels = data.labels.map((key) => {
      if (key === "Dropout") return "Abandonar";
      if (key === "Graduate") return "Graduado";
      if (key === "Enrolled") return "Inscrito";
      return key;
    });
    const conBeca = data.beca;
    const sinBeca = data.sin_beca;

    const totalesPorCategoria = labels.map((_, index) => {
      return conBeca[index] + sinBeca[index];
    });
    const porcentajeConBeca = conBeca.map((val, index) => {
      return totalesPorCategoria[index] > 0
        ? ((val / totalesPorCategoria[index]) * 100).toFixed(1)
        : 0;
    });
    const porcentajeSinBeca = sinBeca.map((val, index) => {
      return totalesPorCategoria[index] > 0
        ? ((val / totalesPorCategoria[index]) * 100).toFixed(1)
        : 0;
    });
    const canvas = document.getElementById("graficaBeca");
    if (!canvas) {
      console.warn("No se encontró el elemento para la gráfica de beca.");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (graficaBecaChart) {
      graficaBecaChart.destroy();
    }

    graficaBecaChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Con beca",
            data: conBeca,
            backgroundColor: "rgba(0, 255, 255, 0.6)",
            borderColor: "#1e40af",
            borderWidth: 1,
          },
          {
            label: "Sin beca",
            data: sinBeca,
            backgroundColor: "rgba(255, 0, 55, 0.6)",
            borderColor: "#1e40af",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Relación entre Beca y Predicción Académica",
            font: {
              size: 16,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const datasetIndex = context.datasetIndex;
                const index = context.dataIndex;
                const value = context.raw;

                const porcentaje =
                  datasetIndex === 0
                    ? porcentajeConBeca[index]
                    : porcentajeSinBeca[index];
                const label = datasetIndex === 0 ? "Con beca" : "Sin beca";

                return [
                  `${label}: ${value} estudientes`,
                  `Porcentaje: ${porcentaje}%`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Resultado Académico Predicho",
              font: {
                weight: "bold",
              },
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Cantidad de estudiantes",
              font: {
                weight: "bold",
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error al cargar la gráfica de beca vs predicción:", error);
  }
}
/*-----------------------------------------------------------------------------------------*/
async function cargarBarrasInscritasVsAprobadas() {
  try {
    const response = await fetch("/api/enrolled_vs_approved_sem1/");
    const data = await response.json();

    const etiquetas = Object.keys(data); // ["Materias inscritas", "Materias aprobadas"]
    const valores = Object.values(data); // [número, número]

    const total = valores[0];
    const porcentajeAprovacion = ((valores[1] / total) * 100).toFixed(1);
    const porcentajeNoAprobacion = (
      ((valores[0] - valores[1]) / total) *
      100
    ).toFixed(1);

    const canvas = document.getElementById("graficaInscritasAprobadas");
    const ctx = canvas.getContext("2d");

    if (barrasChart) {
      barrasChart.destroy();
    }

    barrasChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: "1er semestre",
            data: valores,
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(52, 211, 153, 0.6)",
            ], // azul para inscritas, verde para aprobadas
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Unidades inscritas vs aprobadas (1er semestre)",
            font: { size: 18 },
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const dataIndex = context.dataIndex;
                const value = context.raw;

                if (dataIndex === 0) {
                  return `Materias inscritas: ${value}`;
                } else if (dataIndex === 1) {
                  return [
                    `Materias aprobadas: ${value}`,
                    `porcentaje de aprobacion: ${porcentajeAprovacion}$`,
                  ];
                }
                return `${value}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Cantidad de materias",
            },
          },
          x: {
            title: {
              display: true,
              text: "Tipo",
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error al cargar datos:", error);
    alert("Error al cargar el gráfico de materias inscritas vs aprobadas.");
  }
}

async function cargarBarrasInscritasVsAprobadasCarga() {
  try {
    const response = await fetch("/api/enrolled_vs_approved_sem1Carga/");
    const data = await response.json();

    const etiquetas = Object.keys(data); // ["Materias inscritas", "Materias aprobadas"]
    const valores = Object.values(data); // [número, número]

    const total = valores[0];
    const porcentakeAprovacion = ((valores[1] / total) * 100).toFixed(1);
    const canvas = document.getElementById("graficaInscritasAprobadas");
    const ctx = canvas.getContext("2d");

    if (barrasChart) {
      barrasChart.destroy();
    }

    barrasChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: "1er semestre",
            data: valores,
            backgroundColor: ["rgba(0, 255, 255, 0.6)", "rgba(0, 255, 0, 0.6)"],
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Unidades inscritas vs aprobadas (1er semestre)",
            font: { size: 18 },
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const dataIndex = context.dataIndex;
                const value = context.raw;

                if (dataIndex === 0) {
                  return `Materias inscritas: ${value}`;
                } else if (dataIndex === 1) {
                  return [
                    `Materias aprobadas: ${value}`,
                    `Porcentaje de aprobacion: ${porcentakeAprovacion}%`,
                  ];
                }
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Cantidad de materias",
            },
          },
          x: {
            title: {
              display: true,
              text: "Tipo",
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error al cargar datos:", error);
    alert("Error al cargar el gráfico de materias inscritas vs aprobadas.");
  }
}

/*-----------------------------------------------------------------------------------------*/
async function cargarBarrasInscritasVsAprobadasSem2() {
  try {
    const response = await fetch("/api/enrolled_vs_approved_sem2/");
    const data = await response.json();

    const etiquetas = Object.keys(data); // ["Materias inscritas", "Materias aprobadas"]
    const valores = Object.values(data); // [número, número]

    const total = valores[0];
    const porcentajeAprovacion = ((valores[1] / total) * 100).toFixed(1);
    const porcentajeNoAprobacion = (
      ((valores[0] - valores[1]) / total) *
      100
    ).toFixed(1);

    const canvas = document.getElementById("graficaInscritasAprobadasSem2");
    const ctx = canvas.getContext("2d");

    if (barrasSem2Chart) {
      barrasSem2Chart.destroy();
    }

    barrasSem2Chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: "2do semestre",
            data: valores,
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(52, 211, 153, 0.6)",
            ], // azul para inscritas, verde para aprobadas
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Unidades inscritas vs aprobadas (2do semestre)",
            font: { size: 18 },
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const dataIndex = context.dataIndex;
                const value = context.raw;

                if (dataIndex === 0) {
                  return `Materias inscritas: ${value}`;
                } else if (dataIndex === 1) {
                  return [
                    `Materias aprobadas: ${value}`,
                    `porcentaje de aprobacion: ${porcentajeAprovacion}$`,
                  ];
                }
                return `${value}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Cantidad de materias",
            },
          },
          x: {
            title: {
              display: true,
              text: "Tipo",
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error al cargar datos:", error);
    alert("Error al cargar el gráfico de materias inscritas vs aprobadas.");
  }
}

async function cargarBarrasInscritasVsAprobadasSem2Carga() {
  try {
    const response = await fetch("/api/enrolled_vs_approved_sem2Carga/");
    const data = await response.json();

    const etiquetas = Object.keys(data); // ["Materias inscritas", "Materias aprobadas"]
    const valores = Object.values(data); // [número, número]

    const total = valores[0];
    const porcentakeAprovacion = ((valores[1] / total) * 100).toFixed(1);
    const canvas = document.getElementById("graficaInscritasAprobadasSem2");
    const ctx = canvas.getContext("2d");

    if (barrasSem2Chart) {
      barrasSem2Chart.destroy();
    }

    barrasSem2Chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: "2do semestre",
            data: valores,
            backgroundColor: ["rgba(0, 255, 255, 0.6)", "rgba(0, 255, 0, 0.6)"],
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Unidades inscritas vs aprobadas (2do semestre)",
            font: { size: 18 },
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const dataIndex = context.dataIndex;
                const value = context.raw;

                if (dataIndex === 0) {
                  return `Materias inscritas: ${value}`;
                } else if (dataIndex === 1) {
                  return [
                    `Materias aprobadas: ${value}`,
                    `Porcentaje de aprobacion: ${porcentakeAprovacion}%`,
                  ];
                }
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Cantidad de materias",
            },
          },
          x: {
            title: {
              display: true,
              text: "Tipo",
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error al cargar datos:", error);
    alert("Error al cargar el gráfico de materias inscritas vs aprobadas.");
  }
}

/*-----------------------------------------------------------------------------------------*/
async function cargarBoxplotGradesVsPrediction() {
  try {
    const response = await fetch("/api/boxplot_grades_vs_prediction/");
    const result = await response.json();

    const rawData = result.data;
    const totalEstudiantesReal = result.total_estudiantes;

    // Agrupar datos por predicción
    const agrupado = {};
    rawData.forEach((item) => {
      const prediccion = item.prediccion;
      const calificacion = parseFloat(item.calificacion);
      if (!agrupado[prediccion]) agrupado[prediccion] = [];
      agrupado[prediccion].push(calificacion);
    });

    const rawKeys = Object.keys(agrupado);
    const etiquetas = rawKeys.map((key) => {
      if (key === "Dropout") return "Abandonar";
      if (key === "Graduate") return "Graduado";
      if (key === "Enrolled") return "Inscrito";
      return key;
    });

    const promedios = Object.values(agrupado).map((calificaciones) => {
      const suma = calificaciones.reduce((a, b) => a + b, 0);
      return (suma / calificaciones.length).toFixed(2);
    });

    // Calcular porcentajes basados en el conteo real de estudiantes
    const porcentajes = Object.values(agrupado).map((calificaciones) => {
      return ((calificaciones.length / totalEstudiantesReal) * 100).toFixed(1);
    });

    // Mostrar el total de estudiantes en la página
    const totalElement = document.getElementById("totalEstudiantes");
    if (totalElement) {
      totalElement.textContent = totalEstudiantesReal;
    }

    const canvas = document.getElementById("graficaBoxplotGradesPrediction");
    const ctx = canvas.getContext("2d");

    if (boxplotGradesChart) {
      boxplotGradesChart.destroy();
    }
    const colores = [
      "rgba(255, 99, 132, 0.6)",
      "rgba(75, 192, 192, 0.6)",
      "rgba(255, 206, 86, 0.6)",
    ];
    boxplotGradesChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: "Promedio de calificaciones",
            data: promedios,
            backgroundColor: etiquetas.map(
              (_, i) => colores[i % colores.length]
            ),
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Promedio de calificaciones por predicción",
            font: { size: 18 },
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const dataIndex = context.dataIndex;
                const value = context.raw;
                const categoria = rawKeys[dataIndex];
                const cantidadEstudiantes = agrupado[categoria].length;

                return [
                  `Promedio: ${value}`,
                  `Estudiantes: ${cantidadEstudiantes}`,
                  `Porcentaje: ${porcentajes[dataIndex]}%`,
                ];
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Promedio de calificación",
            },
          },
          x: {
            title: {
              display: true,
              text: "Resultado de Predicción",
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error al cargar datos:", error);
    alert("Error al cargar el gráfico de calificaciones vs predicción.");
  }
}

async function cargarBoxplotGradesVsPredictionCarga() {
  try {
    const response = await fetch("/api/boxplot_grades_vs_predictionCarga/");
    const result = await response.json();

    const rawData = result.data;
    const totalEstudiantesReal = result.total_estudiantes;

    // Agrupar datos por predicción
    const agrupado = {};
    rawData.forEach((item) => {
      const prediccion = item.prediccion;
      const calificacion = parseFloat(item.calificacion);
      if (!agrupado[prediccion]) agrupado[prediccion] = [];
      agrupado[prediccion].push(calificacion);
    });

    const rawKeys = Object.keys(agrupado);
    const etiquetas = rawKeys.map((key) => {
      if (key === "Dropout") return "Abandonar";
      if (key === "Graduate") return "Graduado";
      if (key === "Enrolled") return "Inscrito";
      return key;
    });

    const promedios = Object.values(agrupado).map((calificaciones) => {
      const suma = calificaciones.reduce((a, b) => a + b, 0);
      return (suma / calificaciones.length).toFixed(2);
    });

    // Calcular porcentajes basados en el conteo real de estudiantes
    const porcentajes = Object.values(agrupado).map((calificaciones) => {
      return ((calificaciones.length / totalEstudiantesReal) * 100).toFixed(1);
    });

    // Mostrar el total de estudiantes en la página
    const totalElement = document.getElementById("totalEstudiantes");
    if (totalElement) {
      totalElement.textContent = totalEstudiantesReal;
    }

    const canvas = document.getElementById("graficaBoxplotGradesPrediction");
    const ctx = canvas.getContext("2d");

    if (boxplotGradesChart) {
      boxplotGradesChart.destroy();
    }
    const colores = [
      "rgba(255, 0, 55, 0.6)",
      "rgba(0, 255, 255, 0.6)",
      "rgba(255, 183, 0, 0.6)",
    ];
    boxplotGradesChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: "Promedio de calificaciones",
            data: promedios,
            backgroundColor: etiquetas.map(
              (_, i) => colores[i % colores.length]
            ),
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Promedio de calificaciones por predicción",
            font: { size: 18 },
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const dataIndex = context.dataIndex;
                const value = context.raw;
                const categoria = rawKeys[dataIndex];
                const cantidadEstudiantes = agrupado[categoria].length;

                return [
                  `Promedio: ${value}`,
                  `Estudiantes: ${cantidadEstudiantes}`,
                  `Porcentaje: ${porcentajes[dataIndex]}%`,
                ];
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Promedio de calificación",
            },
          },
          x: {
            title: {
              display: true,
              text: "Resultado de Predicción",
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error al cargar datos:", error);
    alert("Error al cargar el gráfico de calificaciones vs predicción.");
  }
}
/*-----------------------------------------------------------------------------------------*/
async function graficas() {
  dataOriginal();
  scholarship_holder();
  totaldataOriginal();
  Gender();
  cargarHistogramaEdad();
  cargarGraficaBecaVsPrediccion();
  cargarBarrasInscritasVsAprobadas();
  cargarBarrasInscritasVsAprobadasSem2();
  cargarBoxplotGradesVsPrediction();
}
async function graficasCarga() {
  cargarGraficaPredicciones();
  totaldataCarga();
  scholarship_holderCarga();
  GenderCarga();
  cargarHistogramaEdadCarga();
  cargarGraficaBecaVsPrediccionCarga();
  cargarBarrasInscritasVsAprobadasCarga();
  cargarBarrasInscritasVsAprobadasSem2Carga();
  cargarBoxplotGradesVsPredictionCarga();
}
async function CargaarGraficas() {
  if (archivoCargado) {
    graficasCarga();
  } else {
    graficas();
  }
}

/*-----------------------------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  fetchDashboard();
  graficas();
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }

  const form = document.getElementById("form-csv");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("csv-file");
    const file = fileInput.files[0];

    if (!file) {
      alert("Por favor selecciona un archivo CSV.");
      return;
    }

    const formData = new FormData();
    formData.append("archivo_csv", file);

    try {
      const response = await fetch("/api/cargar_csv/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        archivoCargado = true;
        graficasCarga();
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  });

  window.academy = function () {
    document.getElementById("dashboard-secction").style.display = "none";
    document.getElementById("academy-secction").style.display = "block";
    CargaarGraficas();
  };
  window.dashboard = function () {
    document.getElementById("academy-secction").style.display = "none";
    document.getElementById("dashboard-secction").style.display = "block";
    CargaarGraficas();
  };
});
