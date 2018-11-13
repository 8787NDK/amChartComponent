
app.directive('candleStick', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/templates/candleStick-Directive.html',
        scope: {
            minperiod: '@',
            chartdata: '='
        },
        link: function (scope, element, attrs) {
            
        },
        controller: function ($scope) {
            var chart;
            var graph;
            var graphType = "candlestick";
            var maxCandlesticks = 100;
            var chartData = [];

            var initChart = function () {
                parseData();
                chart = new AmCharts.AmSerialChart();
                chart.dataProvider = chartData;
                chart.categoryField = "date";

                // listen for dataUpdated event ad call "zoom" method then it happens
                chart.addListener('dataUpdated', zoomChart);
                // listen for zoomed event andcall "handleZoom" method then it happens
                chart.addListener('zoomed', handleZoom);

                // AXES
                // category
                var categoryAxis = chart.categoryAxis;
                categoryAxis.parseDates = true; // as our data is date-based, we set this to true
                categoryAxis.minPeriod = $scope.minperiod; // our data is daily, so we set minPeriod to "DD"
                categoryAxis.dashLength = 1;
                categoryAxis.inside = true;
                // value
                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.dashLength = 1;
                valueAxis.axisAlpha = 0;
                chart.addValueAxis(valueAxis);
                // GRAPH
                graph = new AmCharts.AmGraph();
                graph.title = "Price:";
                // as candlestick graph looks bad when there are a lot of candlesticks, we set initial type to "line"
                graph.type = "line";
                // graph colors
                graph.lineColor = "#7f8da9";
                graph.fillColors = "#7f8da9";
                graph.negativeLineColor = "#db4c3c";
                graph.negativeFillColors = "#db4c3c";
                graph.fillAlphas = 1;
                // candlestick graph has 4 fields - open, low, high, close
                graph.openField = "open";
                graph.highField = "high";
                graph.lowField = "low";
                graph.closeField = "close";
                graph.balloonText = "Open:<b>[[open]]</b><br>Low:<b>[[low]]</b><br>High:<b>[[high]]</b><br>Close:<b>[[close]]</b><br>";
                // this one is for "line" graph type
                graph.valueField = "close";
                chart.addGraph(graph);
                // CURSOR
                var chartCursor = new AmCharts.ChartCursor();
                chart.addChartCursor(chartCursor);
                // SCROLLBAR
                var chartScrollbar = new AmCharts.ChartScrollbar();
                chartScrollbar.scrollbarHeight = 30;
                chartScrollbar.graph = graph; // as we want graph to be displayed in the scrollbar, we set graph here
                chartScrollbar.graphType = "line"; // we don't want candlesticks to be displayed in the scrollbar
                chartScrollbar.gridCount = 4;
                chartScrollbar.color = "#FFFFFF";
                chart.addChartScrollbar(chartScrollbar);
                // WRITE
                chart.write("chartdiv");
            }

            //parse data recieved from clients
            function parseData() {
                // split data string into array
                var rowArray = $scope.chartdata.split("\n");
                // loop through this array and create data items
                for (var i = rowArray.length - 1; i > -1; i--) {
                    var row = rowArray[i].split(",");
                    var dateArray = row[0].split("-");
                    // we have to subtract 1 from month, as months in javascript are zero-based
                    var date = new Date(Number(dateArray[0]), Number(dateArray[1]) - 1, Number(dateArray[2]));
                    var open = row[1];
                    var high = row[2];
                    var low = row[3];
                    var close = row[4];
                    chartData.push({
                        date: date,
                        open: open,
                        high: high,
                        low: low,
                        close: close
                    });
                }
            }

            // this method is called when chart is first inited as we listen for "dataUpdated" event
            function zoomChart() {
                // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
                chart.zoomToIndexes(chartData.length - 7, chartData.length - 1);
            }

            // this methid is called each time the selected period of the chart is changed
            function handleZoom(event) {
                var startDate = event.startDate;
                var endDate = event.endDate;
                document.getElementById("startDate").value = AmCharts.formatDate(startDate, "DD/MM/YYYY");
                document.getElementById("endDate").value = AmCharts.formatDate(endDate, "DD/MM/YYYY");
                // as we also want to change graph type depending on the selected period, we call this method
                changeGraphType(event);
            }

            // changes graph type to line/candlestick, depending on the selected range
            function changeGraphType(event) {
                var startIndex = event.startIndex;
                var endIndex = event.endIndex;
                if (endIndex - startIndex > maxCandlesticks) {
                    // change graph type
                    if (graph.type != "line") {
                        graph.type = "line";
                        graph.fillAlphas = 0;
                        chart.validateNow();
                    }
                } else {
                    // change graph type
                    if (graph.type != graphType) {
                        graph.type = graphType;
                        graph.fillAlphas = 1;
                        chart.validateNow();
                    }
                }
            }

            // this method converts string from input fields to date object
            function stringToDate(str) {
                var dArr = str.split("/");
                var date = new Date(Number(dArr[2]), Number(dArr[1]) - 1, dArr[0]);
                return date;
            }

            // this method is called when user changes dates in the input field
            function changeZoomDates() {
                var startDateString = document.getElementById("startDate").value;
                var endDateString = document.getElementById("endDate").value;
                var startDate = stringToDate(startDateString);
                var endDate = stringToDate(endDateString);
                chart.zoomToDates(startDate, endDate);
            }

            initChart();
        }
    }
});



