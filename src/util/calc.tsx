export default {
  percent: (amout: number, percent) => {
    return Math.round((amout / 100) * percent);
  },
};
