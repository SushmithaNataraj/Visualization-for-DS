class Bubble{

    constructor(data){

        this.data = data;

        
        this.bubbleScale = null;
        this.radiusScale = null
        this.bubbleColourScale = null;
        window.catList = null;

    }

    createBubble(){

        // Buttons
        let svgBtn = d3.select('#buttons').append('p')

        //Text
        svgBtn.append('span').text('Grouped by Topic')

        // Toggle Button
        svgBtn.append('span')
            .append("label")
            .attr("id","labelID")
            .attr("class","switch")
            .append("input")
            .attr("type","checkbox")
            .attr("id", "toggleSwitch")

        d3.select("#labelID").append("span")
            .attr("class", "slider round")

        d3.select("#toggleSwitch").on("change",this.updateBubble)

        // For Story Button
        svgBtn.append("span")
            .append("button")
            .attr("id","extremeBtn")
            .text("Show Extremes")

        // Adding text Headings
        let headingSVG = d3.select('#bubble').append('svg')
            .attr("width",900)
            .attr("height", 30)
            .attr("id", "bubbleHeadings")

        headingSVG.append("text")
            .text("Democratic Leaning")
            .attr("transform", "translate(20 , 20)")

        headingSVG.append("text")
            .text("Republican Leaning")
            .attr("transform", "translate(750 , 20)")

        //Adding bubble scale
        let maxX = d3.max(this.data.map(d => d.position))
        let minX = d3.min(this.data.map(d => d.position))
        // console.log(minX,maxX)
        this.bubbleScale = d3.scaleLinear()
            .domain([minX,maxX])
            .range([30,870])
            .nice()

        let bubbleAxis = d3.axisBottom()
            .scale(this.bubbleScale)
            .tickFormat(Math.abs)

        d3.select('#bubble').append('svg')
            .attr("width",900)
            .attr("height", 30)
            .attr("id", "bubbleScale")
            .append("g")
            .call(bubbleAxis)
            .attr("transform", "translate(0 , -1)");


        //Adding Central Line
        let plotArea = d3.select('#bubble').append('svg')
            .attr("width",900)
            .attr("height", 900)
            .attr("id","plotArea")

        plotArea.append("g")
            .attr("id","centralLine")
            .append("line")
            .attr("x1", this.bubbleScale(0))
            .attr("y1", 0)
            .attr("x2", this.bubbleScale(0))
            .attr("y2", 130)
            .attr("stroke","gray")

        //Adding bubbles

        // Scale for radius
        let radMax = d3.max(this.data.map(d => parseInt(d.total)))
        let radMin = d3.min(this.data.map(d => parseInt(d.total)))

        this.radiusScale = d3.scaleLinear()
            .domain([radMin,radMax])
            .range([3,12])

        // Scale for color
        window.catList = d3.set(this.data.map(d=>d.category)).values()
        // console.log(this.catList)
        let colourList = ["lightgreen", "gold", "red", "lightblue", "pink", "purple"]
        this.bubbleColourScale = d3.scaleOrdinal()
            .domain(window.catList)
            .range(colourList);

        let circles = plotArea.append("g")
            .attr("id","bubbleChartCircles")
            .selectAll("circle")
            .data(this.data)

        let circles_enter = circles.enter()
            .append("circle")

        circles.exit().remove()

        circles = circles.merge(circles_enter)
        // console.log(this.data.map(d=>this.bubbleScale(d.position)))
        // console.log(this.data.map(d=>d.sourceX))
        circles.attr("cx", d => d.sourceX)
            .attr("cy", d => d.sourceY)
            .attr("r", d => this.radiusScale(d.total))
            .attr("id","bubbles")
            .attr("transform", "translate(0 , 60)")
            .style("fill", d => this.bubbleColourScale(d.category))


        // Create the headings for Category Names
        let catHeading = d3.select("#plotArea").append("g")
            .attr("id","categoryNames")


        // Create the tooltip
        let tooltip = d3.select("body").append("div")
            .attr("class","tooltip-donut")
            .style("opacity",0)

        //Mouseover and Mouseout events
        d3.select("#plotArea").selectAll("circle")

            .on("mouseover", function(d,i){
                // set circle stroke width to 2px
                d3.select(this)
                    .attr("opacity","1")
                    .style("stroke-width","2px")

                // Making the tooltip to appear on screen
                    tooltip.transition()
                        .duration(20)
                        .style("opacity",1)

                // Add text on tooltip
                tooltip.html(d.phrase)
                    .style("text-transform","capitalize")
                    .style("font-size",50)
                    .style("font-weight","bold")
                    // Positioning the tooltip next to the cursor
                    .style("left",(d3.event.pageX + 10)+"px")
                    .style("top",(d3.event.pageY - 10)+"px")
                    // Append a div and add text to it
                    .append("div").html(d.position>0 ? "R+ "+d.position.toFixed(3) + "%" : "D+ "+Math.abs(d.position).toFixed(3) + "%")
                    .style("font-size",12)
                    .style("font-weight","normal")
                    // Appending another div to add text to it
                    .append("div").html("In "+(d.total/50*100).toFixed(0)+"% of speeches")

            })

            .on("mouseout", function(d,i){
                // Making the circle stroke width to be 1px
                d3.select(this).attr("opacity","1").style("stroke-width","1px")

                // Make the tooltip to disappear
                tooltip.transition().duration(20).style("opacity",0)

            })
    }

    updateBubble(){
        let toggleButton = document.getElementById("toggleSwitch")
        if(toggleButton.checked == true){
            //Move the circles to new positions
            let bubbleChartCircles = d3.select("#bubbleChartCircles").selectAll("circle")
            bubbleChartCircles.exit().remove()

            bubbleChartCircles.transition()
                .duration(500)
                .attr("cx", d => d.moveX)
                .attr("cy", d => d.moveY)

            // Extending the central line
            let centralLine = d3.select("#centralLine").select("line")
            centralLine.exit().remove()

            centralLine.transition()
                .duration(500)
                .attr("y2", 735)

            // Add Category listnames
            d3.select("#categoryNames")
                .selectAll("text")
                .data(window.catList)
                .enter()
                .append("text")
                .style("fill","#808080")
                .transition()
                .duration(500)
                .attr("x",30)
                .attr("y",(d,i) => i*130 + 20)
                .text((d,i) => window.catList[i])
                .style("text-transform","capitalize")

        }
        else{

            // Move the circles back to old positions
            let bubbleChartCircles = d3.select("#bubbleChartCircles").selectAll("circle")
            bubbleChartCircles.exit().remove()

            bubbleChartCircles.transition()
                .duration(500)
                .attr("cx", d => d.sourceX).attr("cy", d => d.sourceY)

            //Shortening the central line
            let centralLine = d3.select("#centralLine").select("line")
            centralLine.exit().remove()

            centralLine.transition().duration(500).attr("y2", 130)

            //Remove Category
            let catHeading = d3.select("#categoryNames").selectAll("text")

            catHeading.transition()
                .duration(500)
                .attr("y",0)
                .remove()
        }
    }

}