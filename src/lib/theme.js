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
        ticks: { stroke: '#757575', size: 5},
        tickLabels: { fontSize: 10, padding: 0, angle: 50, verticalAnchor: 'start',
                                    textAnchor: 'start',},
      },
    },
  },
};

export default THEME;
