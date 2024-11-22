// src/components/Relatorios.jsx

import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Container, Row, Col } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Registrar os componentes do ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Relatorios = () => {
  // Dados simulados para o gráfico de barras (Consumo por Dispositivo)
  const barData = {
    labels: ['Televisão', 'Geladeira', 'Ar Condicionado', 'Lâmpadas', 'Computador'],
    datasets: [
      {
        label: 'Consumo (kWh)',
        data: [120, 80, 150, 60, 90],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // Opções para o gráfico de barras
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Consumo de Energia por Dispositivo',
      },
    },
  };

  // Dados simulados para o gráfico de pizza (Distribuição do Consumo)
  const pieData = {
    labels: ['Residencial', 'Comercial', 'Industrial'],
    datasets: [
      {
        label: 'Consumo (%)',
        data: [40, 35, 25],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite ajustar o tamanho do gráfico
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribuição do Consumo de Energia',
      },
    },
  };
  

  return (
    <Container>
      <Row>
        <Col md={6}>
          <Bar data={barData} options={barOptions} />
        </Col>
        <Col md={6} className="d-flex justify-content-center">
            <div className="pie-chart-container">
                <Pie data={pieData} options={pieOptions} />
            </div>
        </Col>

      </Row>
    </Container>
  );
};

export default Relatorios;
