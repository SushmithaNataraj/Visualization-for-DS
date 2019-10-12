/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
  // ****** TODO: PART II ******
  let g_object = document.getElementById("aBarChart");
  g_object.setAttribute("transform", "translate(150,0)")
  let rect = g_object.querySelectorAll("rect")
    let a_bar_width = new Array();



 // // console.log(rect)
  //let k = 15
  for(let i=0; i<rect.length; i++) {
      a_bar_width[i] = rect[i].attributes.width.value;
  }
    //rect[i].setAttribute("width", k);
    //k = k+15;

    a_bar_width.sort(function(a,b){
        return parseInt(a) - parseInt(b);
    });

    for(let i=0; i<rect.length; i++) {
        rect[i].attributes.width.value = a_bar_width[i];
    }

 //  rect.forEach(function(cl){
 //    cl.addEventListener("onmouseover", changeColor(cl))
 //    cl.addEventListener(("onmouseout", changeme_back(cl)))
 //  })

}

/**
 * Render the visualizations
 * @param data
 */
function update(data) {
  /**
   * D3 loads all CSV data as strings. While Javascript is pretty smart
   * about interpreting strings as numbers when you do things like
   * multiplication, it will still treat them as strings where it makes
   * sense (e.g. adding strings will concatenate them, not add the values
   * together, or comparing strings will do string comparison, not numeric
   * comparison).
   *
   * We need to explicitly convert values to numbers so that comparisons work
   * when we call d3.max()
   **/
  for (let d of data) {
    d.a = +d.a; //unary operator converts string to number
    d.b = +d.b; //unary operator converts string to number
  }

 console.log(data);
  let a_values = [];
  let b_values = [];
for(let i in data){
  a_values[i] = data[i].a;
  b_values[i] = data[i].b;
  if(i == data.length-1)
    break;
}

  // Set up the scales
  let aScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.a)])
    .range([0, 140]);
  //console.log(aScale);
  let bScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.b)])
    .range([0, 140]);
  let iScale = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([10, 120]);



  // ****** TODO: PART III (you will also edit in PART V) ******

  // TODO: Select and update the 'a' bar chart bars
 // let svg = d3.select("svg");
 // svg.attr("transform", "translate(-30,0)").attr("width",600);
  let a_bar_chart = d3.select("#aBarChart");
  let old_a_bar = a_bar_chart.selectAll("rect").data(data);
//let rect = selection1.enter().append("rect");
 // selection1 = rect.merge(selection1);
    let new_a_bar = old_a_bar.enter().append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => { return (i*8+iScale(i));})
        .attr("width",(d) => { return aScale(d.a);})
        .attr("height", 18)
        .attr("transform", "translate(18,0), scale(-1,1)")
        .style("stroke", 'white')
        .style("stroke-width", '2')
        .style("opacity", 0);

    old_a_bar.exit()
        .style("opacity", 1)
        .transition()
        .duration(2500)
        .style("opacity", 0)
        .remove();

    old_a_bar = new_a_bar.merge(old_a_bar);

    old_a_bar.transition().duration(2500).attr("x", 0).attr("y", (d, i) => { return (i*8+iScale(i)); }).attr("width", (d) => { return aScale(d.a); }).attr("height", 18)
        .style("stroke", 'white')
        .style("stroke-width", '2')
        .style("opacity",1);

     // .attr("x", function(d,i){return g1_width-d;})
     // .attr("y",function(d,i){ return i+18;})
     // .attr("transform","translate(170,0),scale(-1,1)")
     // .exit().remove();


  // TODO: Select and update the 'b' bar chart bars
let bar_chart_b = d3.select("#bBarChart");
let old_bar_b = bar_chart_b.selectAll("rect").data(data);
let new_bar_b = old_bar_b.enter().append("rect");
new_bar_b
    .attr("width", 0)
    .attr("height", 18)
    .attr("x", 0)
    .attr("y", (d, i) => { return (i*8+iScale(i)); })
    .style("opacity", 0)
    .style("stroke", 'white')
    .style("stroke-width",'2');

old_bar_b.exit().style("opacity", 1).transition().duration(2500).style("opacity", 0).remove();

    old_bar_b = new_bar_b.merge(old_bar_b);

    old_bar_b.transition().duration(2500)
        .attr("width", (d) => { return 2*bScale(d.b); })
        .attr("height", 18)
        .attr("x",'0')
        .attr("y", (d, i) => { return (i*8+iScale(i)); })
        .style("stroke", "white")
        .style("stroke-width",'2')
        .style("opacity",1);


  //let selection2 = g2.selectAll("rect").data(b_values);
 // let rect2 = selection2.enter().append("rect");
  //selection2 = rect2.merge(selection2);
 // selection2
   //   .join("rect")
   //    .attr("width", function(d,i){return (2.1 * (bScale(d)));})
   //
   //    .transition()
   //    .duration(3000)
   //    .style("opacity", 1);
    //  .delay(function (d, i) {
      //  return i * 10;
      //})
      //.exit().remove();
      //.attr("y", function(d,i){return i+18;})
     // .attr("transform", "scale(-2,1)")


  // TODO: Select and update the 'a' line chart path using this line generator
  let aLineGenerator = d3
    .line()
      .x((d, i) => iScale(i))
      .y(d => 300- aScale(d.a));

     let svg2 = d3.select(".line-chart-x");
    let g_line1 = svg2.select("g");
    g_line1.attr("transform", "translate(50,-270), scale(1.9,1.9)");
    let line_a_path = d3.select("#aLineChart").data(data)
        .attr("d", aLineGenerator(data))
        .style("opacity", 0)
        .transition()
        .duration(2500)
        .style("stroke-width", '1')
        .style("opacity", 1);



  //  let select3 = g_line1.select("path");//.data(data);
  //  select3
  //     // .join()
  //      .attr("d",aLineGenerator(data))
  //      .style("stroke-width", 1);



  // TODO: Select and update the 'b' line chart path (create your own generator)
  let bLineGenerator = d3
      .line()
      .x((d,i) => iScale(i))
      .y(d => 300-bScale(d.b));

 let svg_lineb = d3.select(".line-chart-y");
 let g_lineb = svg_lineb.select("g");
 g_lineb.attr("transform","translate(50, -270), scale(1.9,1.9)");
// let select_lineb = g_lineb.select("path");//.data(data);
// select_lineb
//     //.join()
//     .attr("d",bLineGenerator(data))
//     .style("stroke-width",1);

    let line_b_path = d3.select("#bLineChart").data(data)
        .style("opacity", 0)
        .attr("d", bLineGenerator(data))
        .transition()
        .duration(2500)
        .style("stroke-width", '1')
        .style("opacity", 1);

   // TODO: Select and update the 'a' area chart path using this area generator
  let aAreaGenerator = d3
    .area()
    .x((d, i) => iScale(i))
    .y0(0)
    .y1(d => aScale(d.a));

  let svg_area_a = d3.select(".area-chart-x");
  let g_area_a = svg_area_a.select("g");
  g_area_a.attr("transform","translate(300,0) scale(2.1,2.1) rotate(90)");
  let path_area_a = g_area_a.select("path")
      .style("opacity", 0)
      .transition()
      .duration(1500)
      .style("opacity", 1)
      .attr("d",aAreaGenerator(data))
//
//
//
//   // TODO: Select and update the 'b' area chart path (create your own generator)
  let bAreaGenerator = d3
      .area()
      .x((d, i) => iScale(i))
      .y0(0)
      .y1(d => bScale(d.b));

   let svg_area_b = d3.select(".area-chart-y");
   let g_area_b = svg_area_b.select("g");
   g_area_b.attr("transform","scale(2.1,-2.1) rotate(-90)")
   let area_chart_b = g_area_b.select("path");//.data(data);
// let path_area_b = selection_area_b.enter().append("path");
// selection_area_b = path_area_b.merge(selection_area_b);
 area_chart_b
    // .join()
     .style("opacity", 0)
     .transition()
     .duration(1500)
     .style("opacity", 1)
     .attr("d",bAreaGenerator(data))




  // TODO: Select and update the scatterplot points
  const plotDimensionX = 300;
  const plotDimensionY = 300;

  const xScale = d3.scaleLinear().domain([0, 18]).range([0, plotDimensionX])
  const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.b)]).range([plotDimensionY, 0])

  let plot = d3.select('#scatterplot').attr('transform', `translate(100,100)`);
  //plot.append('rect').attr('width', plotDimensionX).attr('height', plotDimensionY).classed('background-rect', true);


  let circles = plot.selectAll('circle').data(data);//.join('circle')//.attr('transform', 'scale(1,-1)');

    let new_circles = circles.enter().append("circle")
        .attr("cx", (d) => { return xScale(d.a); })
        .attr("cy", (d) => { return yScale(d.b); })
        .attr("r", 3)
        // .attr('transform', 'scale(1,-1)');

    circles.exit().style("opacity", 1).transition().duration(2000).style("opacity", 0)
        .remove();

    circles = new_circles.merge(circles);


    circles.transition()
        .duration(1500)
        .attr("cx", (d) => { return xScale(d.a); })
        .attr("cy", (d) => { return yScale(d.b); })
        .attr("r", 3)
        .style("opacity", 1);
    // circles.attr('cx', d =>(1* xScale(d.a))).attr('cy', d =>  yScale(d.b)).attr('r', 3);
  // circles.on("click", function(){
  //   console.log("hiiiiiiiiiii")
  // })


  // circles.nodes().forEach(function(cl){
  //   cl.addEventListener("onclick", console.log("X: ",cl.cx));
  // })


// for(let k = 0; k<circles.length; k++) {
//   circles[k].addEventListener("click",
//       function () {
//         console.log("clicked");
//       }, false);
// }



  // let log_circles = plot.selectAll("circle");
  // log_circles.addEventListener("click",function(){
  //   console.log("X: "+cx);
  //   console.log("Y: "+cy);});

  let regression_line = d3.select("#regression-line").attr("x1",xScale(2)).attr("y1",yScale(4)).attr("x2",xScale(16)).attr("y2",yScale(11)).style("stroke-width", 2);

   const xAxisGroup = d3.select('#x-axis').classed('x-axis', true).attr('transform', `translate(0, ${plotDimensionY})`)
   const yAxisGroup = d3.select('#y-axis').classed('y-axis', true);

  const xAxisScale = d3.axisBottom(xScale);
  const yAxisScale = d3.axisLeft(yScale);


  xAxisGroup.call(xAxisScale);
  yAxisGroup.call(yAxisScale);
//set the ranges
//   let xAxis = d3.axisBottom();
//   xAxis.scale(aScale);
//
// let yAxis = d3.axisLeft();
// yAxis.scale(bScale);
// g_scatter = d3.select("#scatterplot");
// select_circle = g_scatter.selectAll("circle").data(data).join("circle").classed("scatterplot",true);
//   let circles = select_circle.enter().append("circle");
//   select_circle = circles.merge(select_circle);
//   select_circle
//       .attr("cx", (d) => {return aScale(d);})
//       .attr("cy", (d) => {return bScale(d);})
//       .attr("r", 2)
//       .attr("transform", "scale(1,-1)");
//
// g_scatter.classed("axis",true)
//     .call(xAxis)
//     .call(yAxis);

  // ****** TODO: PART IV ******

    // circles.on("click", function(d) {
    //     let points = d3.mouse(this);
    //     console.log("X: " + xScale.invert(points[0].toFixed(2))+", " + "Y : " +xScale.invert(points[1].toFixed(2)));
    // });

    circles.on("click", function(d){
      console.log("X: ",d.a, " ","Y: ",d.b)
  })


    circles.on("mouseover", function(d) {
        circles.append("title").text(function(d) {
            return [d.a, d.b]; });
    });

    circles.on("mouseout", function(d) {
        circles.select("title").remove();
    });

    document.getElementById("aBarChart").addEventListener("mouseover", function(event) {
        event.target.style.fill = "grey";});

    document.getElementById("aBarChart").addEventListener("mouseout", function(event) {
        event.target.style.fill = "#c7001e";});

    document.getElementById("bBarChart").addEventListener("mouseover", function(event) {
        event.target.style.fill = "grey";})

    document.getElementById("bBarChart").addEventListener("mouseout", function(event) {
        event.target.style.fill = "#086fad";})

}

/**
 * Update the data according to document settings
 */
async function changeData() {
  //  Load the file indicated by the select menu
  let dataFile = document.getElementById("dataset").value;
  try {
    const data = await d3.csv("data/" + dataFile + ".csv");
    if (document.getElementById("random").checked) {
      // if random
      update(randomSubset(data)); // update w/ random subset of data
    } else {
      // else
      update(data); // update w/ full data
    }
  } catch (error) {
    console.log(error)
    alert("Could not load the dataset!");
  }
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset(data) {
  return data.filter(d => Math.random() > 0.5);
}
