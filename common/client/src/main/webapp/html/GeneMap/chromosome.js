var GENEMAP = GENEMAP || {};

GENEMAP.Chromosome = function(userConfig) {
    var defaultConfig = {
      width: 40,
      height: 400, // only used if no scale is provided
      yScale: null,
      labelHeight: 20,
      border: false
    };

    var config = _.merge({}, defaultConfig, userConfig);

    /// returns the color property of the data formatted as an HTML color (#ffffff)
    var getColor = function(d) {
      // transform 0xffffff into #ffffff
      // if any letters are missing i.e. #ffff append 0s at the start => #00ffff
      return "#" +
              "0".repeat(8 - d.color.length) +
              d.color.substring(2, d.color.length);
    };

    // An SVG representation of a chromosome with banding data. This won't create an SVG
    // element, it expects that to already have been created.
    function my(selection) {
      selection.each(function(d, i){

        var y, height;
        if (config.yScale !== null){
          y = config.yScale;
          height = y(d.length);
        }
        else {
          y = d3.scale.linear().range([0, config.height]).domain([0, +d.length]);
          height = config.height;
        };

        var chromosomeGroup = d3.select(this).selectAll("g.chromosome").data([d]);

        // create the basic structure
        var enterGroup = chromosomeGroup.enter()
          .append("g").attr({
            class: "chromosome",
            id: "chromosome_" + d.number
          });

        enterGroup.append("defs");
        enterGroup.append("text");
        enterGroup.append("g").classed("bands_container", true);
        enterGroup.append("rect").classed("outline", true);

        if (config.border){
          enterGroup.append("rect").classed("border", true);
        }

        // Enter + Update elements

        chromosomeGroup.select('defs').html('')
          .append("mask").attr({
              id: "chromosome_mask_" + d.number, x: 0, y: 0
          })
          .append("rect").attr({
            class: "mask_rect", x:0, y:0
          });

        chromosomeGroup.select("text").attr({
          x: config.width / 2,
          y: config.labelHeight  * (0.85),
          'font-size': config.labelHeight ,
        }).text( function(d) {
            return d.number;
        });

        chromosomeGroup.select("#chromosome_mask_" + d.number).attr({
          width: config.width,
          height: height,
        });

        chromosomeGroup.select(".mask_rect").attr({
          width: config.width,
          height: height,
          x: 0,
          y: 0,
          rx: config.height * 0.05,
          ry: config.height * 0.05
        });

        chromosomeGroup.select("rect.outline")
          .attr({
            width: config.width,
            height: height,
            y: config.labelHeight,
            rx: config.height * 0.05,
            ry: config.height * 0.05
          });

        if (config.border){
          chromosomeGroup.select("rect.border")
            .attr({
              x:0,
              y:0,
              width: config.width,
              height: config.height + config.labelHeight
            });
        }

        // setup the chromosome bands
        var bandsContainer = chromosomeGroup.select(".bands_container").attr({
          transform: 'translate(0,' + config.labelHeight + ')'
        });

        var bands = bandsContainer.selectAll("rect.band").data(d.bands);
        bands.enter().append("rect").attr("class", "band");

        bands.attr({
          width: config.width,
          y: function(d) { return y(d.start)},
          height: function(d) { return y(d.end - d.start); },
          x: 0,
          fill: getColor
        });

        bands.exit().remove();

        chromosomeGroup.select(".bands_container").style({
              mask: "url(#chromosome_mask_" + d.number + ")"
        });
      });
    }

    my.width = function(value) {
      if (!arguments.length) return config.width;
      config.width = value;
      return my;
    }

    my.height = function(value) {
      if (!arguments.length) return config.height;
      config.height = value;
      return my;
    }

    my.yScale = function(value) {
      if (!arguments.length) return config.yScale;
      config.yScale = value;
      return my;
    }

    return my;
};
