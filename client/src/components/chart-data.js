const chartModel = () => {
    return {
        type: "line",
        data: {
            datasets: []
        },
        options: {
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 15
                }
            },
            responsive: true,
            lineTension: 1,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        tooltipFormat: 'lll',
                    }
                }],
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            padding: 25
                        }
                    }
                ]
            }
        }
    }
}
const datasetModel = () => {
    return {
        label: "",
        data: [],
        labelcolor: "#FFFFFF",
        //backgroundColor: "",
        borderColor: "#0167f3",
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#FFFFFF",
        borderWidth: 3
    }
}

const colors = ["#0167f3", "#CC5D18"]

export {
    chartModel,
    datasetModel,
    colors
};