class Table{
    constructor(data) {
        this.frequencyScale = null;

        this.percentageScale = null;
        this.tcolorScale = d3.scaleOrdinal()
            .domain([data.map(d => d.category)])
            .range(["gold", "green", "orange", "lightgreen", "pink", "purple"])//, "grey", "darkgreen", "pink", "brown", "slateblue", "grey1", "orange"])


        this.tableElements = data;
        this.tableHeaders = ["Phrase", "Frequency", "Percentages", "Total"];
        this.cell = {
            "width": 70,
            "height": 25,
            "buffer": 15
        };
        this.phraseFlag = true;
        this.frequencyFlag = false;
        this.pflag = false;
    }

    createTable(){
       let that = this;

        this.percentageScale = d3.scaleLinear().domain([-100,100]).range([this.cell.buffer, 2 * this.cell.width]);
        this.percentageScalea = d3.scaleLinear().domain([0,100]).range([this.cell.buffer, this.cell.width]);

        this.frequencyScale = d3.scaleLinear().domain([0.0,1.0])
                                            .range([this.cell.buffer, this.cell.width + this.cell.buffer]);


       let fAxis = d3.axisTop()
                    .scale(this.frequencyScale).ticks(3);

       d3.select("#frequencyHeader").append('svg')
            .attr("height", this.cell.height)
            .attr("width", (this.cell.width + 2* this.cell.buffer))
           .append('g')
           .call(fAxis)
           .call(g => g.select(".domain").remove())
           .attr("transform", "translate(0,27)")

       // let fAxisGrp = d3.select("#frequencyHeader").append('svg')
       //     .attr("height", this.cell.height).attr("width", (this.cell.width + 2* this.cell.buffer))
       //     .call(fAxis)
       //     .attr("transform", "translate(0,30)")
       //     .call(g => g.select(".domain").remove())
       //  // fAxisGrp.selectAll("text")
       //  //     // .style("text-anchor", "end")
       //  //     .attr("dx", "0.3em").attr("dy", "0.35em")
       //  //     .attr("transform", "scale(1, -1) translate(0, -20)");

       let pAxis = d3.axisBottom().scale(this.percentageScale).ticks(5);
       pAxis.tickFormat(function (d) {
           if (d < 0) return -d;
           return d;
       })
       let pAxisGrp = d3.select("#percentageHeader").append('svg').attr("height",this.cell.height).attr("width",2*(this.cell.width+this.cell.buffer))
           .call(pAxis)
           .attr("transform","scale(1,-1)")
           .call(g=>g.select(".domain").remove())
        pAxisGrp.selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "0.3em").attr("dy", "0.35em")
            .attr("transform", "scale(1, -1) translate(0, -20)");

         d3.select("#phrase").on("click", function(){ that.sort_phrase(); });
         d3.select("#phrase2").on("click", function(){ that.sort_phrase(); });
         d3.select("#frequency").on("click", function(){ that.sort_frequency(); });
        d3.select("#frequencyHeader").on("click", function(){ that.sort_frequency(); });
        d3.select("#percentages").on("click", function(){ that.sort_percentages(); });
        d3.select("#percentageHeader").on("click", function(){ that.sort_percentages(); });
        d3.select("#total").on("click", function(){ that.sort_frequency(); });
        d3.select("#total2").on("click", function(){ that.sort_frequency(); });


    }
    sort_phrase(){
        let that = this;
        that.tableElements.sort(function(a, b){

            if(that.phraseFlag){return d3.ascending(a.phrase, b.phrase);}
            return d3.descending(a.phrase, b.phrase);
            // console.log("Printing data "+ a.phrase)
        });
        that.phraseFlag = !that.phraseFlag;
        that.updateTable();
    }
    sort_frequency(){
        let that  = this;
        // console.log("Coming here??")
        // console.log(that.tableElements.map(d=>d.phrase))
        that.tableElements.sort(function(a, b){
            // console.log(a.total);
            if(that.frequencyFlag) {return d3.ascending(parseInt(a.total), parseInt(b.total))}
            return d3.descending(parseInt(a.total), parseInt(b.total))
        });
        // console.log(that.tableElements.map(d=>d.phrase))

        that.frequencyFlag = !that.frequencyFlag;
        that.updateTable()
    }

    sort_percentages(){
        let that  = this;
        console.log("Coming here??"+ that.pflag)
        console.log(that.tableElements.map(d=>d.phrase))
        that.tableElements.sort(function(a, b){
            if(that.pflag)
                return d3.ascending(parseInt(a.percent_of_d_speeches)+parseInt(a.percent_of_r_speeches), parseInt(b.percent_of_d_speeches)+parseInt(b.percent_of_r_speeches));
            return d3.descending(parseInt(a.percent_of_d_speeches)+parseInt(a.percent_of_r_speeches), parseInt(b.percent_of_d_speeches)+parseInt(b.percent_of_r_speeches));
        });
        console.log(that.tableElements.map(d=>d.phrase))
        that.pflag = !that.pflag;
        that.updateTable()
    }

    updateTable(){

        let that = this;
        let table = d3.select("#dataTable").select("tbody").selectAll("tr").data(this.tableElements);
       // console.log("Printinng table elements",table)
        let table_enter = table.enter().append("tr");
        table.exit().remove();
        table = table_enter.merge(table);

        //create the first column
        let th = table.selectAll("th").data((d, i) => [{name:d.phrase}]);
        let th_val = th.enter().append("th");
        th.exit().remove();
        th = th_val.merge(th);

        th.text(d => { return d.name; })

        //creates all the td values for the entire table
        let td = table.selectAll("td").data(function(d){
           let rows = [ {vis:"bar",value:[d.total/50], category:[d.category]},
            {vis:"bars_p",value:{percent_of_d_speeches:[d.percent_of_d_speeches],percent_of_r_speeches:[d.percent_of_r_speeches]}},
            {vis:"text_another",value:[d.total]}
        ]
            return rows;
        });
        let td_val = td.enter().append("td");
        td.exit().remove();
        td = td_val.merge(td);
        //total column
        let rslt = td.filter(d => { return d.vis == 'text_another'; });
        let rsltSvg = rslt.selectAll("svg").data(function(d){
            return d3.select(this).data();
        });
        let rsltEnter = rsltSvg.enter().append("svg");
        rsltSvg.exit().remove();
        rsltSvg = rsltEnter.merge(rsltSvg);
         rsltSvg.attr("width",  this.cell.width)
             .attr("height", this.cell.height);

        let rsltText = rsltSvg.selectAll("text").data(function(d){
            return d3.select(this).data();
        });
        let rsltTextEnter = rsltText.enter().append("text");
        rsltText.exit().remove();
        rsltText = rsltTextEnter.merge(rsltText);
        rsltText.attr("y", 15).text(d => d.value).attr("transform","translate(30,0)");


        //create bars for frequency
        let fBar = td.filter(d=>{return d.vis == 'bar'; });
        let fBar_svg = fBar.selectAll("svg").data(function(d){
            return d3.select(this).data();
        });
        let fBar_svgEnter = fBar_svg.enter().append("svg");
        fBar_svg.exit().remove();
        fBar_svg =  fBar_svgEnter.merge(fBar_svg);
        fBar_svg.attr("width", this.cell.width).attr("height", this.cell.height)
            .attr("transform", "translate(-5, 0)");
        let fBar_grp = fBar_svg.selectAll("g").data(function(d){
            return d3.select(this).data();
        });
        let fBar_grpEnter = fBar_grp.enter().append("g");
        fBar_grp.exit().remove();
        fBar_grp = fBar_grpEnter.merge(fBar_grp)

        let fBars = fBar_grp.selectAll("rect").data(function(d){
            return d3.select(this).data();
        })

        let fBarsEnter = fBars.enter().append("rect");
        fBars.exit().remove();
        fBars = fBarsEnter.merge(fBars);
        fBars.attr("x", 20)
            .attr("y", 5)
            .attr("height", 20).attr("width", d =>{ return that.frequencyScale(d.value) - that.cell.buffer}).style("fill", d => this.tcolorScale(d.category))
//d => {d.value}

        //create bars for percentage
        let pBar = td.filter(d=>{return d.vis == 'bars_p'; });
        let pBar_svg = pBar.selectAll("svg").data(function(d){
            return d3.select(this).data();
        });
        let pBar_svgEnter = pBar_svg.enter().append("svg");
        pBar_svg.exit().remove();
        pBar_svg =  pBar_svgEnter.merge(pBar_svg);
        pBar_svg.attr("width", this.cell.width*2).attr("height", this.cell.height)
            .attr("transform", "translate(15, 0)");
        let pBar_grp = pBar_svg.selectAll("g").data(function(d){
            return d3.select(this).data();
        });
        let pBar_grpEnter = pBar_grp.enter().append("g");
        pBar_grp.exit().remove();
        pBar_grp = pBar_grpEnter.merge(pBar_grp)

        let pBars = pBar_grp.selectAll("rect").data(function(d){
            return d3.select(this).data();
        })

        let pBarsEnter = pBars.enter().append("rect");
        pBars.exit().remove();
        pBars = pBarsEnter.merge(pBars);
        pBars.attr("x", 0)
            .attr("y", 0)
            .attr("transform", " translate(60,0), scale(-1,1) ")
            .attr("height", 20).attr("width", d=>{return that.percentageScalea(d.value.percent_of_d_speeches)}).style("fill", 'purple')

        let rBars = pBar_grp.selectAll("rects").data(function(d){
            return d3.select(this).data();
        })

        let rBarsEnter = rBars.enter().append("rect");
        rBars.exit().remove();
        rBars = rBarsEnter.merge(rBars);
        rBars.attr("x", this.cell.width/2)
            .attr("y", 0)
            .attr("transform", "translate(28,0)scale(1,1) ")
            .attr("height", 20).attr("width", d =>{ return that.percentageScalea(d.value.percent_of_r_speeches)}).style("fill", 'orange')


    }

    // collapseList() {
    //     // ******* TODO: PART IV *******
    //     this.tableElements = this.data;
    //
    //     this.updateTable();
    // }
}