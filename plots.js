
function init() {
  // d3.select() method is to select the dropdown menu(an id of "selDataset"), assigned to the variable selector
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);

    // Variable sampleNames is assigned to the names array inside data object
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        // "option" is appended as dropdown menu
        .append("option")
        // Convert each ID as text to be the dropdown menu option
        .text(sample)
        // Assign the ID as the value property
        .property("value", sample);
    });
})}

// When a change takes place in the dropdown menu, the optionChanged() function is called
function optionChanged(newSample) {
  //console.log(newSample);
  buildMetadata(newSample);
  buildCharts(newSample);
}

// once an ID is selected, the associated volunteer’s demographic information will be filtered fm samples.json n placed in panel
// the ID number will be passed on as sample in the argument
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // filter() method is called on the metadata array to filter for an object in the array 
    // whose id property matches the ID number passed into buildMetadata() as sample
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // the first item in the array (resultArray[0]) is selected and assigned to the variable result 
    // resultArray only has 1 item in the arrary [{}] due to metadata.filter(sampleObj => sampleObj.id == sample)
    var result = resultArray[0];
    // d3.select() method is used to select this <div> with id "sample-metadata" and assigned to PANEL
    var PANEL = d3.select("#sample-metadata");

    // PANEL.html("") ensures that the contents of the panel are cleared 
    PANEL.html("");
    // append() and text() methods are chained to append a h6 heading and print the location of the volunteer
    //PANEL.append("h6").text(result.location);
    // to print each key and value
    Object.entries(result).forEach(([key, value]) =>
      {PANEL.append("h6").text(key + ': ' + value);});

    // Challenge 12 the gauge chart
    var PANEL2 = d3.select("#gauge");
    PANEL2.html("");

    var data = {
      domain: { x: [0, 1], y: [0, 1] },
      value: result.wfreq,
      // added <br> to change line
      title: { text: "Belly Button Washing Frequency <br> (Scrubs per Week)"}, 
      gauge: {axis: { range: [null, 9]},
             // set up color per range 
             steps: [{ range: [0, 4], color: "lightgray" },
                     { range: [4, 7], color: "gray" }
                    ],
      },
		  type: "indicator",
		  mode: "gauge+number"    
    };

    Plotly.newPlot('gauge', [data]);
  });
}

// Challenge 12
function buildCharts(sample) {

  d3.json("samples.json").then((data)=>{
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    
    // the bar chart
    var PANEL1 = d3.select("#bar");
    PANEL1.html("");
    
    var trace1 = {
      // only top 10 samples, so to use slice(0,10)
      x: result.sample_values.slice(0,10),
      y: result.otu_ids.slice(0,10).map(id=>"OTU_id:"+id),
      // hover text
      text: result.otu_labels.slice(0,10),
      // horizontal bar chart
      orientation: 'h',
      type: "bar"     
    };
    
    var layout1 = {
      // reversed to go most to less
      yaxis: {autorange:'reversed'},
      xaxis: {title: "Sample_Values"}
    };

    Plotly.newPlot("bar", [trace1], layout1);

    // the bubble chart
    var PANEL2 = d3.select("#bubble");
    PANEL2.html("");

    var trace2 = {
      x: result.otu_ids,
      y: result.sample_values,
      text: result.otu_labels,
      mode: "markers",
      marker: {
        // size changes as sample_values
        size: result.sample_values,
        // color changes as otu_ids
        color: result.otu_ids
      }
    };

    var layout2 = {
      xaxis: {title: "OTU_IDs"},
      yaxis: {title: "Sample_Values"}
    };

    Plotly.newPlot("bubble", [trace2], layout2);

  })

}
init();