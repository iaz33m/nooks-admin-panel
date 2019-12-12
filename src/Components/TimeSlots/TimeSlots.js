import React, {Component} from "react";
import {
  Col,
  ListGroup,
  ListGroupItem,
  Row,
  TabContent,
  TabPane
} from 'reactstrap';

import Select from 'react-select'

class TimeSlots extends Component {

  state = {
    activeTab:0,
    days:[
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
  };

  componentWillMount() {

    let {forEdit,daySlots,onChange} = this.props;

    let timeSlots = [{value:0,label:`12 AM`}];

    for (let i=1;i<12;i++){
      timeSlots.push({value:i,label:`${i} AM`});
    }

    timeSlots.push({value:12,label:`12 PM`});

    for (let i=1;i<12;i++){
      timeSlots.push({value:i+12,label:`${i} PM`});
    }

    if(!forEdit){
      daySlots = [];
      for (let i=0;i<7;i++){
        daySlots.push({day:i,opening:8,closing:17});
      }
      onChange(daySlots);
    }

    this.setState({
      timeSlots,
      daySlots
    });

  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  onChange = (day,value,field) => {

    const {daySlots} = this.state;
    const {onChange} = this.props;

    let slots = daySlots.map((s,i)=>{
      if(i === day){
        return {...s,[field]:value};
      }
      return {...s};
    });

    this.setState({
      daySlots:slots
    });

    onChange(slots);
  };

  render(){

    const {activeTab,days,timeSlots,daySlots} = this.state;

    return (
      <Row>
        <Col xs="4">
          <ListGroup id="list-tab" role="tablist">
            {days.map((d,i) => <ListGroupItem key={i} onClick={() => this.toggle(i)} action active={activeTab === i} >{d}</ListGroupItem>)}
          </ListGroup>
        </Col>
        <Col xs="8">
          <TabContent activeTab={activeTab}>
            {days.map((d,i) => (
              <TabPane key={i} tabId={i}  >

                <Row>
                  <Col xs={6}>
                    <Select
                      placeholder="Opening"
                      options={timeSlots}
                      defaultValue={timeSlots[daySlots[i].opening]}
                      onChange={v=>this.onChange(i,v.value,'opening')}
                    />
                  </Col>
                  <Col xs={6}>
                    <Select
                      placeholder="Closing"
                      options={timeSlots}
                      defaultValue={timeSlots[daySlots[i].closing]}
                      onChange={v=>this.onChange(i,v.value,'closing')}
                    />
                  </Col>
                </Row>
              </TabPane>
            ))}
          </TabContent>
        </Col>
      </Row>
    );
  }
}

export default TimeSlots;
