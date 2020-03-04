var chart = LightweightCharts.createChart(document.body, { width: 800, height: 600 });
var lineSeries1 = chart.addLineSeries({
    color: "#00FF00"
});
lineSeries1.setData([
    { time: '2019-04-11', value: 80.01 },
    { time: '2019-04-12', value: 96.63 },
    { time: '2019-04-13', value: 76.64 },
    { time: '2019-04-14', value: 81.89 },
    { time: '2019-04-15', value: 74.43 },
    { time: '2019-04-16', value: 80.01 },
    { time: '2019-04-17', value: 96.63 },
    { time: '2019-04-18', value: 76.64 },
    { time: '2019-04-19', value: 81.89 },
    { time: '2019-04-20', value: 74.43 },
]);
var lineSeries2 = chart.addLineSeries({
    color: "#00FFFF"
});
lineSeries2.setData([
    { time: '2019-04-11', value: 90.01 },
    { time: '2019-04-12', value: 86.63 },
    { time: '2019-04-13', value: 66.64 },
    { time: '2019-04-14', value: 71.89 },
    { time: '2019-04-15', value: 84.43 },
    { time: '2019-04-16', value: 70.01 },
    { time: '2019-04-17', value: 66.63 },
    { time: '2019-04-18', value: 96.64 },
    { time: '2019-04-19', value: 41.89 },
    { time: '2019-04-20', value: 77.43 },
]);
chart.timeScale().fitContent();
