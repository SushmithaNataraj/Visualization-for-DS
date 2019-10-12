/** Data structure for the data associated with an individual country. */
class PlotData {
    /**
     *
     * @param country country name from the x data object
     * @param xVal value from the data object chosen for x at the active year
     * @param yVal value from the data object chosen for y at the active year
     * @param id country id
     * @param region country region
     * @param circleSize value for r from data object chosen for circleSizeIndicator
     */
    constructor(country, xVal, yVal, id, region, circleSize) {
        this.country = country;
        this.xVal = xVal;
        this.yVal = yVal;
        this.id = id;
        this.region = region;
        this.circleSize = circleSize;
    }
}

/** Class representing the scatter plot view. */
class GapPlot {

    /**
     * Creates an new GapPlot Object
     *
     * For part 2 of the homework, you only need to worry about the first parameter.
     * You will be updating the plot with the data in updatePlot,
     * but first you need to draw the plot structure that you will be updating.
     *
     * Set the data as a variable that will be accessible to you in updatePlot()
     * Call the drawplot() function after you set it up to draw the plot structure on GapPlot load
     *
     * We have provided the dimensions for you!
     *
     * @param updateCountry a callback function used to notify other parts of the program when the selected
     * country was updated (clicked)
     * @param updateYear a callback function used to notify other parts of the program when a year was updated
     * @param activeYear the year for which the data should be drawn initially
     */
    constructor(data, updateCountry, updateYear, activeYear) {

        // ******* TODO: PART 2 *******

        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 810 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.activeYear = activeYear;

        this.updateCountry = updateCountry;
        this.updateYear = updateYear;
        this.data = data;
        //console.log(data)
        //console.log(updateCountry);

        //YOUR CODE HERE
        this.drawPlot();

        // ******* TODO: PART 3 *******
        /**
         For part 4 of the homework, you will be using the other 3 parameters.
         * assign the highlightUpdate function as a variable that will be accessible to you in updatePlot()
         * assign the dragUpdate function as a variable that will be accessible to you in updatePlot()
         */
        //console.log(updateYear)
        //console.log(activeYear

    }

    /**
     * Sets up the plot, axes, and slider,
     */

    drawPlot() {
        // ******* TODO: PART 2 *******
        /**
         You will be setting up the plot for the scatterplot.
         Here you will create axes for the x and y data that you will be selecting and calling in updatePlot
         (hint): class them.

         Main things you should set up here:
         1). Create the x and y axes
         2). Create the activeYear background text


         The dropdown menus have been created for you!
         */

        d3.select('#scatter-plot')
            .append('div').attr('id', 'chart-view');

        d3.select('#scatter-plot')
            .append('div').attr('id', 'activeYear-bar');

        d3.select('#chart-view')
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);

        d3.select('#chart-view')
            .append('svg').classed('plot-svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);
        let svgGroup = d3.select('#chart-view').select('.plot-svg').append('g').classed('wrapper-group', true);
        //YOUR CODE HERE
        this.actv_year_txt = svgGroup.append('text').attr('y', this.margin.top + 50).attr('x', this.margin.left + 50)
            .classed('activeYear-background', true);
        svgGroup.append('text').attr('id', 'x_label');
        svgGroup.append('text').attr('id', 'y_label');

        let grp_xaxis = svgGroup.append('g').classed('x-axis', true).classed('axis', true).attr('transform', 'translate (' + this.margin.left + ',' + (this.height + this.margin.top)+ ')');

        let grp_yaxis = svgGroup.append('g').classed('y-axis', true).classed('axis', true).attr('transform', 'translate (' + this.margin.left + ',' + this.margin.top + ')');

        /* This is the setup for the dropdown menu- no need to change this */

        let dropdownWrap = d3.select('#chart-view').append('div').classed('dropdown-wrapper', true);

        let cWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        cWrap.append('div').classed('c-label', true)
            .append('text')
            .text('Circle Size');

        cWrap.append('div').attr('id', 'dropdown_c').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let xWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        xWrap.append('div').classed('x-label', true)
            .append('text')
            .text('X Axis Data');

        xWrap.append('div').attr('id', 'dropdown_x').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let yWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        yWrap.append('div').classed('y-label', true)
            .append('text')
            .text('Y Axis Data');

        yWrap.append('div').attr('id', 'dropdown_y').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        d3.select('#chart-view')
            .append('div')
            .classed('circle-legend', true)
            .append('svg')
            .append('g')
            .attr('transform', 'translate(10, 0)');

        this.drawYearBar();
        this.drawDropDown('fertility-rate', 'gdp', 'population');
        this.updatePlot(2000, 'fertility-rate', 'gdp', 'population');
    }

    /**
     * Renders the plot for the parameters specified
     *
     * @param activeYear the year for which to render
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    updatePlot(activeYear, xIndicator, yIndicator, circleSizeIndicator) {

        // ******* TODO: PART 2 *******

        /*
        You will be updating the scatterplot from the data. hint: use the #chart-view div

        *** Structuring your PlotData objects ***
        You need to start by mapping the data specified by the parameters to the PlotData Object
        Your PlotData object is specified at the top of the file
        You will need get the data specified by the x, y and circle size parameters from the data passed
        to the GapPlot constructor

        *** Setting the scales for your x, y, and circle data ***
        For x and y data, you should get the overall max of the whole data set for that data category,
        not just for the activeYear.

        ***draw circles***
        draw the circles with a scaled area from the circle data, with cx from your x data and cy from y data
        You need to size the circles from your circleSize data, we have provided a function for you to do this
        called circleSizer. Use this when you assign the 'r' attribute.

        ***Tooltip for the bubbles***
        You need to assign a tooltip to appear on mouse-over of a country bubble to show the name of the country.
        We have provided the mouse-over for you, but you have to set it up
        Hint: you will need to call the tooltipRender function for this.

        *** call the drawLegend() and drawDropDown()
        These will draw the legend and the drop down menus in your data
        Pay attention to the parameters needed in each of the functions

        */

        /**
         *  Function to determine the circle radius by circle size
         *  This is the function to size your circles, you don't need to do anything to this
         *  but you will call it and pass the circle data as the parameter.
         *
         * @param d the data value to encode
         * @returns {number} the radius
         */
        d3.select('.activeYear-background').text(activeYear);

        let circleSizer = function(d) {
            let cScale = d3.scaleSqrt().range([3, 20]).domain([minSize, maxSize]);
            return d.circleSize ? cScale(d.circleSize) : 3;
        };
        ///////////////////////////////////////////////////////////////////

        //YOUR CODE HERE
        let that= this;
        let population = this.data["population"];
        let x_axis_boundary = this.getBoundaries(this.data[xIndicator]);
        let y_axis_boundary = this.getBoundaries(this.data[yIndicator]);
        let data_yaxis = this.selectData(this.data[yIndicator], population);
        let data_xaxis = this.selectData(this.data[xIndicator], population);
        let data_circle = this.selectData(this.data[circleSizeIndicator], population);
        let circle_boundary = this.getBoundaries(data_circle);
        let minSize = circle_boundary[0];
        let maxSize = circle_boundary[1];
        let min_xaxis = x_axis_boundary[0];
        let max_xaxis = x_axis_boundary[1];
        let min_yaxis = y_axis_boundary[0];
        let max_yaxis = y_axis_boundary[1];
        let year = parseInt(activeYear);
        let date_per_yr = [];
        for (let i=0; i < data_xaxis.length; i++) {
            let plot_data = new PlotData(data_xaxis[i]["country"], data_xaxis[i][year], data_yaxis[i][year],
                data_xaxis[i]["geo"], data_xaxis[i]["region"], data_circle[i][year]);
            date_per_yr.push(plot_data);
        }
        let scale_x = d3.scaleLinear().range([0, this.width])
            .domain([min_xaxis, max_xaxis]).nice();
        let scale_y = d3.scaleLinear().range([0, this.height])
            .domain([max_yaxis, min_yaxis]).nice();
        let x_axis = d3.axisBottom(scale_x).scale(scale_x);
        let y_axis = d3.axisLeft(scale_y).scale(scale_y);
        d3.select('.x-axis').call(x_axis);
        d3.select('.y-axis').call(y_axis);
        let scale_cx = function(d, maxVal) {
            return that.margin.left + d.xVal*(that.width/maxVal);
        };
        let scale_cy = function(d, maxVal) {
            return (that.height - d.yVal*(that.height/maxVal)) + that.margin.top;
        };
        let circles = d3.select('.wrapper-group').selectAll('circle').data(date_per_yr);
        //console.log(circles)
        circles.exit().remove();
        let circlesEnter = circles.enter().append('circle');
        circles = circlesEnter.merge(circles);
        circles.attr('cx', d => scale_cx(d, max_xaxis)).attr('r', d => circleSizer(d)).attr('cy', d => scale_cy(d, max_yaxis))
            .attr('id', d => d.region + '.' + d.id.toUpperCase()).attr('class', d => 'circle ' + d.region)
            .append('title').html(this.tooltipRender);

        this.drawLegend(minSize, maxSize);
        this.drawDropDown(xIndicator, yIndicator, circleSizeIndicator);

        //axis labels
        let label_xaxis = d3.select('#dropdown_x').select('.dropdown-content').select('select').node();
        let label_yaxis = d3.select('#dropdown_y').select('.dropdown-content').select('select').node();
        let label_xaxis_txt = label_xaxis[label_xaxis.selectedIndex].text;
        let xAxisText = d3.select('#chart-view').select('.plot-svg').select("#x_label").datum(label_xaxis_txt);
        xAxisText.exit().remove();
        let label_yaxis_txt = label_yaxis[label_yaxis.selectedIndex].text;
        let enter_txt_xaxis = xAxisText.enter().append('text');
        xAxisText = enter_txt_xaxis.merge(xAxisText);
        xAxisText.attr("transform", "translate(" + (this.margin.left + this.width/2) + "," + (this.height + this.margin.top + 40) + ")")
            .text(d => d.toUpperCase()).style("text-anchor", "middle").classed('x-label', true);
        let yAxisText = d3.select('#chart-view').select('.plot-svg')
            .select("#y_label").datum(label_yaxis_txt);
        yAxisText.exit().remove();
        let enter_txt_yaxis = yAxisText.enter().append('text');
        yAxisText = enter_txt_yaxis.merge(yAxisText);
        yAxisText.attr('transform', 'rotate(-90)')
            .attr('y', yIndicator == 'population' ? this.margin.left - 65 : this.margin.left - 50).attr('x', 0 - this.height / 2)
            .text(d => d.toUpperCase()).style("text-anchor", "middle").classed('y-label', true);
    }
    selectData(data, population) {
        let data_selected = [];
        for (let i=0; i < data.length; i++) {
            let region = null;
            for (let j=0; j < population.length; j++) {
                if (population[j]["geo"] != null) {
                    if (data[i]["geo"] === population[j]["geo"]) {
                        data[i]["region"] = population[j]["region"];
                        data_selected.push(data[i]);
                        break;
                    }
                }
            }
        }
        return data_selected;
    }

    getBoundaries(data) {
        let min = Number.MAX_SAFE_INTEGER;
        let max = -1;
        for (let i=0; i < data.length; i++) {
            for(let j = 1800; j <= 2020; j++) {
                if (data[i][j] > max) {
                    max = data[i][j];
                }
                if (data[i][j] < min) {
                    min = data[i][j];
                }
            }
        }return [min, max];
    }

    /**
     * Setting up the drop-downs
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    drawDropDown(xIndicator, yIndicator, circleSizeIndicator) {

        let that = this;
        let dropDownWrapper = d3.select('.dropdown-wrapper');
        let dropData = [];

        for (let key in this.data) {
            dropData.push({
                indicator: key,
                indicator_name: this.data[key][0].indicator_name
            });
        }

        /* CIRCLE DROPDOWN */
        let dropC = dropDownWrapper.select('#dropdown_c').select('.dropdown-content').select('select');

        let optionsC = dropC.selectAll('option')
            .data(dropData);


        optionsC.exit().remove();

        let optionsCEnter = optionsC.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsCEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsC = optionsCEnter.merge(optionsC);

        let selectedC = optionsC.filter(d => d.indicator === circleSizeIndicator)
            .attr('selected', true);

        dropC.on('change', function(d, i) {
            let cValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let yValue = dropY.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
            that.updateCountry();
        });

        /* X DROPDOWN */
        let dropX = dropDownWrapper.select('#dropdown_x').select('.dropdown-content').select('select');

        let optionsX = dropX.selectAll('option')
            .data(dropData);

        optionsX.exit().remove();

        let optionsXEnter = optionsX.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsXEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsX = optionsXEnter.merge(optionsX);

        let selectedX = optionsX.filter(d => d.indicator === xIndicator)
            .attr('selected', true);

        dropX.on('change', function(d, i) {
            let xValue = this.options[this.selectedIndex].value;
            let yValue = dropY.node().value;
            let cValue = dropC.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
            that.updateCountry();
        });

        /* Y DROPDOWN */
        let dropY = dropDownWrapper.select('#dropdown_y').select('.dropdown-content').select('select');

        let optionsY = dropY.selectAll('option')
            .data(dropData);

        optionsY.exit().remove();

        let optionsYEnter = optionsY.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsY = optionsYEnter.merge(optionsY);

        optionsYEnter.append('text')
            .text((d, i) => d.indicator_name);

        let selectedY = optionsY.filter(d => d.indicator === yIndicator)
            .attr('selected', true);

        dropY.on('change', function(d, i) {
            let yValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let cValue = dropC.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
            that.updateCountry();
        });

        dropX.on('click', function () {
            d3.event.stopPropagation();
        });

        dropY.on('click', function () {
            d3.event.stopPropagation();
        });

        dropC.on('click', function () {
            d3.event.stopPropagation();
        });
    }

    /**
     * Draws the year bar and hooks up the events of a year change
     */
    drawYearBar() {

        // ******* TODO: PART 2 *******
        //The drop-down boxes are set up for you, but you have to set the slider to updatePlot() on activeYear change

        // Create the x scale for the activeYear;
        // hint: the domain should be max and min of the years (1800 - 2020); it's OK to set it as numbers
        // the plot needs to update on move of the slider

        /* ******* TODO: PART 3 *******
        You will need to call the updateYear() function passed from script.js in your activeYear slider
        */
        let that = this;

        //Slider to change the activeYear of the data
        let yearScale = d3.scaleLinear().domain([1800, 2020]).range([30, 730]);

        let yearSlider = d3.select('#activeYear-bar')
            .append('div').classed('slider-wrap', true)
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 1800)
            .attr('max', 2020)
            .attr('value', this.activeYear);

        let sliderLabel = d3.select('.slider-wrap')
            .append('div').classed('slider-label', true)
            .append('svg');

        let sliderText = sliderLabel.append('text').text(this.activeYear);

        sliderText.attr('x', yearScale(this.activeYear));
        sliderText.attr('y', 25);

        yearSlider.on('input', function() {
            //YOUR CODE HERE
            that.activeYear = this.value;
            sliderText.text(this.value);
            sliderText.attr('x', yearScale(this.value));
            let x_indicatoe = d3.select('#dropdown_x').select('.dropdown-content').select('select').node().value;
            let y_indicatoe = d3.select('#dropdown_y').select('.dropdown-content').select('select').node().value;
            let c_indicatoe = d3.select('#dropdown_c').select('.dropdown-content').select('select').node().value;

            that.updatePlot(this.value, x_indicatoe, y_indicatoe, c_indicatoe);
            that.updateYear(this.value);
            that.updateCountry();
        });

        yearSlider.on('click', function() {
            d3.event.stopPropagation();
        });
    }

    /**
     * Draws the legend for the circle sizes
     *
     * @param min minimum value for the sizeData
     * @param max maximum value for the sizeData
     */
    drawLegend(min, max) {
        // ******* TODO: PART 2*******
        //This has been done for you but you need to call it in updatePlot()!
        //Draws the circle legend to show size based on health data
        let scale = d3.scaleSqrt().range([3, 20]).domain([min, max]);

        let data_circle = [min, max];

        let svg = d3.select('.circle-legend').select('svg').select('g');

        let circleGroup = svg.selectAll('g').data(data_circle);
        circleGroup.exit().remove();

        let circleEnter = circleGroup.enter().append('g');
        circleEnter.append('circle').classed('neutral', true);
        circleEnter.append('text').classed('circle-size-text', true);

        circleGroup = circleEnter.merge(circleGroup);

        circleGroup.attr('transform', (d, i) => 'translate(' + ((i * (5 * scale(d))) + 20) + ', 25)');

        circleGroup.select('circle').attr('r', (d) => scale(d));
        circleGroup.select('circle').attr('cx', '0');
        circleGroup.select('circle').attr('cy', '0');
        let numText = circleGroup.select('text').text(d => new Intl.NumberFormat().format(d));

        numText.attr('transform', (d) => 'translate(' + ((scale(d)) + 10) + ', 0)');
    }

    /**
     * Reacts to a highlight/click event for a country; draws that country darker
     * and fades countries on other continents out
     * @param activeCountry
     */
    updateHighlightClick(activeCountry) {
        /* ******* TODO: PART 3*******
        //You need to assign selected class to the target country and corresponding region
        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for countries/regions, you can use
        // d3 selection and .classed to set these classes on here.
        // You will not be calling this directly in the gapPlot class,
        // you will need to call it from the updateHighlight function in script.js
        */
        //YOUR CODE HERE
        this.clearHighlight();
        let circles = d3.select('.plot-svg').selectAll('circle');
        let node_country = circles.filter(d => d.id.toUpperCase() == activeCountry.toUpperCase());
        if (node_country.node() != null) {
            let [countryRegion, countryId] = node_country.node().id.split('.');
            circles.filter(d => d.region != countryRegion).classed('hidden', true);
            node_country.classed('selected-country', true);
            circles.filter(d => d.region === countryRegion).classed('selected-region', true);
        }
    }

    /**
     * Clears any highlights
     */
    clearHighlight() {
        // ******* TODO: PART 3*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes off here.

        //YOUR CODE HERE
        d3.select('.plot-svg').selectAll('circle').classed('hidden', false).classed('selected-country', false).classed('selected-region', false);
    }

    /**
     * Returns html that can be used to render the tooltip.
     * @param data
     * @returns {string}
     */
    tooltipRender(data) {
        let text = "<h2>" + data['country'] + "</h2>";
        return text;
    }

}