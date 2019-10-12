/** Data structure for the data associated with an individual country. */
class InfoBoxData {
    /**
     *
     * @param country name of the active country
     * @param region region of the active country
     * @param indicator_name the label name from the data category
     * @param value the number value from the active year
     */
    constructor(country, region, indicator_name, value) {
        this.country = country;
        this.region = region;
        this.indicator_name = indicator_name;
        this.value = value;
    }
}

/** Class representing the highlighting and selection interactivity. */
class InfoBox {
    /**
     * Creates a InfoBox Object
     * @param data the full data array
     */
    constructor(data) {
        this.data = data;
    }

    /**
     * Renders the country description
     * @param activeCountry the IDs for the active country
     * @param activeYear the year to render the data for
     */
    updateTextDescription(activeCountry, activeYear) {
        // ******* TODO: PART 4 *******
        // Update the text elements in the infoBox to reflect:
        // Selected country, region, population and stats associated with the country.
        /*
         * You will need to get an array of the values for each category in your data object
         * hint: you can do this by using Object.values(this.data)
         * you will then need to filter just the activeCountry data from each array
         * you will then pass the data as parameters to make an InfoBoxData object for each category
         *
         */

        //TODO - Your code goes here -
        this.clearHighlight();

        let that = this;

        if (! that.data['population'].find(d => d.geo == activeCountry)) {
            return undefined;
        }

        let grp_info = Object.keys(this.data).map(function (key) {
            let data_actv_country = that.data[key].find(d => d.geo == activeCountry);
            let country_region = that.data['population'].find(d => d.geo == activeCountry);
            let name_indicator = data_actv_country.indicator_name;
            let value = data_actv_country[activeYear];
            let infoBoxData = new InfoBoxData(data_actv_country.country, country_region.region, name_indicator, value);
            return infoBoxData;
        });


        let region_active = grp_info[0];
        let title_grp = d3.select('#country-detail').selectAll('span#infoTitle')
            .data([{'country' : region_active.country, 'region' : region_active.region}]);
        title_grp.exit().remove();
        let title_grpEnter = title_grp.enter().append('div').classed('label', true);
        title_grp = title_grpEnter.merge(title_grp);
        title_grp.append('i').attr('class', d => d.region).classed('fas fa-globe-asia', true);
        title_grp.append('span').attr('id', 'infoTitle').attr('style', 'color:black').text(d => ' ' + d.country);
        let text_info = d3.select('#country-detail').selectAll('div#info').data(grp_info);
        text_info.exit().remove();
        let text_infoEnter = text_info.enter().append('div').classed('stat', true)
            .attr('id', 'info');
        text_info = text_infoEnter.merge(text_info);
        text_info.append('text').text(d => d.indicator_name + ' : ' + d.value);
    }

    /**
     * Removes or makes invisible the info box
     */
    clearHighlight() {

        //TODO - Your code goes here -
        d3.select('#country-detail').html('');
    }

}