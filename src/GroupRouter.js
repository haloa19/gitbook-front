import React, {Component} from 'react';
import { Route } from "react-router-dom";
import Header from './Header';
import Header2 from './Header2';
import NavigationGroup from './NavigationGroup';
import NavigationGroup2 from './NavigationGroup2';
import GroupSetting from './GroupSetting';
import GroupTimeLinePage from './GroupTimeLinePage';
import GroupMainCalendar from './GroupMainCalendar';
import GroupHeaderImg from './GroupHeaderImg';
import GroupRepositoryListPage from './GroupRepositoryListPage';
import GroupRepositoryWritePage from './GroupRepositoryWritePage';
import GroupRepositoryPage from './GroupRepositoryPage';
import GroupMemberList from './GroupMemberList';

{/*Group Navigation 사용하는 그룹 관련 페이지 - 그룹 타임라인, 그룹 관리*/}

class GroupRouter extends Component {
  constructor(){
    super(...arguments);
    this.state={
      groupInfo:'',
      reqList:'',
      joinList:'',
      memberchk:''
    }
  }
  

  // 탈퇴 시, navigation2 멤버목록 동기화
  changejoinList(joinlist) {
    this.setState({
      joinList: joinlist
    })
  }

  // 그룹 정보 수정 시, navigation 동기화
  changegroupInfo(groupTitle, groupIntro, imgurl, groupno){
    fetch(`${global.API_URL}/gitbook/group/infoupdate`, {
        method: 'post',
        headers: global.API_HEADERS,
        body: JSON.stringify({
          groupTitle: groupTitle,
          groupIntro: groupIntro,
          imgurl: imgurl,
          groupno: groupno,
          userno: sessionStorage.getItem("authUserNo")
        })
    })
    .then(response => response.json())
    .then( json => {
          this.setState({
            groupInfo: json.data
      });
    })
    .catch(err => console.log(err));    
  }

  render() {
    console.log("aaa " + this.state.memberchk);
    return (
      <div className="AppGroup">
       {/* <Header></Header> */}
       {/* <Header2 name="Group"></Header2> */}
        <section className="profile-two" style={{paddingTop:"100px", minHeight:"100vh"}}>
          {(this.state.memberchk === '' ? '': 
              this.state.memberchk === false ?              
              <div className="friend-wrapper">
                <div className="friend-box">
                  <i className="fas fa-cloud-showers-heavy fa-3x"></i>
                  <h4 className="friend-contents" style={{fontFamily: "'Nanum Gothic', sans-serif"}}>잘못된 접근!! <br/><br/>회원님이 속한 그룹이 아닙니다.</h4>
                </div>               
              </div> :
                    <div className="container-fluid">
                    <div className="row">
                      
                          <NavigationGroup 
                                key={this.props.match.params.groupno} 
                                groupno={this.props.match.params.groupno} 
                                userno={this.props.match.params.userno} 
                                groupinfo={this.state.groupInfo}></NavigationGroup>  {/** 네비게이션 */}
                        
                          {/** 두번째 섹션 */}
                          <div className="col-lg-6" style={{background: "#F4F4F4",marginTop:"1px"}}>             
                          <GroupHeaderImg groupinfo={this.state.groupInfo}></GroupHeaderImg>
        
                          <Route  path="/gitbook/group/:groupno?/:userno?" exact render={() => <GroupTimeLinePage 
                                                                                                  groupno={this.props.match.params.groupno}/>}/>
                          <Route  path="/gitbook/group/:groupno?/:userno?/setting" exact render={() => <GroupSetting 
                                                                                                          userno={this.props.match.params.userno}
                                                                                                          groupno={this.props.match.params.groupno}
                                                                                                          changeInfo={this.changegroupInfo.bind(this)}
                                                                                                          changeList={this.changejoinList.bind(this)}
                                                                                                          groupinfo={this.state.groupInfo}
                                                                                                        />}/>
                          <Route  path="/gitbook/group/:groupno?/:userno?/repository" exact render={() => <GroupRepositoryListPage
                                                                                                            id={this.props.match.params.userno}
                                                                                                            groupno={this.props.match.params.groupno}/>}/>
                          <Route  path="/gitbook/group/:groupno?/:userno?/repository/write" exact render={() => <GroupRepositoryWritePage
                                                                                                                  groupno={this.props.match.params.groupno}/>}/>
                
                          <Route  path="/gitbook/group/:groupno?/:userno?/:userid?/repository/view/:repoName?" exact component={GroupRepositoryPage}/>
        
        
                          <Route  path="/gitbook/group/:groupno?/:userno?/schedule" exact render={() => <GroupMainCalendar
                                                                                                         userno={this.props.match.params.userno}
                                                                                                         groupno={this.props.match.params.groupno}
                                                                                                         masterno={this.state.groupInfo.masterNo}
                                                                                                         />}/>
                          <Route path="/gitbook/group/:groupno?/:userno?/member" exact render={() => <GroupMemberList
                                                                                                        groupno={this.props.match.params.groupno}/>}/>                                                                              
        
                          </div>
                      
                          {/** 세번째 섹션 */}
                          <NavigationGroup2 
                          key={this.state.groupInfo}
                          joinlist={this.state.joinList} 
                          groupinfo={this.state.groupInfo}></NavigationGroup2>
        
                    </div>{/** row 종료 */}
                  </div>
          
          )}


          
        </section>{/** profile-twd 종료 */}
      </div>
    );
  }

  componentDidMount() {
    fetch(`${global.API_URL}/gitbook/group/info`, {
      method: 'post',
      headers: global.API_HEADERS,
      body: JSON.stringify({
          userno : this.props.match.params.userno,
          groupno: this.props.match.params.groupno
      })
    })
    .then( response => response.json())
    .then( json => {
        this.setState({
        groupInfo: json.data    
        });
    })
    .catch( err => console.error( err ));  

    fetch(`${global.API_URL}/gitbook/group/joinlist`, {
      method: 'post',
      headers:global.API_HEADERS,
      body: JSON.stringify({
          groupno: this.props.match.params.groupno
        })
    })
    .then( response => response.json())
    .then( json => {
        this.setState({
        joinList: json.data    
        });
    })
    .catch( err => console.error( err ));   

    fetch(`${global.API_URL}/gitbook/group/joinlist/check`, {
      method: 'post',
      headers:global.API_HEADERS,
      body: JSON.stringify({
          groupno: this.props.match.params.groupno
        })
    })
    .then( response => response.json())
    .then( json => {
        this.setState({
        memberchk: json.data    
        });
    })
    .catch( err => console.error( err ));   
  }
 }

export default GroupRouter;
