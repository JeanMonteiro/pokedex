export default {
  percent: (amout: number, percent: number) => {
    return Math.round((amout / 100) * percent);
  },
};
