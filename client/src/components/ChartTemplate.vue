<template>
  <div>
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";
import { chartModel, datasetModel, colors } from "./chart-data.js";

export default {
  props: ["series"],
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    let chartM = chartModel();

    let i = 0;
    for (let key in this.series) {
      if (this.series[key]) {
        let dataset = datasetModel();
        dataset.data = this.series[key].points;
        dataset.label = this.series[key].label;
        dataset.borderColor = colors[i];
        chartM.data.datasets.push(dataset);
        i++;
      }
    }

    this.chart = new Chart(this.$refs.chart, chartM);
  },
  watch: {
    series: function(series) {
      console.log(series);
      this.chart.data.datasets = [];

      let i = 0;
      for (let key in this.series) {
        if (this.series[key]) {
          let dataset = datasetModel();
          dataset.data = this.series[key].points;
          dataset.label = this.series[key].label;
          dataset.borderColor = colors[i];
          this.chart.data.datasets.push(dataset);
          i++;
        }
      }
      this.chart.update();
    }
  }
};
</script>