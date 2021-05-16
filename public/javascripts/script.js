

function hiding(a) {
	const idd = a.id.substring(10,a.id.length)
	console.log(idd);		
	var x = document.getElementById(`cmtlist${idd}`);
	x.style.display = "none";
	var r = document.getElementById(`hidebutton${idd}`);
	r.style.display = "none";
}

function showcmt(a) {
	const id = a.id
	
	var x = document.getElementById(`cmtlist${id}`);
    x.style.display = "table-row";
    var r = document.getElementById(`hidebutton${id}`);
    r.style.display = "table-column";
    var t = document.getElementById(`cmt${id}`);
    t.focus();
}


function changestate(id) {	
	
	var col = $(`#btnlike${id}`);
	let z = document.getElementById(`btnlike${id}`)
	
	if (col.css("background-color") === "rgb(255, 255, 255)"){
		z.style.background = "rgb(53, 120, 229)";
		z.style.color = "white";
		
	}
	
	else if (col.css("background-color") ==="rgb(53, 120, 229)"){
		z.style.background = "white";
		z.style.color = "black";
		
	}
}

// modal

function openModalpic() {
	var modal = document.getElementById("myModal");
	var span = document.getElementsByClassName("close")[0];
	modal.style.display = "block";
	span.onclick = function() {
  	modal.style.display = "none";
	}
	window.onclick = function(event) {
	  if (event.target == modal) {
	    modal.style.display = "none";
	  }
	}
}

function openModalvid() {
	var modal = document.getElementById("myModal");
	var span = document.getElementsByClassName("close")[0];
	modal.style.display = "block";
	span.onclick = function() {
  	modal.style.display = "none";
	}
	window.onclick = function(event) {
	  if (event.target == modal) {
	    modal.style.display = "none";
	  }
	}
	var t = document.getElementById("newurl");
    t.focus();
}
// endmodal

function newvidfromyoutube() {
	var modal = document.getElementById("myModal");
	modal.style.display = "none";
	var url = document.getElementById("newurl").value
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match&&match[7].length==11){
	    var b=match[7];
	    var show = document.getElementById("vid-in-postbox");
	    show.setAttribute('src',"https://www.youtube.com/embed/" + b)
	    show.style.display = "block";
	    document.getElementById("add-vid-btn").innerHTML = "Chọn video khác";

	}
	else if(url === ""){
		alert("Chưa nhập URL")
		var show = document.getElementById("vid-in-postbox");
		show.setAttribute('src',"")
		show.style.display = "none";
		document.getElementById("add-vid-btn").innerHTML = "+ Thêm video từ Youtube &nbsp;&nbsp; ▶";
	}
	else{
	    alert("URL không chính xác, hoặc video không còn tồn tại");
	    var show = document.getElementById("vid-in-postbox");
	    show.style.display = "none";
	}
}


function clearAlert() {
	$("#alert").hide()
}
$("#btn-savepass").click(event => {
	event.preventDefault()

	let password = $("#password").val()
	let repassword = $("#re-password").val()

	let message = ""
	if (password === "") {
		message = "Password không được để trống "
	} else if (repassword === "") {
		message = "Confirm password không được để trống "
	} else if (password.length < 6 || repassword.length < 6) {
		message = "Password phải từ 6 ký tự trở lên"
	} else if (password === repassword) {
		message = "Bạn đang nhập mật khẩu cũ"
	}

	if (message.length != 0) {

		$("#alert").html(message)
		$("#alert").show()
	} else {
		let data = {
			oldpass: password,
			newpass: repassword
		}
		fetch(`/auth/change/password`, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				}
			})
			.then(response => {
				return response.json()
			})
			.then(result => {
				console.log('Success:', result);
				if (result.code === 0) {
					window.location.href = "/post"
				} else {
					$("#alert").html(result.message)
					$("#alert").show()
				}

			})
			.catch(error => {
				console.error('Error:', error);
			})

	}





})

$(".noti-btn-del").click(e=>{
	e.preventDefault()
	var r = confirm("Bạn có chắc muốn xóa post này?");
	if (r == true) {
		const notiId = e.currentTarget.dataset.id1
		const userId = e.currentTarget.dataset.id2
		const data = {
			userId:userId
		}
		fetch(`/noti/del/${notiId}`, {
			method: "DELETE",
			body: JSON.stringify(data),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		})
		.then(response => {
			return response.json()
		})
		.then(result => {
			if (result.code === 0) {
				console.log(result);
				$(`div#new${notiId}`).hide("slow", function() { $(this).remove(); })
			} else {
				throw Error("Remove Fail")
			}
		})
		.catch(error => {
			console.error('Error:', error);
		})

	}
})
  
    
$(".noti-btn-edit").click(e=>{
	$("#noti-id01").show()
	const notiId = e.currentTarget.dataset.id1
	const userId = e.currentTarget.dataset.id2
	let title = $(`#title${notiId}`).html()
	let content = $(`#content${notiId}`).html()

	$("textarea#editnoti-title").val(title)
	$("textarea#editnoti-content").val(content)

	$("#btn-save-noti").attr("data-id1",notiId)
	$("#btn-save-noti").attr("data-id2",userId)
})

$("#btn-save-noti").click(e=>{
	const notiId = e.target.dataset.id1
	const userId = e.target.dataset.id2
	const title = $("textarea#editnoti-title").val()
	const content = $("textarea#editnoti-content").val()
	let data = {
		userId,
		title,content
	}
	fetch(`/noti/update/${notiId}`, {
		method: "PUT",
		body: JSON.stringify(data),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	})
	.then(response => {
		return response.json()
	})
	.then(result => {
		if (result.code === 0) {
			$(`#title${notiId}`).html(title)
			$(`#content${notiId}`).html(content)
			$("#noti-id01").hide()
			
		} else {
			throw Error("Remove Fail")
		}
	})
	.catch(error => {
		console.error('Error:', error);
	}) 
})

$('#submit').click(function(event) {
	event.preventDefault();
	const mssv = $("#submit").attr("data-mssv")
	
	let data = {
		name: $("#name").val(),
		khoa: $("#khoa").val(),
		lop: $("#class").val() || ""
	}
	fetch(`/auth/update/student/${mssv}`, {
			method: "PUT",
			body: JSON.stringify(data),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		})
		.then(response => {
			return response.json()
		})
		.then(result => {
			console.log('Success:', result);
			if (result.code === 0) {
				window.location.href = "/auth/y"
			}

		})
		.catch(error => {
			console.error('Error:', error);
		})


});

$("#btn").click(event => {
	event.preventDefault()
	let username = $("#username").val()
	let password = $("#password").val()
	let repassword = $("#re-password").val()
	let pb = $("#department").val()
	let message = ""
	if (username === "") {
		message = "Username không được để trống "
	} else if (password === "") {
		message = "Password không được để trống "
	} else if (password.length < 6) {
		message = "Password phải từ 6 ký tự trở lên"
	} else if (repassword === "") {
		message = "Confirm password không được để trống "
	} else if (password !== repassword) {
		message = "Password không trùng khớp"
	}

	if (message.length != 0) {

		$("#alert").html(message)
		$("#alert").show()
	} else {
		let data = {
			username: username,
			password: password,
			pb: pb
		}
		fetch(`/auth/register`, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				}
			})
			.then(response => {
				return response.json()
			})
			.then(result => {
				console.log('Success:', result);
				if (result.code === 0) {
					window.location.href = "/auth/quanly"
				} else {
					$("#alert").html(result.message)
					$("#alert").show()
				}

			})
			.catch(error => {
				console.error('Error:', error);
			})

	}
})

$(".post-button-new").click(e=>{
	const userId = e.currentTarget.id
	const title = $("#title").val()
	const content = $("#content").val()
	const data = {userId,title,content}
	console.log(data);
	fetch(`/noti`, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				}
			})
			.then(response => {
				return response.json()
			})
			.then(result => {
				
				if (result.code === 0) {
					console.log(result);
					const time = new Date(result.data.createdAt)
					let date = time.getDate()
					let month = time.getMonth() + 1
					let year = time.getUTCFullYear()
					$("#title").val("")
					$("#content").val("")
					alert("Đăng thông báo thành công")
					$("#new").prepend(`
					<div class="single-new">
						<table>
							<tr class="byandtime">
								<td>
									[${result.data.username}]
								</td>
								<td>
									- ${date}/${month}/${year}
								</td>
							</tr>
							<tr>
								<td class="title-new" colspan="2">
									${result.data.title}
								</td>
							</tr>
							<tr>
								<td class="more-ab-new" colspan="2">
									<a id="${result.data._id}"  href="/noti/pb/${result.data._id}" >Sinh viên xem chi tiết thông báo</a>
								</td>
							</tr>
						</table>
					</div>
					`)
				}
				
				else {
					throw Error("Remove Fail")
				}
			})
			.catch(error => {
				console.error('Error:', error);
			})
	
})
$("#btn-post").click(e => {
	e.preventDefault()
	
	const id = $("#btn-post").data().id
	const desc = $("textarea#newpost").val()
	const linkvideo = $("#vid-in-postbox").attr("src")
	let video = undefined
	if(linkvideo !== ""){
		video = linkvideo
	}

	let data = {
		userId: id,
		desc: desc,
		video
	}

	fetch(`/post`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		})
		.then(response => {
			return response.json()
		})
		.then(result => {
			console.log('Success:', result);
			const time = new Date(result.data.createdAt)
			let date = time.getDate()
			let month = time.getMonth() + 1
			let year = time.getUTCFullYear()
			let hour = time.getHours()
			let minu = time.getMinutes()

			
			if (result.code === 0) {
				if(video){
					$(".newfeed").prepend(`
				<div class="newpost" id="${result.data._id}">
					<table class="singlepost">

	<tr class="title">

	<td rowspan="2" class="avt-feed">
	<img class="avt-feed-mini" src="${result.img}">
	</td>

	<td class="username-feed"><b>${result.name}</b></td>

	<!-- Chỉnh sửa hoặc xóa bài viết -->
	<td rowspan="2" class="delet">
	<a class="btn-edit" href="#" data-id1="${result.data._id}" data-id2="${result.data.userId}"><i class="fa fa-edit"></i></a> &nbsp;&nbsp;
	<a class="btn-del" href="#" data-id1="${result.data._id}" data-id2="${result.data.userId}"><i class="fa fa-trash-o"></i></a>
	</td>
	<!-- Chỉnh sửa hoặc xóa bài viết -->
	</tr>

	<tr>
	<td class="time-feed">
	${date}-${month}-${year} , ${hour}:${minu}
	</td>
	</tr>

	<tr>
	<td colspan="3" class="cap-feed"><pre id="desc${result.data._id}">${result.data.desc}</pre></td>
	</tr>
	<tr>
		<td colspan="2" class="feed-img">
		<iframe class="img-from-feed" width="1463" height="600" src="${result.data.video}?autoplay=0&mute=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
		</td>
	</tr>

	<tr>
	<td colspan="3">
	<table style="width: 100%">
		<td class="feed-but">
			<button id="btnlike${result.data._id}" data-userid="${result.data.userId}" class="feed-button-like" ><b>❤ Thích</b></button>
		</td>
		<td>
			<button class="feed-button-cmt" id="${result.data._id}" onclick="showcmt(this)"><b>🗨 Bình luận</b></button>
		</td>
	</table>
	</td>
	</tr>

	<tr class="cmt-count">
	<td colspan="3">
	<table style="width: 100%">
		<td class="feed-sta">
			<div class="like-count-num">
				<span id="count-like"><span id = "count${result.data._id}">${result.data.like.length}</span></span>
				<span>Like</span>
				<br>
				<span><span id="count-cmt${result.data._id}">${result.data.cmt.length}</span> Comments</span>
			</div>
		</td>

		<td>
			<button class="hide-cmt" id="hidebutton${result.data._id}" onclick="hiding(this)">Không hiện bình luận</button>
		</td>
	</table>
	</td>
	</tr>

	<tr class="allcmt" id="cmtlist${result.data._id}">
	<td colspan="3" class="cmt-feed">
	<div class="all-comment" id="all-comment${result.data._id}">
	</div>
	</td>
	</tr>

	<tr class="cmtbox">
	<td>
	<img class="avt-post-mini" src="${result.img}">
	</td>
	<td>
	<input type="text" class="cmtbox-feed" id="cmt${result.data._id}" name="Newpost" placeholder="Viết bình luận...">
	</td>
	<td>
	<button class="send-cmt" data-id1="${result.data._id}" data-id2="${result.data.userId}" data-id3="${result.data.userimg}" data-id4="${result.data.name}"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
	</td>
	</tr>

	</table>
								</div>
				`)
				}
				else{
					$(".newfeed").prepend(`
				<div class="newpost" id="${result.data._id}">
					<table class="singlepost">

	<tr class="title">

	<td rowspan="2" class="avt-feed">
	<img class="avt-feed-mini" src="${result.img}">
	</td>

	<td class="username-feed"><b>${result.name}</b></td>

	<!-- Chỉnh sửa hoặc xóa bài viết -->
	<td rowspan="2" class="delet">
	<a class="btn-edit" href="#" data-id1="${result.data._id}" data-id2="${result.data.userId}"><i class="fa fa-edit"></i></a> &nbsp;&nbsp;
	<a class="btn-del" href="#" data-id1="${result.data._id}" data-id2="${result.data.userId}"><i class="fa fa-trash-o"></i></a>
	</td>
	<!-- Chỉnh sửa hoặc xóa bài viết -->
	</tr>

	<tr>
	<td class="time-feed">
	${date}-${month}-${year} , ${hour}:${minu}
	</td>
	</tr>

	<tr>
	<td colspan="3" class="cap-feed"><pre id="desc${result.data._id}">${result.data.desc}</pre></td>
	</tr>
	

	<tr>
	<td colspan="3">
	<table style="width: 100%">
		<td class="feed-but">
			<button id="btnlike${result.data._id}" data-userid="${result.data.userId}" class="feed-button-like" ><b>❤ Thích</b></button>
		</td>
		<td>
			<button class="feed-button-cmt" id="${result.data._id}" onclick="showcmt(this)"><b>🗨 Bình luận</b></button>
		</td>
	</table>
	</td>
	</tr>

	<tr class="cmt-count">
	<td colspan="3">
	<table style="width: 100%">
		<td class="feed-sta">
			<div class="like-count-num">
				<span id="count-like"><span id = "count${result.data._id}">${result.data.like.length}</span></span>
				<span>Like</span>
				<br>
				<span><span id="count-cmt${result.data._id}">${result.data.cmt.length}</span> Comments</span>
			</div>
		</td>

		<td>
			<button class="hide-cmt" id="hidebutton${result.data._id}" onclick="hiding(this)">Không hiện bình luận</button>
		</td>
	</table>
	</td>
	</tr>

	<tr class="allcmt" id="cmtlist${result.data._id}">
	<td colspan="3" class="cmt-feed">
	<div class="all-comment" id="all-comment${result.data._id}">
	</div>
	</td>
	</tr>

	<tr class="cmtbox">
	<td>
	<img class="avt-post-mini" src="${result.img}">
	</td>
	<td>
	<input type="text" class="cmtbox-feed" id="cmt${result.data._id}" name="Newpost" placeholder="Viết bình luận...">
	</td>
	<td>
	<button class="send-cmt" data-id1="${result.data._id}" data-id2="${result.data.userId}" data-id3="${result.data.userimg}" data-id4="${result.data.name}"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
	</td>
	</tr>

	</table>
								</div>
				`)
				}
				var show = document.getElementById("vid-in-postbox");
	    		show.setAttribute('src',"")
	    		show.style.display = "none";
				$("textarea#newpost").val("")
			}

		})
		.catch(error => {
			console.error('Error:', error);
		})




})
$("div.newfeed").on("click","a.btn-del",e=>{
	e.preventDefault()

	var r = confirm("Bạn có chắc muốn xóa post này?");
	if (r == true) {
		const postId = e.target.parentElement.dataset.id1
		const userId = e.target.parentElement.dataset.id2
		const data = {
			userId:userId
		}
		fetch(`/post/delete/${postId}`, {
				method: "DELETE",
				body: JSON.stringify(data),
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				}
			})
			.then(response => {
				return response.json()
			})
			.then(result => {
				if (result.code === 0) {
				
					$(`div#${postId}`).hide("slow", function() { $(this).remove(); })
				} else {
					throw Error("Remove Fail")
				}
			})
			.catch(error => {
				console.error('Error:', error);
			})

	} 
	
})
$("div.newfeed").on("click","a.btn-edit",e=>{ 

	$("div#id01").show()
	const postId = e.target.parentElement.dataset.id1
	const userId = e.target.parentElement.dataset.id2
	let desc = $(`pre#desc${postId}`).html()
	$("textarea#editpost").val(desc)
	$("#btn-save").attr("data-id1",postId)
	$("#btn-save").attr("data-id2",userId)
})  
$(document).on("click","#btn-save",e=>{ 
	const postId = e.target.dataset.id1
	const userId = e.target.dataset.id2
	const desc = $("textarea#editpost").val()
	let data = {
		userId,
		desc
	}
	
	fetch(`/post/${postId}`, {
				method: "PUT",
				body: JSON.stringify(data),
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				}
			})
			.then(response => {
				return response.json()
			})
			.then(result => {
				if (result.code === 0) {
					$(`pre#desc${postId}`).html(desc)
					$("div#id01").hide()
					
				} else {
					throw Error("Remove Fail")
				}
			})
			.catch(error => {
				console.error('Error:', error);
			}) 
})
$(document).on("click",".feed-button-like",e=>{
	let btnlike = $(`btnlike${e.currentTarget.id}`)
	const postId = e.currentTarget.id.substring(7,e.currentTarget.id.length)
	const userId = e.currentTarget.dataset.userid
	
	let data = {userId}
	fetch(`/post/${postId}/like`, {
				method: "PUT",
				body: JSON.stringify(data),
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				}
			})
			.then(response => {
				return response.json()
			})
			.then(result => {
				console.log(result);
				if (result.code === 0) {
					changestate(postId)
					let count = parseInt($(`#count${postId}`).html()) + 1
					
					$(`#count${postId}`).text(`${count}`)
				}
				else if (result.code === 1) {
					changestate(postId)
					let count = parseInt($(`#count${postId}`).html()) - 1 
					
					$(`#count${postId}`).text(`${count}`)
				}
				else {
					throw Error("Remove Fail")
				}
			})
			.catch(error => {
				console.error('Error:', error);
			})
	
})
$(document).on("click",".send-cmt",e=>{
	
	const postId = e.currentTarget.dataset.id1
	const userId = e.currentTarget.dataset.id2
	const userimg = e.currentTarget.dataset.id3
	const username = e.currentTarget.dataset.id4
	const desc_cmt = $(`input#cmt${postId}`).val()
	
	let data = {userId,userimg,username,desc_cmt}
	
	fetch(`/post/${postId}/cmt`, {
				method: "PUT",
				body: JSON.stringify(data),
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				}
			})
			.then(response => {
				return response.json()
			})
			.then(result => {
				
				if (result.code === 0) {
				   
					$(`input#cmt${postId}`).val("")
					let count = parseInt($(`#count-cmt${postId}`).html())+1
					$(`#count-cmt${postId}`).text(`${count}`)
					$(`#all-comment${postId}`).append(`
					<div class="singlecmt" id="singlecmt${result.data}">
									<table>
										<tr class="title">
											<td rowspan="2" class="avt-feed">
												<img class="avt-feed-mini" src="${userimg}">
											</td>

											<td class="username-cmt"><b>${username}</b></td>
											<td rowspan="2" class="avt-feed">
												<span><i class="btndelcmt fa fa-trash-o" id="btndelcmt${postId}" data-id1="${result.data}"></i></span>
											</td>
										</tr>

										<tr>
											<td class="comment-cmt">${desc_cmt}</td>
										</tr>
									</table>
								</div>
					`)
				}
				
				else {
					throw Error("Remove Fail")
				}
			})
			.catch(error => {
				console.error('Error:', error);
			})
   
})
$(document).on("click",".btndelcmt",e=>{
	e.preventDefault()
	console.log(e.currentTarget);
	var r = confirm("Bạn có chắc muốn xóa comment này?");
	if (r == true) {
		const idpost = e.currentTarget.id.substring(9,e.currentTarget.id.length)
		const idcmt = e.currentTarget.dataset.id1
		fetch(`/post/${idpost}/delcmt/${idcmt}`, {
				method: "DELETE",
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				}
			})
			.then(response => {
				return response.json()
			})
			.then(result => {
				if (result.code === 0) {
					console.log(result);
					$(`div#singlecmt${idcmt}`).hide("slow", function() { $(this).remove(); })
					let count = parseInt($(`#count-cmt${idpost}`).html())-1
					$(`#count-cmt${idpost}`).text(`${count}`)
				} else {
					throw Error("Remove Fail")
				}
			})
			.catch(error => {
				console.error('Error:', error);
			})

	} 
	
	
})

$(".btn-delete").click(e=>{
	e.preventDefault()
	const pb = e.currentTarget.dataset.pb
	const id = e.currentTarget.dataset.id
	console.log(pb,id);
	let r = confirm(`Bạn có chắc muốn xóa ${pb} không?`);
  	if (r == true) {
		fetch(`/auth/delete/${id}`, {
			method: "DELETE",
		})
		.then(response => {
			return response.json()
		})
		.then(result => {
			if (result.code === 0) {
				/* $(`tr#${id}`).remove() */
				$(`div#pb${id}`).hide("slow", function() { $(this).remove(); })
			} else {
				throw Error("Remove Fail")
			}
		})
		.catch(error => {
			console.error('Error:', error);
		})
  	}
})




