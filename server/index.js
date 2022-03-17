const express = require("express");
const app = express();
const body = require("body-parser");
const cors = require("cors");

app.use(body.urlencoded({ extended: false }));
const Database = require("./database");
const db = new Database();
app.use(body.json());
app.use(cors());

//API chỉnh sửa thông tin người dùng theo UserID
app.post("/editUserInfo", async function (req, res) {
  try {
    let body = req.body;
    await db.editUserInfo(body);
    res.send("cập nhật thông tin thành công");
  } catch (error) {
    res.send(error.toString());
  }
});

// Lấy dữ liệu người dùng vào TrangProfile thông qua firebase authentication
// và API get UserInfo
app.get("/getUserInfo", async function (req, res) {
  try {
    let body = req.body;
    let result=await db.getUserInfo(body);
    res.send(result);
  } catch (error) {
    res.send(error.toString());
  }
});


// API tạo người dùng. Không tạo mới nếu người dùng tồn tại trong hệ thống
<<<<<<< HEAD
// app.post("/createUser", async (req, res) => {
//   try {
//     let body = req.body;
//     await db.editUserInfo(body);
//     res.send("cập nhật thông tin thành công");
//   } catch (error) {
//     res.send(error.toString());
//   }
// });
=======
app.post("/createUser", async (req, res) => {
  try {

    let body = req.body;
    await db.addNewUser(body);
    res.send("Tạo người dùng thành công");
  } catch (error) {
    res.send(error.toString());
  }
});
>>>>>>> c52b4ca1103fa1e9d94ccd842b94fd9262d63dbd

// API lấy ra danh sách streamer mà người dùng theo dõi
// app.get("/getStreamer", async function (req, res) {
//   try{
//   let body = req.body;
//   let listStreamer;
//   let streamerFollow = await firestore.collection("UserInfo").doc(body.docID).get().then(doc => {
//     listStreamer=doc.data().Subcribe;
//     });
//   res.send(listStreamer);
//   }catch(err){
//     res.send(err.toString());
//   }
// });

// API tạo stream. Sau khi tạo cập nhật biến IsStreaming=true của người dùng có Id trùng với hostID
app.post("/createStream", async (req, res) => {
  try {
    let body = req.body;
    let result = await db.createStream(body.data).then((data)=>{
     res.send(data)
    });

  } catch (error) {
    res.send(error.toString());
  }
});

app.delete("/endStream", async (req, res) => {
  try {
    let body = req.body;
    await db.endStream(body.data);
    res.send("Tắt stream thành công");
  } catch (error) {
    res.send(error.toString());
  }
});

app.post("/addChat", async (req, res) => {
  try {
    let body = req.body;
    let result = await db.addChat(body.data);
    res.send("Chat thành công");
  } catch (err) {
    res.send(error.toString());
  }
})

// API tắt stream. Xóa document , cập nhật biên IsStreaming=false của người dùng có Id trùng với hostID
// app.delete("/deleteStream", async (req, res) => {
//   try{
//   let body = req.body;
//   let checkUser= await firestore.collection("Streams").doc(body.docId).get();
//   let StreamID=checkUser.data().HostID;
//   await firestore.collection("Streams").doc(body.docId).delete();
//   let findUser = await firestore.collection("Users").doc(StreamID)
//   .update({"isStreaming":false})
//   // console.log(checkUser)
//   res.send("xóa stream thành công");
// }catch(error){
//     res.send(error.toString());}
// });

// API Subcribe.
app.post("/createSubcribe", async (req, res) => {
    try {
      let body = req.body;
      await db.createSubcribe(body);
      res.send("theo dõi thành công");
    } catch (error) {
      res.send(error.toString());
    }
  });


// API UnSubcribe
<<<<<<< HEAD
app.delete("/deleteSubcribe", async (req, res) => {
  try {
    let body = req.body;
    await db.deleteSubcribe(body);
    res.send("hủy theo dõi thành công");
  } catch (error) {
    res.send(error.toString());
  }
});

// API like
app.put("/like", async (req, res) => {
  try {
    let body = req.body;
    await db.like(body);
    res.send("like");
  } catch (error) {
    res.send(error.toString());
  }
});

//API dislike
app.put("/dislike", async (req, res) => {
  try {
    let body = req.body;
    await db.disLike(body);
    res.send("dislike");
  } catch (error) {
    res.send(error.toString());
  }
});

=======
// app.delete("/deleteSubcribe", async (req, res) => {
//   try{
//   let body = req.body;
//   await firestore.collection("UserInfo")
//   .where('UserId', '==', body.userIdStream).get()
//   .then(value => {
//      value.forEach(element => {
//        element.data().Subcriber.forEach( async data=>{
//          if(data==body.userIdSubcriber){
//               await firestore.collection("UserInfo").doc(element.id).update({
//                 Subcriber: admin.firestore.FieldValue.arrayRemove(body.userIdSubcriber)})
//                 res.send({message:"hủy theo dõi thành công"});
//               }else{
//                   res.send({message:"chưa theo dõi"});
//               }
//          })
//      })
//     });

//     await firestore.collection("UserInfo")
//     .where('UserId', '==', body.userIdSubcriber).get()
//     .then(value => {
//        value.forEach(element => {
//          element.data().Subcribe.forEach( async data=>{
//            if(data==body.userIdStream){
//                 await firestore.collection("UserInfo").doc(element.id).update({
//                   Subcribe: admin.firestore.FieldValue.arrayRemove(body.userIdStream)})
//             }
//            })
//        })
//       });

// }catch(error){
//     res.send(error.toString());}
// });

// API like
// app.put("/like", async (req, res) => {
//   try{
//     let body=req.body
//     await firestore.collection("Streams")
//       .where('HostID', '==', body.HostIdStream).get()
//       .then(value => {
//          value.forEach(element => {
//            element.data().DisLikes.forEach(async data=>{
//              if(data==body.userIdDisLike){
//                   await firestore.collection("Streams").doc(element.id).update({
//                     DisLikes: admin.firestore.FieldValue.arrayRemove(body.userIdDisLike)})
//                   await firestore.collection("Streams").doc(element.id).update({
//                     Likes: admin.firestore.FieldValue.arrayUnion(body.userIdDisLike)})
// res.send({message:"like"});
//                   }
// else{
//     res.send({message:"đã like"});
// }
//              })
//          })
//         });
// }catch(error){
//     res.send(error.toString());}
// });

//API dislike
// app.put("/dislike", async (req, res) => {
//   try{
//     let body=req.body
//     await firestore.collection("Streams")
//       .where('HostID', '==', body.HostIdStream).get()
//       .then(value => {
//          value.forEach(element => {
//            element.data().Likes.forEach(async data=>{
//              if(data==body.userIdDisLike){
//                   await firestore.collection("Streams").doc(element.id).update({
//                     Likes: admin.firestore.FieldValue.arrayRemove(body.userIdDisLike)})
//                   await firestore.collection("Streams").doc(element.id).update({
//                     DisLikes: admin.firestore.FieldValue.arrayUnion(body.userIdDisLike)})
//                   // res.send({message:"dislike"});
//                   }
//               // else{
//               //     res.send({message:"đã dislike"});
//               // }
//              })
//          })
//         });
// }catch(error){
//     res.send(error.toString());}
// });
>>>>>>> c52b4ca1103fa1e9d94ccd842b94fd9262d63dbd

// API thêm danh mục
// app.post("/addElementCategorie", async (req, res) => {
//   try {
//     let body = req.body
//     await firestore.collection("Categories").doc(body.docId).update(body.data);
//     res.send({ message: "thêm thành công" });
//   } catch (error) {
//     res.send(error.toString());
//   }
// });

//API thêm thành phần trong danh mục
app.listen(3000, "0.0.0.0", () => {
  console.log("Server is running on http://127.0.0.1:3000/");
});
