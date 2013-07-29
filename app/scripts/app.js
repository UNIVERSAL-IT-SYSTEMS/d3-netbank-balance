/*global define */
define([], function () {
    'use strict';

    function drawArea(transactions) {
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left');

        var area = d3.svg.area()
            .x(function (transaction) {
                return x(transaction.date);
            })
            .interpolate('step')
            .y0(height)
            .y1(function (transaction) {
                return y(transaction.balance);
            });


        var svg = d3.select('#balance')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


        x.domain(d3.extent(transactions, function (transaction) {
            return transaction.date;
        }));

        y.domain([0, d3.max(transactions, function (transaction) {
            return transaction.balance;
        })]);

        svg.append('path')
            .datum(transactions)
            .attr('class', 'area')
            .attr('d', area);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);
        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Balance ($)');
    }

    function netbankAccessor() {
        var parseDate = d3.time.format('%d/%m/%Y').parse;

        var accessor = function (d) {
            if (d.length !== 4) {
                return null;
            }
            return {
                date: parseDate(d[0]),
                transaction: d3.round(parseFloat(d[1]), 2),
                description: d[2],
                balance: d3.round(parseFloat(d[3]), 2)
            };
        };
        return accessor;
    }

    function handleFileLoad() {
        return function (e) {
            var transactions = d3.csv.parseRows(e.target.result, netbankAccessor());
            drawArea(transactions);
        };
    }

    function handleFileSelect(evt) {
        var files = evt.target.files, f;
        f = files[0];
        var reader = new FileReader();
        reader.onload = handleFileLoad(f);
        reader.readAsText(f);
    }

    var that = {};
    that.bind = function() {
        document.getElementById('files').addEventListener('change', handleFileSelect, false);
    };

    return that;
});