import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';
import moment from 'moment';
import { DateRange } from 'react-date-range';
import geolib from 'geolib';
import { Button } from 'react-bootstrap';
import {Line} from 'react-chartjs-2';

import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

// Using an ES6 transpiler like Babel
import Slider from 'react-rangeslider'

// To include the default styles
import 'react-rangeslider/lib/index.css'


import LineChart from 'react-svg-line-chart'
import Tooltip from 'react-simple-tooltip'

const API_KEY = "AIzaSyBAfjAJYhJuoNfuA_GJvQKV93104RAnz_s";
const params = {v: '3.exp', key: API_KEY};

const back_api = 'https://asnow.co/prices'

const center = {
    lat: 9.67534935986178,
    lng: 99.6751592828879
}

const posters = ['Jon Doe','Jaan Taam','Matti Mei','Sa Nation La','Falana'];
const postersPic = [
    'http://vista.themeple.co/wp-content/uploads/2014/01/staff6.jpg',
    'data:image/jpeg;base64,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',
    'https://i.vimeocdn.com/portrait/12119859_300x300',
    'http://i.dailymail.co.uk/i/pix/2015/04/22/14/020596C70000044D-3047152-On_his_discovery_that_females_were_often_called_to_perform_first-a-39_1429709569601.jpg',
    'http://www.stoneoakgi.com/wp-content/uploads/2016/04/mallikarjun-profile-pic.jpg',
]

var coords_init = [
    {
        geo: {
            lat: 13.737215,
            lng: 100.560175
        },
        poster:"Teerapat Time",
        prices:[
            {timestamp: new Date(17,5,24), value: 12},
            {timestamp: new Date(17,5,23), value: 11},
            {timestamp: new Date(17,5,25), value: 7},
            {timestamp: new Date(17,5,15), value: 8},
            {timestamp: new Date(17,5,15), value: 15},
            {timestamp: new Date(17,5,9), value: 19},
        ],
        profileImg:'https://cdn3.f-cdn.com/files/download/33774556/friendly+face.jpg'
    },
    {
        geo: {
            lat: 13.747215,
            lng: 100.600175
        },
        poster:"Aroyy",
        prices:[
            {timestamp: new Date(17,6,24), value: 12},
            {timestamp: new Date(17,7,23), value: 11},
            {timestamp: new Date(17,5,25), value: 7},
            {timestamp: new Date(17,5,15), value: 8},
            {timestamp: new Date(17,6,15), value: 15},
            {timestamp: new Date(17,3,9), value: 19},
        ],
        profileImg:'https://i.ndtvimg.com/i/2017-08/jon-snow-kit-harington-emilia-clarke_650x400_41503040403.jpg'
    },
    {
        geo: {
            lat: 13.547215,
            lng: 100.700175
        },
        poster:"Aroyy",
        prices:[
            {timestamp: new Date(17,5,24), value: 12},
            {timestamp: new Date(17,5,23), value: 11},
            {timestamp: new Date(17,5,25), value: 7},
            {timestamp: new Date(17,5,15), value: 8},
            {timestamp: new Date(17,5,15), value: 15},
            {timestamp: new Date(17,5,9), value: 19},
        ],
        profileImg:'http://eadb.org/wp-content/uploads/2015/08/profile-placeholder.jpg'
    },
    {
        geo: {
            lat: 13.347215,
            lng: 100.400175
        },
        prices:[
            {timestamp: new Date(17,5,1), value: 12},
            {timestamp: new Date(17,5,4), value: 11},
            {timestamp: new Date(17,5,2), value: 7},
            {timestamp: new Date(17,5,8), value: 8},
            {timestamp: new Date(17,5,1), value: 15},
            {timestamp: new Date(17,5,23), value: 19},
        ],
        timestamp: new Date(),
        poster:"Aroyy",
        profileImg:'http://eadb.org/wp-content/uploads/2015/08/profile-placeholder.jpg'

    }
];



class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedPlace: -1,
            selectedPricePlace:-1,
            selectedPlaceObj:null,
            locatedPlaces:[],
            radius:1000,
            priceRange:{min:0,max:100},
            startDate:null,
            endDate:null,
            minPrice:'',
            maxPrice:'',
            activePoint: null,
            tooltipTrigger: null,
            coords:[],
            searchBox:'',
            center
        };

        this.onChange = (address) => this.setState({ searchBox:address })
    }

    updateData(){
        axios.get(back_api)
            .then((response)=>{
                var {data} = response.data;
                data = data.map((data,index)=>{
                    data.geo=data.longitude+"|"+data.latitude;
                    return data;
                });


                var groups = {};
                for (var i = 0; i < data.length; i++) {
                    var obj = data[i].geo;
                    if (!groups[obj]) {
                        groups[obj] = [];
                    }

                    groups[obj].push({value:data[i].price,timestamp:new Date(data[i].timestamp*1000)});
                }

                var myArray = [];
                var i=0;
                for (var geo in groups) {
                    const newGeo = {lng:geo.split("|")[0],lat:geo.split("|")[1]};
                    myArray.push({geo:newGeo , prices: groups[geo],poster:posters[i%posters.length],profileImg:postersPic[i%posters.length]});
                    i++;
                }

                this.setState({coords:myArray});

            });
    }

    componentDidMount(){


        this.updateData();

        setInterval(() => {

            this.updateData();
            },1000)
    }


    onMapCreated(map) {
        map.setOptions({
            disableDefaultUI: true
        });
    }

    onDragEnd(e) {
        console.log('onDragEnd', e);
    }

    onCloseClick() {
        console.log('onCloseClick');
        this.setState({selectedPlace:-1})
    }

    onClick(e) {
        console.log('onClick', e);
    }

    updateSelectedPoints(cur,radius){
        const {startDate,endDate,minPrice,maxPrice} = this.state;
        const plot2Graph = this.state.coords.filter((coord,index)=> {

            const isBetweenDateRange = !startDate || !endDate || !(startDate.toDate()==endDate.toDate())|| moment(coord.timestamp).isBetween(startDate, endDate);
            const lastPrice = coord.prices[coord.prices.length - 1];
            const ispriceBetweenRange = (!minPrice || lastPrice.value >= minPrice) && (!maxPrice || lastPrice.value <= maxPrice);


            const dist = geolib.getDistance(
                cur.geo,
                coord.geo
            );

            const isInBoundary = dist<radius;
            const isQueried = isBetweenDateRange && ispriceBetweenRange && isInBoundary;

            return isQueried;

        });

        this.setState({locatedPlaces:plot2Graph});
    }

    handleSelect(place, placeId){
        console.log(place);
        this.setState({searchBox:place});

        geocodeByAddress(place)
            .then(results => getLatLng(results[0]))
            .then(latLng => this.setState({center:latLng}));
    }

    render() {

        const {coords,startDate,endDate,minPrice,maxPrice,selectedPlace,locatedPlaces} = this.state;

        var data = [];
        for(var i=0;i<locatedPlaces.length;i++){
            data = data.concat(locatedPlaces[i].prices);
        }
        data.sort((a,b)=>a.timestamp.getTime()>b.timestamp.getTime()?1:a.timestamp.getTime()<b.timestamp.getTime()?-1:0);

        console.log(data.map((price, index) => {
            return price.value;
        }));

        const inputProps = {
            value:this.state.searchBox,
            onChange:this.onChange
        }

        return (
            <div>
                <div style={{float:'left',width:'67%'}}>

                    <PlacesAutocomplete inputProps={inputProps}  onSelect={this.handleSelect.bind(this)}/>
            <Gmaps
                width={'100%'}
                height={'350px'}
                lat={this.state.center.lat}
                lng={this.state.center.lng}
                zoom={12}
                loadingMessage={'Loading..'}
                params={params}
                onMapCreated={this.onMapCreated}>

                {coords.map((coord,index)=>{

                const isSelected = this.state.selectedPlace==index;
                const lastPrice = coord.prices[coord.prices.length-1];
                const isBetweenDateRange = !startDate||!endDate||(startDate==endDate)||moment(lastPrice.timestamp).isBetween(startDate,endDate);
                const ispriceBetweenRange = (!minPrice||lastPrice.value>=minPrice)&&(!maxPrice||lastPrice.value<=maxPrice);
                const isQueried = isBetweenDateRange&&ispriceBetweenRange;
                if(!isQueried&&isSelected){this.setState({selectedPlace:-1})}

                return (
                    isQueried?
                    [

                    <Marker
                        lat={coord.geo.lat}
                        lng={coord.geo.lng}
                        draggable={false}
                        onClick={()=>{this.setState({selectedPlace:index,selectedPlaceObj:coord}); this.updateSelectedPoints(coord,this.state.radius)}}
                        onDragEnd={this.onDragEnd}/>,


                        isSelected?
                            < InfoWindow
                        lat={coord.geo.lat}
                        lng={coord.geo.lng}
                        content={`<div><img height="32px" width="32px" style="border-radius:50%;" src=${coord.profileImg} /><br/> Poster: ${coord.poster} <br/>Price:  ฿${lastPrice.value}<br/> Date: ${moment(new Date(lastPrice.timestamp)).format("DD-MM-YYYY")}<br/> </div>`}
                        width={'30px'}
                        onCloseClick={this.onCloseClick.bind(this)}/>:null

                        ,
                        isSelected?
                    <Circle
                    lat={coord.geo.lat}
                    lng={coord.geo.lng}
                    radius={this.state.radius}
                    onClick={this.onClick} />:null
                    ]:null
                )}
                    )}
            </Gmaps>
                </div>



                <div style={{'display':'inline-block', 'float':'right','marginRight':'5px','marginTop':'5px'}}>
                    <div>
                    <DateRange
                        onInit={({startDate,endDate})=>console.log(startDate)}
                        onChange={({startDate,endDate})=>{
                            this.setState({startDate,endDate})
                        }}
                        startDate={startDate||moment()}
                        endDate={endDate||moment()}
                        calendars={1    }
                    />
                    </div>

                    <div>
                        <label>Min Price:</label><input type="number" value={minPrice} onChange={(e)=>this.setState({minPrice:e.target.value})}/><br/>
                        <label>Max Price:</label><input type="number" value={maxPrice} onChange={(e)=>this.setState({maxPrice:e.target.value})}/>
                    </div>

                    {this.state.selectedPlace>-1?
                        <div>
                            <div >
                                <Slider
                                    style={{width:'100px'}}
                                    value={this.state.radius}
                                    min={1}
                                    max={6000}
                                    onChange={(value) => {
                                        //Check
                                        this.setState({radius: value})
                                        this.updateSelectedPoints(this.state.selectedPlaceObj,value)
                                    }
                                    }
                                />
                            </div >

                        </div>:null
                    }






                    <Button bsStyle="primary">Export to csv</Button>



                </div>

                <Line

                    width={1600}
                    height={230}
                    data={{
                        labels:data.map((price, index) => {
                            return moment(price.timestamp).format("DD/MM/YY")
                        }),
                        datasets: [
                            {
                                label: 'Diesel Price',
                                fill: false,
                                lineTension: 0.1,
                                backgroundColor: 'rgba(75,192,192,0.4)',
                                borderColor: 'rgba(75,192,192,1)',
                                borderCapStyle: 'butt',
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: 'miter',
                                pointBorderColor: 'rgba(75,192,192,1)',
                                pointBackgroundColor: '#fff',
                                pointBorderWidth: 1,
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                                pointHoverBorderColor: 'rgba(220,220,220,1)',
                                pointHoverBorderWidth: 2,
                                pointRadius: 1,
                                pointHitRadius: 10,
                                data: data.map((price, index) => {
                                    return {x: index, y: price.value}
                                })

                            }
                        ]
                    }
                    }




                />

            </div>
        );
    }


}

export default App;
