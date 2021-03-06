import React, {Component} from 'react';
import './Fluffs/assets/css/demos/group.css';
import {Link} from "react-router-dom";


const API_HEADERS2 = {
  'Content-Type': 'multipart/form-data; charset=UTF-8'
}
class GroupSettingInfo extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      groupinfo:'',
      groupTitle: '',
      groupIntro:'',
      image:'',
      file: null,
      previewURL: '',
      visible:{
          basic : '',
          nobasic : '' 
      },
      imgurl:'',
      title:''
    }
  }

  handleChange=(e)=>{
    this.setState({
        [e.target.name]: e.target.value
    });
  }

  clickHandlerDelete(e) {
    this.setState({
        previewURL: ''

    })

  }

  handleRadio=(event)=>{
    let obj = {}
    obj[event.target.value] = event.target.checked 
  
    this.setState({
        visible: obj,
        previewURL: event.target.value === "basic" ? '/gitbook/assets/img/bg/basic.jpg' : '',
    });
  } 

  onResult() {
    this.props.changeInfo(this.state.groupTitle, this.state.groupIntro, this.state.imgurl, this.state.groupinfo.no)
  }

  imageChange(event) {
  
    let reader = new FileReader();
    let file = event.target.files[0];
   

    let formData = new FormData();
    formData.append('file', file);
    fetch(`${global.API_URL}/gitbook/group/imgupload`, {
        method: 'post',
        headers: {
            API_HEADERS2
        },
        body: formData
    })
    .then(response => response.json())
    .then( json => {
      const check=json.data.split('.').pop()
      if(check=="png"|| check=="jpg"|| check=="gif"||check=="jpeg" ||check=="PNG"){
          this.setState({
              imgurl: json.data
          })
      } else {
          this.setState({
              previewURL:""
          })
      }
    })
    .catch(err => console.log(err));

    reader.onloadend = () => {
        this.setState({
            file: file,
            previewURL: reader.result
        })
    }
    reader.readAsDataURL(file);
  
  } 

  render() {
  
    return (
      <div className="group-req-setting" style={{borderRadius:"0px 0px 20px 20px"}}>
        
      <p><h4 className="group-req-title"><b>정보 수정</b></h4></p>
      <hr></hr>
      <div className="group-box">
      
      <div className="suggestions-list">
      <form>
        <h4 style={{ fontFamily: " 'Abhaya Libre' serif" }}>그룹 이름</h4>

        <input type="text" 
               className="form-control" 
               maxLength="30"
               name="groupTitle"
               value={this.state.groupTitle} 
               onChange={this.handleChange.bind(this)}
               style={{width:"40%",display:"inline",paddingRight:"40px"}}/>
              {
                (this.state.groupTitle.trim() != '') ? 
                  ((this.state.groupTitle.trim() != this.state.groupinfo.groupTitle.trim()) ? 
                    (this.state.grouplist && this.state.grouplist.some((list)=> list.groupTitle.trim() == this.state.groupTitle.trim() ) ?
                    <i className="fas fa-exclamation-triangle" style={{ marginLeft: "-25px", color: "red" }} />
                    : <i className="fas fa-check" style={{ marginLeft: "-25px", color: "green" ,display:"inline-block"}} />)
                  : <i className="fas fa-check" style={{ marginLeft: "-25px", color: "green" ,display:"inline-block"}} />) 
                : <i className="fas fa-exclamation-triangle" style={{ marginLeft: "-25px", color: "red" }} />
              }
  
        <br/>
        <br/>

        <h4 style={{ fontFamily: " 'Abhaya Libre' serif" }}>그룹 인사말 ({this.state.groupIntro.length}/100)</h4>
        <textarea className="form-control no-border" 
                  rows="3" 
                  name="groupIntro"
                  value={this.state.groupIntro}
                  maxLength="99"
                  onChange={this.handleChange.bind(this)}
                  />
        <br/>
        <br/>
      
        <h4 style={{ fontFamily:"'Nanum Gothic', sans-serif" }}>그룹 이미지</h4> 
        <div className="row" style={{marginLeft:"0px", width: "90%"}}>
          <div style={{float:"left", width:"40%"}}>  
          <input 
              type="radio" 
              name="visible" 
              value="basic" 
              checked={this.state.visible['basic']} 
              onChange={this.handleRadio.bind(this)} />
          <label style={{ fontFamily:"'Nanum Gothic', sans-serif" }}>&nbsp;기본 타이틀 이미지 (default)</label>
          <br></br>
          <input 
              type="radio" 
              name="visible" 
              value="nobasic"
              checked={this.state.visible['nobasic']} 
              onChange={this.handleRadio.bind(this)} />
          <label style={{ fontFamily:"'Nanum Gothic', sans-serif" }}>&nbsp;이미지 첨부 (jpg, jpeg, png, bmp)</label>    
          </div>
          <div style={{float:"left", width:"50%"}}>     
          {this.state.visible['nobasic'] === true ? 
            this.state.previewURL < 2 ? 
            <div className="imageFileDiv" style={{ width: "470px", height: "170px", marginTop:"0px"}}>
              <label style={{marginLeft:"35%"}}>
                <input type="file" accept="image/gif,image/jpeg,image/png,image/jpg" onChange={this.imageChange.bind(this)} style={{display: "none"}}/> 
                <i className="fa fa-camera text-muted fa-4x" id="custom" />
              </label>
            </div> : <div className="div2">
                        <i className="fas fa-backspace fa-2x" onClick={this.clickHandlerDelete.bind(this)} />
                        <div className="imageFileDiv" style={{ width: "470px", height: "170px", marginTop:"0px"}}>
                        <label>
                          <img src={this.state.previewURL} style={{width: "450px", height: "150px", borderRadius: '10px', display: "block" }}></img>
                        </label>
                        </div>
                      </div>
            : <div>
                <div className="imageFileDiv" style={{ width: "470px", height: "170px", marginTop:"0px"}}>
                  <label>
                   <img src={this.state.previewURL} style={{width: "450px", height: "150px", borderRadius: '10px', display: "block" }}></img>
                  </label>
                </div>
              </div>
          }
          </div>
        </div>
        {
          (this.state.groupTitle.trim() !== '') ? 
            ((this.state.groupTitle.trim() !== this.state.groupinfo.groupTitle.trim()) ? 
              (this.state.grouplist && this.state.grouplist.some((list)=> list.groupTitle.trim() === this.state.groupTitle.trim() ) ?
              <button 
                type="submit" 
                className="kafe-btn kafe-btn-mint-small" 
                disabled="true"
                style={{ float: "right ", margin: "10px", width: "70px" ,backgroundColor:"red" }}
                >등록 불가</button>
              : <Link to={`/gitbook/group/${this.state.groupinfo.no}/${sessionStorage.getItem("authUserNo")}`}>
              <button 
                  type="submit" 
                  className="kafe-btn kafe-btn-mint-small"                                
                  style={{ float: "right ", margin: "10px", width: "60px" }}
                  onClick={this.onResult.bind(this)}
                  >업데이트</button></Link>)
            : <Link to={`/gitbook/group/${this.state.groupinfo.no}/${sessionStorage.getItem("authUserNo")}`}>
              <button 
                type="submit" 
                className="kafe-btn kafe-btn-mint-small"                                
                style={{ float: "right ", margin: "10px", width: "60px" }}
                onClick={this.onResult.bind(this)}
                >업데이트</button></Link>) 
          : <button 
              type="submit" 
              className="kafe-btn kafe-btn-mint-small" 
              disabled="true"
              style={{ float: "right ", margin: "10px", width: "70px" ,backgroundColor:"red" }}
              >등록 불가</button>
        }
        </form>
      </div>
      </div>
    </div>
    );
  }

  componentDidMount() {
    fetch(`${global.API_URL}/gitbook/group/info`, {
      method: 'post',
      headers: global.API_HEADERS,
      body: JSON.stringify({
          userno : this.props.userno,
          groupno: this.props.groupno
      })
    })
    .then( response => response.json())
    .then( json => {
        this.setState({
          groupinfo: json.data,
          groupTitle: json.data.groupTitle,
          groupIntro: json.data.groupIntro,
          previewURL: json.data.image,
          visible:{
            basic : json.data.image == '/gitbook/assets/img/bg/basic.jpg' ? true : false,
            nobasic : json.data.image != '/gitbook/assets/img/bg/basic.jpg' ? true : false 
          },
          imgurl: json.data.image
        });
    })
    .catch( err => console.error( err ));  

    fetch(`${global.API_URL}/gitbook/group/list`, {
      method: 'get',
      headers: global.API_HEADERS
    })
      .then(response => response.json())
      .then(json => {
        this.setState({
          grouplist: json.data
        });
      })
      .catch(err => console.error(err));

  }

}

export default GroupSettingInfo;
