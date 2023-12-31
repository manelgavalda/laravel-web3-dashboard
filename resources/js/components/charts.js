import { tailwindConfig, formatValue } from '../utils';
import { Chart, LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip, } from 'chart.js';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

export function populateCharts(response) {
  const ctx = document.getElementById('dashboard-card-08');

  if (!ctx) return;

  const darkMode = localStorage.getItem('dark-mode') === 'true';

  const textColor = {
    light: '#94a3b8',
    dark: '#64748B'
  };

  const gridColor = {
    light: '#f1f5f9',
    dark: '#334155'
  };

  const tooltipBodyColor = {
    light: '#1e293b',
    dark: '#f1f5f9'
  };

  const tooltipBgColor = {
    light: '#ffffff',
    dark: '#334155'
  };

  const tooltipBorderColor = {
    light: '#e2e8f0',
    dark: '#475569'
  };

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(response).map(date => new Date(date)),
      datasets: [
        // emerald line
        {
          label: 'Total',
          data: Object.values(response).map(item => item.price * item.balance),
          borderColor: tailwindConfig().theme.colors.emerald[500],
          fill: false,
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: tailwindConfig().theme.colors.emerald[500],
          pointHoverBackgroundColor: tailwindConfig().theme.colors.emerald[500],
          pointBorderWidth: 0,
          pointHoverBorderWidth: 0,
          clip: 20,
        },
        // Blue line
        {
          label: 'Price',
          data: Object.values(response).map(item => item.price),
          borderColor: tailwindConfig().theme.colors.indigo[500],
          borderColor: tailwindConfig().theme.colors.blue[400],
          fill: false,
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: tailwindConfig().theme.colors.blue[400],
          pointHoverBackgroundColor: tailwindConfig().theme.colors.blue[400],
          pointBorderWidth: 0,
          pointHoverBorderWidth: 0,
          clip: 20,
        },
        // Indigo line
        {
          label: 'Balance',
          data: Object.values(response).map(item => item.balance),
          borderColor: tailwindConfig().theme.colors.indigo[500],
          fill: false,
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
          pointHoverBackgroundColor: tailwindConfig().theme.colors.indigo[500],
          pointBorderWidth: 0,
          pointHoverBorderWidth: 0,
          clip: 20,
        },
      ],
    },
    options: {
      layout: {
        padding: 20,
      },
      scales: {
        y: {
          beginAtZero: true,
          border: {
            display: false,
          },
          ticks: {
            maxTicksLimit: 5,
            callback: (value) => formatValue(value),
            color: darkMode ? textColor.dark : textColor.light,
          },
          grid: {
            color: darkMode ? gridColor.dark : gridColor.light,
          },
        },
        x: {
          type: 'time',
          time: {
            parser: 'MM-DD-YYYY',
            unit: 'day',
            displayFormats: {
              month: 'MMM YY',
            },
          },
          border: {
            display: false,
          },
          grid: {
            display: false,
          },
          ticks: {
            autoSkipPadding: 48,
            maxRotation: 0,
            color: darkMode ? textColor.dark : textColor.light,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        htmlLegend: {
          // ID of the container to put the legend in
          containerID: 'dashboard-card-08-legend',
        },
        tooltip: {
          callbacks: {
            title: () => false, // Disable tooltip title
            label: (context) => formatValue(context.parsed.y),
          },
          bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
          backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
          borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
        },
      },
      interaction: {
        intersect: false,
        mode: 'nearest',
      },
      maintainAspectRatio: false,
    },
    plugins: [{
      id: 'htmlLegend',
      afterUpdate(c, args, options) {
        const legendContainer = document.getElementById(options.containerID);
        const ul = legendContainer.querySelector('ul');
        if (!ul) return;
        // Remove old legend items
        while (ul.firstChild) {
          ul.firstChild.remove();
        }
        // Reuse the built-in legendItems generator
        const items = c.options.plugins.legend.labels.generateLabels(c);
        items.slice(0, 2).forEach((item) => {
          const li = document.createElement('li');
          li.style.marginLeft = tailwindConfig().theme.margin[3];
          // Button element
          const button = document.createElement('button');
          button.style.display = 'inline-flex';
          button.style.alignItems = 'center';
          button.style.opacity = item.hidden ? '.3' : '';
          button.onclick = () => {
            c.setDatasetVisibility(item.datasetIndex, !c.isDatasetVisible(item.datasetIndex));
            c.update();
          };
          // Color box
          const box = document.createElement('span');
          box.style.display = 'block';
          box.style.width = tailwindConfig().theme.width[3];
          box.style.height = tailwindConfig().theme.height[3];
          box.style.borderRadius = tailwindConfig().theme.borderRadius.full;
          box.style.marginRight = tailwindConfig().theme.margin[2];
          box.style.borderWidth = '3px';
          box.style.borderColor = c.data.datasets[item.datasetIndex].borderColor;
          box.style.pointerEvents = 'none';
          // Label
          const label = document.createElement('span');
          label.classList.add('text-slate-500', 'dark:text-slate-400');
          label.style.fontSize = tailwindConfig().theme.fontSize.sm[0];
          label.style.lineHeight = tailwindConfig().theme.fontSize.sm[1].lineHeight;
          const labelText = document.createTextNode(item.text);
          label.appendChild(labelText);
          li.appendChild(button);
          button.appendChild(box);
          button.appendChild(label);
          ul.appendChild(li);
        });
      },
    }],
  });

  document.addEventListener('darkMode', (e) => {
    const { mode } = e.detail;
    if (mode === 'on') {
      chart.options.scales.x.ticks.color = textColor.dark;
      chart.options.scales.y.ticks.color = textColor.dark;
      chart.options.scales.y.grid.color = gridColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.scales.x.ticks.color = textColor.light;
      chart.options.scales.y.ticks.color = textColor.light;
      chart.options.scales.y.grid.color = gridColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }
    chart.update('none');
  });
};
