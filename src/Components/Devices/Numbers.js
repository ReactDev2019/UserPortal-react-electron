import React from 'react'
import './Numbers.css'
import './circle.css';
import i18n from '../Common/i18n';
import { parsePhoneNumber } from 'libphonenumber-js';

export class Numbers extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      callData: '',
      selected_num: ''
    });
    this.onChageNumber = this.onChageNumber.bind(this);
  }
  componentDidUpdate(preProps) {
    const today_data = this.props.today_data;
    const numbers = this.props.phone_num;
    if(today_data !== preProps.today_data) {
      let today_count, today_total, phoneNumber;
      let callData =[];
      numbers && numbers.map((element, index) => {
        if(element.length>4){
          phoneNumber = this.getPhoneNumber(element);
          today_count = 0;
          today_total = today_data.length;
          if(today_data.length === 0){
            today_total = 1;
          }
          today_data && today_data.map((value, index) => {
            if(element.includes(value.callee_id_number) || element.includes(value.caller_id_number))
              today_count++;
          })
          callData.push({ phoneNumber, today_count, today_total})
        }
        this.setState({callData:callData});
      })
      this.setState({selected_num: callData[0].phoneNumber?callData[0].phoneNumber:""})
    }
  }
  getPhoneNumber = (number) => {
    let phone_number = "";
    if(!number.includes("+")) {
      phone_number = "+" + phoneNumber;
    }
    phone_number = parsePhoneNumber(number)
    let phone_num = phone_number.formatInternational();
    let number_arr = phone_num.split(" ");
    var phoneNumber = number_arr[0]+" "+number_arr[1]+"-"+number_arr[2]+"-"+number_arr[3];
    return phoneNumber;
  }
  onChageNumber = (number) =>{
    this.setState({selected_num: number})
  }
  render () {
    let lng = this.props.lng;
    return (
      <div id='numbers' className="text-left missed-call-box">
        <div className="number-title">
          {i18n.t('numbers.label', { lng })}
        </div>
        <div className="row number-title-box">
          <div className="col-md-6">
            <span id='num' className="mr-3">{this.state.callData.length}</span>
            <span className="num-title">{i18n.t('total.label', { lng })}</span>
          </div>
          <div className="col-md-6">
              <div className="usage-today">{i18n.t('usage.label', { lng })+" "+i18n.t('today.label', { lng })}</div>
          </div>
        </div>
        <div className="border-div"></div>
        <div className="row number-graph">
          <div className="col-md-5">
            {this.state.callData.length>0 && this.state.callData.map((element, index) => {
              return(
                <div className={ element.phoneNumber === this.state.selected_num? 'selected-num':'unselected-num' } onClick={()=>this.onChageNumber(element.phoneNumber)} key={index}>
                  <div>{element.phoneNumber}</div>
                  <div className="ml-2"><img src="usa.png"/></div>
                </div>
                )
              })
            }
          </div>
          <div className="col-md-6 offset-md-1">
            {this.state.callData.length>0 && this.state.callData.map((element, index) => {
              if(element.phoneNumber === this.state.selected_num) {
                return (
                  <div key={index} className="row number-graph">
                    <div className="col-md-4 donut1">
                      <div className={`c100 p${Math.round((element.today_count * 100)/element.today_total)}`}>
                        <div className="slice">
                          <div className="bar"></div>
                          <div className="fill"></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-7 ml-3" >
                      <div>
                        <h1 className="mb-0">{Math.round(element.today_count*100/element.today_total)}%</h1>
                      </div>
                      <div>
                        <span className="grey">{element.today_count} {i18n.t('callcount.label', { lng })}</span>
                      </div>
                    </div>

                  </div>
                )}
              })
            }
          </div>
        </div>
        {/* <div className="view-all" onClick={()=>this.props.history.push("/devices")}>{i18n.t('viewall.label', { lng })}</div> */}
      </div>
    )
  }
}
