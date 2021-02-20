import React from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridView from '@fullcalendar/timegrid'
import axios from "axios";

export default class DemoApp extends React.Component {
state = {
  events:[]
}

  componentDidMount() {
    // fetch events
    const that = this;
    console.log("gello");
    axios.get('http://localhost:4000/').then(({data})=>{console.log(data);that.setState({events:data});});
 }

  render() {
    const {events} = this.state;
    console.log("render")
  return (<>
       <FullCalendar
        plugins={[ timeGridView ]}
        initialView="timeGridWeek"
        slotMinTime="8:00:00"
        slotMaxTime="20:00:00"
        events={events}
      /></>
    )
  }
}