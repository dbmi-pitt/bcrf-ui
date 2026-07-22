const THEME = {
  isLgScreen: () => window.innerWidth > 992,
  badge: {
    overflow: 999,
  },
  colors: {
    primary: '#e4196d',
    secondary: '#54a3aa',
  },
  chart: {
    ticks: {
      style: {
        ticks: { stroke: '#757575', size: 5, x: 6 },
        tickLabels: { fontSize: 10, padding: 5, angle: 50},
      },
    },
  },
};

export default THEME;
