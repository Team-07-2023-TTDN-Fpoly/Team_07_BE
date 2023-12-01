function formatStatisticData(detailStatistic) {
  return {
    ...detailStatistic,
    dt_money: Number(detailStatistic.dt_money),
  };
}

module.exports = { formatStatisticData };
