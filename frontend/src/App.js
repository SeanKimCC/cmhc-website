import './css/App.css';
import React from 'react';
import FrontPage from './components/frontpage';
import StickyHeader from './components/header';
import AboutSection from './components/about-section';
import ExperienceSection from './components/experience-section';
import ProjectSection from './components/project-section';
import FooterSection from './components/footer';
import SpaceWindow from './components/space-window';
import CanvasJSReact from './assets/canvasjs.react';


import Select from 'react-select';

import mapboxgl from 'mapbox-gl';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

mapboxgl.accessToken = 'pk.eyJ1Ijoic2VhbmtpbTkwNTgiLCJhIjoiY2tqeDZvc3VnMDB0cDJxbWgxczZrMG9rZCJ9.Qb-E8KTE-G6LeL5qcr234A';
const options = [
  { value: 0, label: 'Average Rent' },
  { value: 1, label: 'Average Rent to Median Income' },
  { value: 2, label: 'Median Income' },
  { value: 3, label: 'Average Age' },
]

var gl_map;

function toPercent(num){
  return (num*100).toFixed(1) + '%';
}

function toPropVal(num, max, min){
  return (num - min) / (max - min);
}

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      lng: -79.3832,
      lat: 43.7532,
      zoom: 10,
      layer: 1,
      feature: {}
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const self = this;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/seankim9058/ckjymjxkn2u6r17rwwoktb8kr',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom

    });
    gl_map = map;
    var layers = ['CTAvgRent','CTRentMedInc', 'CTMedIncome', 'CTAvgAge'];
    var selectedLayer = layers[this.state.layer];

    // map.scrollZoom.disable();
    map.on('load', function() {
      map.addSource('hello', {
        'type': 'vector',
        'url': 'mapbox://seankim9058.8hjjsa7k'
      });
  
      map.addLayer(
      {
      'id': 'CTHighlighted',
      'type': 'fill',
      'source': 'hello',
      'source-layer': "CensusTracts_Sean-5nu8bf",
      'paint': {
      'fill-outline-color': '#484896',
      'fill-color': '#6e599f',
      'fill-opacity': 0.75
      },
      'filter': ['in', 'CTUID', '']
      },
      );
    });
    map.on('mousemove', function(e) {
      var states = map.queryRenderedFeatures(e.point, {
        layers: ['CTAvgRent','CTRentMedInc', 'CTMedIncome', 'CTAvgAge']
      });
    });

    map.on('click', function (e) {
      // set bbox as 5px reactangle area around clicked point
      var bbox = [
      [e.point.x - 5, e.point.y - 5],
      [e.point.x + 5, e.point.y + 5]
      ];
      var features = map.queryRenderedFeatures(bbox, {
        layers: ['CTAvgRent','CTRentMedInc', 'CTMedIncome', 'CTAvgAge']
      });
      console.log(features);
      // Run through the selected features and set a filter
      // to match features with unique FIPS codes to activate
      // the `counties-highlighted` layer.
      if(features){
        features = [features[0]];
        var filter = features.reduce(
          function (memo, feature) {
            memo[2] = feature.properties.CTUID;
            return memo;
          },
          ['in', 'CTUID']
        );
        console.log(filter);
        map.setFilter('CTHighlighted', filter);
        console.log(features);
        self.setState({feature: features[0].properties});
      }
      
       
      // map.setFilter('CTHighlighted', filter);
      // if (features){
      //   var filter = features.reduce(
      //     function (memo, feature) {
      //       memo= ['literal',[feature.properties.CTUID]];
      //       return memo;
      //     },
      //     ['in', 'CTUID']
      //   );
      //   console.log(filter);
      //   map.setFilter('CTHighlighted', filter);
      // }
      
    }); 

  }

  

  handleChange(target) {
    console.log(target);
    this.setState({ layer: target.value });
  }

  render(){
    console.log(this.state);
    if (gl_map){
      gl_map.setLayoutProperty('CTHighlight', 'visibility', 'visible');

      var layers = ['CTAvgRent','CTRentMedInc', 'CTMedIncome', 'CTAvgAge'];
      var selectedLayer = layers[this.state.layer];
      for (var i = 0; i < layers.length; i++){
        selectedLayer = layers[i];
        if (i == this.state.layer){
          gl_map.setLayoutProperty(selectedLayer, 'visibility', 'visible');
        } else {
          gl_map.setLayoutProperty(selectedLayer, 'visibility', 'none');
        }
      }
    }
    
    const pdContent = this.state.feature ? ( <React.Fragment> <h3>Neighbourhood:<strong>   { this.state.feature.CTNAME  }</strong></h3><em>Average Age: <strong>  { this.state.feature.AvgAge }</strong></em><br/> 
           <em>Average Household Size: <strong>  { this.state.feature.AvgHouseho  }</strong></em><br/>
            <em>Average Income: <strong>$  { this.state.feature.AvgIncome  }</strong></em><br/>
             <em>Median Income: <strong>$  { this.state.feature.MedIncome  }</strong></em><br/>
              <em>Average Rent: <strong>$  { this.state.feature.AvgRentCos  }</strong></em><br/>
               <em>Average Cost of Ownership: <strong>$  { this.state.feature.AvgOwnCost  }</strong></em><br/>
               <em>Cost of Rent to Cost of Ownership: <strong>  {toPercent( this.state.feature.AvgRentCos /  this.state.feature.AvgOwnCost) }</strong></em><br/>
               <em>Cost of Rent to Avg Income: <strong>  {toPercent( this.state.feature.RenToAvgIn) }</strong></em><br/>
               <em>Cost of Ownership to Avg Income:  <strong>  {toPercent( this.state.feature.OwnToAvgIn) }</strong></em><br/>
               <em>Cost of Rent to Med Income: <strong>  {toPercent( this.state.feature.RenToMedIn) }</strong></em><br/>
               <em>Cost of Ownership to Med Income:  <strong>  {toPercent( this.state.feature.OwnToMedIn) }</strong></em><br/></React.Fragment>): (<p>Hover over a neighbourhood!</p>);


     const chartOptions = {
      title: {
        text: "Neighbourhood : "+ this.state.feature.CTNAME
      },
      data: [{        
                type: "column",
                dataPoints: [
                    { label: "Average Age",  y: toPropVal(this.state.feature.AvgAge, 80.1, 0)  },
                    { label: "Average Household Size",  y: toPropVal(this.state.feature.AvgHouseho, 4.7, 0)  },
                    { label: "Average Income",  y: toPropVal(this.state.feature.AvgIncome, 994527,0)  },
                    { label: "Median Income",  y: toPropVal(this.state.feature.MedIncome, 334165, 0)  },
                    { label: "Average Rent",  y: toPropVal(this.state.feature.AvgRentCos, 3622, 0)  },
                    { label: "Average Cost of Ownership",  y: toPropVal(this.state.feature.AvgOwnCost, 3944, 0)  },
                    { label: "Rent to Ownership",  y: toPropVal( this.state.feature.AvgRentCos /  this.state.feature.AvgOwnCost, 1.5, 0.2 ) },
                    { label: "Rent to Average Income",  y: toPropVal( this.state.feature.RenToAvgIn, 0.437001, 0)  },
                    { label: "Ownership to Average Income",  y: toPropVal( this.state.feature.OwnToAvgIn, 0.654825, 0)  },
                    { label: "Rent to Median Income",  y: toPropVal( this.state.feature.RenToMedIn, 0.713474, 0)  },
                    { label: "Ownership to Median Income",  y: toPropVal( this.state.feature.OwnToMedIn, 1.23, 0)  }
                ]
       }]
   }
     const containerProps = {
      width: "75%",
      height: "500px",
      border: "1px solid black",
      margin: '0 auto'
  };

    return (
      <div className="App">
        <StickyHeader/>
        <section className="app-fullpage">
          <header className="section-header">Toronto</header>
          <Select
            onChange={this.handleChange}
            className="basic-single layer-selectbox"
            classNamePrefix="select"
            defaultValue={options[0]}
            name="layer"
            options={options}
          />
          <div>
            <div className="map-container" id='map'></div>
            <div className='map-overlay' id='features'><h2></h2>
            <div id='pd'>
              {pdContent}

            </div>
            </div>
            <div className='map-overlay' id='selectLayer'></div>
          </div>
        </section>
        <FooterSection/>
        <section className="app-fullpage">
          <header className="section-header chart-header">Chart</header>
          <CanvasJSChart options = {chartOptions}
          containerProps={containerProps}
        />
        </section>
        <SpaceWindow
          backgroundImage="251624"
        />
        <section className="app-fullpage">
          <header className="section-header">Explanation</header>
          <p className="exp-text">
            Income, rent, cost of ownership, household size and age are all important data in making affordable housing policies. 
          </p>
          <p className="exp-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet sem eget dictum tincidunt. Donec dignissim nec quam at ultrices. Mauris vulputate neque orci, a rhoncus ligula pharetra eu. Suspendisse sit amet velit malesuada, venenatis nunc et, egestas metus. Quisque libero ante, tincidunt vitae mi id, dignissim egestas libero. Nullam sagittis nisi sed ultricies posuere. Pellentesque in odio velit. Morbi consequat tincidunt dui. Nunc massa ipsum, efficitur vehicula congue eu, hendrerit sed ipsum. Sed id mollis justo. Integer vitae tempus nibh. Suspendisse aliquam arcu ac felis convallis rutrum. Sed ultricies eros vel quam lobortis placerat. Proin tortor quam, ultricies faucibus rutrum ut, dapibus quis tortor. Sed pulvinar, augue sit amet facilisis condimentum, nisl quam sodales tellus, sit amet iaculis arcu dui id sem.
          </p>
          <p className="exp-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet sem eget dictum tincidunt. Donec dignissim nec quam at ultrices. Mauris vulputate neque orci, a rhoncus ligula pharetra eu. Suspendisse sit amet velit malesuada, venenatis nunc et, egestas metus. Quisque libero ante, tincidunt vitae mi id, dignissim egestas libero. Nullam sagittis nisi sed ultricies posuere. Pellentesque in odio velit. Morbi consequat tincidunt dui. Nunc massa ipsum, efficitur vehicula congue eu, hendrerit sed ipsum. Sed id mollis justo. Integer vitae tempus nibh. Suspendisse aliquam arcu ac felis convallis rutrum. Sed ultricies eros vel quam lobortis placerat. Proin tortor quam, ultricies faucibus rutrum ut, dapibus quis tortor. Sed pulvinar, augue sit amet facilisis condimentum, nisl quam sodales tellus, sit amet iaculis arcu dui id sem.
          </p>
        </section>
        <FooterSection/>

        
          

      </div>
    );
  }
}

export default App;
