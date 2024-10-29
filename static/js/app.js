// Build the metadata panel
//let sample = "samples";
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
// let url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

    // get the metadata field
    let metadata = data.metadata;
    console.log(metadata);

    // Filter the metadata for the object with the desired sample number
    let filterMetadata = metadata.filter(result => result.id == sample);
    let metadataForSample = filterMetadata[0];
    //console.log(filterMetadata);

    // Use d3 to select the panel with id of `#sample-metadata`
    //d3.select(`#sample-metadata`);
    //let metadataForSample = filterMetadata[0];
    let PANEL = d3.select('#sample-metadata')
    
    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Inside a loop, you will need to use d3 to append new
    //Object.entries(filterMetadata[0]).forEach(([key,value])=> {
    // tags for each key-value in the filtered metadata.

    for (key in metadataForSample) {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${metadataForSample[key]}`);
    };
  });
}


// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sampleField = data.samples;
    //console.log(sampleFiled)

    // Filter the samples for the object with the desired sample number
    let filteredSamples = sampleField.filter(sampleObj => sampleObj.id === sample);
    let sampleData = filteredSamples[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleData.otu_ids;
    let otu_labels = sampleData.otu_labels;
    let sample_values = sampleData.sample_values;

    // Build a Bubble Chart
    // Render the Bubble Chart

    let bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
       margin: { t: 0 },
       hovermode: "closest",
       xaxis: { title: "OTU ID" },
       yaxis: {'title': "Number of Bacteria"},
       margin: { t: 30}
    };

    let bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
  ];
      
    Plotly.newPlot('bubble-chart', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.map(otuID => `OTU ${otuID}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    // Render the Bar Chart
    let barData = [
      {
        y: yticks.slice(0, 10).reverse(),
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 },
      xaxis: {'title': "Number of Bacteria"}
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    
    for (let i = 0; i < names.length; i++){
      dropdMenu        
        .append("option")
        .text(names[i])
        .property("value", names[i]);
    };

    // Get the first sample from the list
    let firstSample = names[0];
    console.log(firstSample)

    // Build charts and metadata panel with the first sample
    //buildMetadata(firstSample);
    let sampleField = data.samples;
    let filteredSamples = sampleField.filter(sampleObj => sampleObj.id === sample);
  
  });
};

// Function for event listener
function optionChanged(newSample) {
  console.log(newSample)
// Build charts and metadata panel each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
};

// Initialize the dashboard
init();