import React, { Component } from "react";


let viewed = {};

export default class ProfileSection extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			edit_switch: false,
			editables: {
				ProfileNo: "",
				image: "",
				nickname: "",
				profileContents: "",
			},
			file_image: null,
		};
		this.loadProfile();
	}

	loadProfile = () => {
		fetch(`${global.API_URL}/gitbook/user/profile/info/${this.props.userid}`, {
			method: "post",
			headers: global.API_HEADERS,
			body: null,
		})
			.then((response) => response.json())
			.then((json) => {
				viewed = JSON.parse(JSON.stringify(json.data));
				this.setState({
					editables: json.data,
				});
			})
			.catch((err) => console.error(err));
	};

	updateProfile = () => {
		if(this.state.editables.nickname === '' || this.state.editables.nickname.length < 2 || this.state.editables.nickname.length > 10){
			alert("닉네임을 2자 ~ 10자 이내로 입력하세요.");
			return;
		}
		if(this.state.editables.profileContents.length > 40 || this.state.editables.profileContents.trim().length < 1){
			alert("프로파일 소개글을 40자 이내로 입력하세요.");
			return;
		}

		fetch(`${global.API_URL}/gitbook/user/profile/update/${this.props.userid}`, {
			method: "post",
			headers: global.API_HEADERS,
			body: JSON.stringify(this.state.editables),
		})
			.then((response) => response.json())
			.then((json) => {
				if (json.result === "success") {alert("프로필 수정을 성공했습니다.");
					window.location.reload(true);
				} else {
				
					alert("프로필 수정 실패...");
				}
			})
			.catch((err) => console.error(err));
	};

	onStatusChange = (event) => {
		let name = event.target.name;
		let newEditables = this.state.editables;
		newEditables[name] = event.target.value;
		
		this.setState({
			editables: newEditables,
		});
	};

	onToggleButtonChanged = (event) => {
		this.setState({
			edit_switch: !this.state.edit_switch,
		});
	};

	onFileChange = (event) => {
		event.preventDefault();
		let reader = new FileReader();
		let file_image_upload = event.target.files[0];
		
		
		if(['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].includes(file_image_upload.type) === false){
			alert("이미지 파일만 올려주세요!");
			reader.abort();
			return;
		}

		reader.onload = () => {
			let formData = new FormData();
			formData.append("newImage", file_image_upload);

			fetch(`${global.API_URL}/gitbook/user/profile/uploadImage/${this.props.userid}`, {
				method: "post",
				body: formData,
			})
				.then((response) => response.json())
				.then((json) => {
					if (json.result === "success") {
						let newEditables = this.state.editables;
						newEditables.image = json.data;
						this.setState({
							file_image: file_image_upload,
							editables: newEditables,
						});
					} else {
					
						alert("이미지 업로드 실패...");
					}
				})
				.catch((err) => console.error(err));
		};
		reader.readAsDataURL(file_image_upload);
	};

	render() {
		return (
			<aside id="leftsidebar" className="sidebar" style={{width: '400px'}}>
				<ul className="list">
					<li>
						<div className="user-info">
							<br />
							<br />
							<a>
								<div className="image">
									<img className="img-responsive img-circle" src={this.state.file_image !== "" ? this.state.editables.image : global.API_URL + viewed.image} alt="User" style={{width: "200px", height: "200px"}}/>
									<span className="online-status online"></span>
								</div>
							</a>
							<br />
							<br />
							<div className="detail">
								<h4 style={{fontFamily: "'Nanum Gothic', sans-serif" }}>{sessionStorage.getItem("authUserName")}</h4>
								<small style={{fontFamily: "'Nanum Gothic', sans-serif" }}>{this.props.userid}</small>
							</div>

							<h4 style={{ color: "black", fontFamily: "'Nanum Gothic', sans-serif" }}> 프로필 수정하기 </h4>
							<label className="switch">
								<input type="checkbox" onChange={this.onToggleButtonChanged.bind(this)} />
								<span className="slider round" />
							</label>
						</div>
					</li>
					<li>
						{this.state.edit_switch ? (
							<>
								<small className="text-muted" style={{fontFamily: "'Nanum Gothic', sans-serif" }}>Change Image</small>
								<p />
								<input type="file" accept="image/jpg, image/jpeg, impge/png, image/gif, .jpg, .jpeg, .png, .gif" name="file_image" onChange={this.onFileChange.bind(this)} style={{ color: "black" }} />
								<hr />
							</>
						) : (
							<></>
						)}

						<small className="text-muted" style={{fontFamily: "'Nanum Gothic', sans-serif" }}>Nickname</small>
						<p />
						{this.state.edit_switch ? (
							<input name="nickname" type="text" className="form-control-join-email" placeholder="닉네임" style={{ color: "black" }} value={this.state.editables.nickname} onChange={this.onStatusChange.bind(this)} />
						) : (
							<p style={{fontFamily: "'Nanum Gothic', sans-serif" }}>{viewed.nickname}</p>
						)}
						<hr />


						{this.state.edit_switch ? (
							<>
							<small className="text-muted" style={{fontFamily: "'Nanum Gothic', sans-serif" }}>Introduction ({this.state.editables.profileContents.length}/40)</small>
							<p />
							<textarea name="profileContents" rows="4" cols="40" maxLength="39" style={{ color: "black", resize: "none" }} value={this.state.editables.profileContents} onChange={this.onStatusChange.bind(this)} />
							</>
						) : (
							<>
							<small className="text-muted" style={{fontFamily: "'Nanum Gothic', sans-serif" }}>Introduction</small>
							<p />
							<p style={{fontFamily: "'Nanum Gothic', sans-serif" }}>
								{viewed.profileContents && viewed.profileContents.split(/\n/g).map((word)=>
								<div>
									{
										word.split(" ").map(nbsp=><div style={{display:"inline"}}>{nbsp}&nbsp;</div>)
									}
								</div>
								)}
							</p>
							</>
						)}

						<hr />
						{this.state.edit_switch ? (
							<button className="kafe-btn kafe-btn-mint form-group-join-btn" onClick={this.updateProfile.bind(this)} style={{marginBottom:"30px"}}>
								수정
							</button>
						) : (
							<br />
						)}
							<br />
					</li>
				</ul>
			</aside>
		);
	}
}