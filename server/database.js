var admin = require("firebase-admin");
var serviceAccount = require("./keys/key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
class Database {
  constructor() { }

  async editUserInfo(body) {
    let temp;
    try {
      await firestore
        .collection("UserInfo")
        .where("UserId", "==", body.userId)
        .get()
        .then((res) => {
          res.forEach((element) => {
            return (temp = element.id);
          });
        });
      await firestore.collection("UserInfo").doc(temp).update(body.data);
    } catch (err) {
      console.log(err);
    }
  }
  async addNewUser(data) {
    try {
      let temp = await firestore.collection("Users").doc(data.Id).get();
      if (temp.exists) {
        return;
      } else {
        await firestore
          .collection("Users")
          .doc(data.Id)
          .set({ Name: data.Name, isStreaming: false });
        await firestore.collection("UserInfo").add({
          UserId: data.Id,
          Name: data.Name,
          Subcribe: [],
          Subcriber: [],
        });
      }
    } catch (err) { }
  }

  async getUserInfo(id) {
    let temp;
    try {
      await firestore
        .collection("UserInfo")
        .where("UserId", "==", id)
        .get()
        .then((res) => {
          res.forEach((element) => {
            return (temp = element.data());
          });
        });
      return temp;
      // await firestore.collection("UserInfo").doc(temp).update(body.data);
    } catch (err) {
      console.log(err);
    }
  }

  async createUser(body) {
    let temp;
    try {
      let checkUser = false;
      let findUser = await firestore.collection("Users").get();
      findUser.forEach((doc) => {
        if (doc.id == body.docUser) {
          return (checkUser = true);
        }
      });
      if (!checkUser) {
        let result = await firestore.collection("Users").add(body.data);
        return temp= result.data();
      }
    } catch (err) {
      console.log(err);
    }
  }


  async getStream(body) {
    try {
      let listStreamer;

      let temp;
      await firestore.collection("UserInfo")
      .where("UserId", "==", body.userId).get()
      .then((res) => {
        res.forEach((element) => {
          return (temp = element.id);
        });
      });

      await firestore.collection("UserInfo").doc(temp).get().then(doc => {
        listStreamer=doc.data().Subcribe;
        });
      return listStreamer;
    } catch (err) {
      console.log(err);
    }
  }

////STREAM FUNCTION
/// Tạo stream
  async createStream(body) {
    try {
  let findUser = await firestore.collection("Users").get()
  findUser.forEach(doc => {
    if(doc.id == body.docUser ){
      return checkUser=true;
    }
  });
  if(!checkUser){
  await firestore.collection("Users").add(body.data);
  
  }
    } catch (err) {
      console.log(err);
    }
  }


  //Xóa stream
  async endStream(bodydata) {

    try {
      let string;
      await firestore
        .collection("Streams")
        .doc(bodydata.bodydata.streamId)
        .get()
        .then((data) => {
          string = data.data().HostId;
        });
      await firestore.collection("Streams").doc(bodydata.bodydata.streamId).delete();
      await firestore
        .collection("Users")
        .doc(string)
        .update({ isStreaming: false });
    } catch (err) { }
  }

  async addChat(data) {
    try {
      let length = await firestore.collection("Streams").doc(data.streamId).get().then((data) => {
        return data.data().Messages.length;
      })
      await firestore
        .collection("Streams")
        .doc(data.streamId)
        .update({
          Messages: admin.firestore.FieldValue.arrayUnion({
            UserId: data.UserId,
            UserName: data.UserName,
            messNum: length,
            mess: data.message,
          }),
        });
    } catch (err) {
      console.log(err);
    }
  }
  async addViewer(IdStream, UserId) {
    try {
      await firestore.collection("Streams").doc(IdStream).update({
        Viewer: admin.firestore.FieldValue.arrayUnion(UserId)
      })
    } catch (err) {

    }

  }
  async removeViewer(IdStream, UserId) {
    try {
      await firestore.collection("Streams").doc(IdStream).update({
        Viewer: admin.firestore.FieldValue.arrayRemove(UserId)
      })

    } catch (err) {

    }

  }

  async Like(IdStream, userIdDisLike) {
    try {
      await firestore.collection("Streams").doc(IdStream).get().then(value => {

        value.data().DisLikes.forEach(async data => {
          if (data == userIdDisLike) {
            await firestore.collection("Streams").doc(IdStream).update({
              DisLikes: admin.firestore.FieldValue.arrayRemove(userIdDisLike)
            })
            await firestore.collection("Streams").doc(IdStream).update({
              Likes: admin.firestore.FieldValue.arrayUnion(userIdDisLike)
            })
          }
          else {
            await firestore.collection("Streams").doc(IdStream).update({
              Likes: admin.firestore.FieldValue.arrayUnion(userIdDisLike)
            })
          }
        })

      })
    } catch (error) {
      res.send(error.toString());
    }

  }
  async disLike(IdStream, userIdDisLike) {
    try {
      await firestore.collection("Streams").doc(IdStream).get().then(value => {
        value.data().Likes.forEach(async data => {
          if (data == userIdDisLike) {
            await firestore.collection("Streams").doc(IdStream).update({
              Likes: admin.firestore.FieldValue.arrayRemove(userIdDisLike)
            })
            await firestore.collection("Streams").doc(IdStream).update({
              DisLikes: admin.firestore.FieldValue.arrayUnion(userIdDisLike)
            })
          }
        })

      });
      await firestore.collection("Streams").doc(IdStream).update({
        DisLikes: admin.firestore.FieldValue.arrayUnion(userIdDisLike)
      })
    } catch (err) {

    }

  }
  ////END STREAM FUNCTION

  async createSubcribe(body) {
    try {
      await firestore.collection("UserInfo")
      .where('UserId', '==', body.userIdStream).get()
      .then(value => {
         value.forEach(element => {
           element.data().Subcriber.forEach( async data=>{
             if(data!=body.userIdSubcriber){
                  await firestore.collection("UserInfo").doc(element.id).update({
                    Subcriber: admin.firestore.FieldValue.arrayUnion(body.userIdSubcriber)})
              }
            });
          });
        });

        await firestore.collection("UserInfo")
        .where('UserId', '==', body.userIdSubcriber).get()
        .then(value => {
               value.forEach(element => {
                 element.data().Subcribe.forEach( async data=>{
                   if(data!=body.userIdStream){
                        await firestore.collection("UserInfo").doc(element.id).update({
                          Subcribe: admin.firestore.FieldValue.arrayUnion(body.userIdStream)})
                    }
                   })   
               })
              });

    } catch (err) {
      console.log(err);
    }
  }

  async deleteSubcribe(body) {
    try {
      await firestore.collection("UserInfo")
        .where('UserId', '==', body.userIdStream).get()
        .then(value => {
           value.forEach(element => {
             element.data().Subcriber.forEach( async data=>{
               if(data==body.userIdSubcriber){
                    await firestore.collection("UserInfo").doc(element.id).update({
                      Subcriber: admin.firestore.FieldValue.arrayRemove(body.userIdSubcriber)})
                    }
               })   
           })
          });
      
          await firestore.collection("UserInfo")
          .where('UserId', '==', body.userIdSubcriber).get()
          .then(value => {
             value.forEach(element => {
               element.data().Subcribe.forEach( async data=>{
                 if(data==body.userIdStream){
                      await firestore.collection("UserInfo").doc(element.id).update({
                        Subcribe: admin.firestore.FieldValue.arrayRemove(body.userIdStream)})
                  }
                 })   
             })
            });
    } catch (err) {
      console.log(err);
    }
  }

  async like(body) {
    try {
    await firestore.collection("Streams")
      .where('HostId', '==', body.HostIdStream).get()
      .then(value => {
         value.forEach(element => {
           element.data().DisLikes.forEach(async data=>{
             if(data==body.userIdDisLike){
                  await firestore.collection("Streams").doc(element.id).update({
                    DisLikes: admin.firestore.FieldValue.arrayRemove(body.userIdDisLike)})
                  await firestore.collection("Streams").doc(element.id).update({
                    Likes: admin.firestore.FieldValue.arrayUnion(body.userIdDisLike)})
                  }
             })   
         })
        });
    } catch (err) {
      console.log(err);
    }
  }

  async disLike(body) {
    try {
      await firestore.collection("Streams")
      .where('HostId', '==', body.HostIdStream).get()
      .then(value => {
         value.forEach(element => {
           element.data().Likes.forEach(async data=>{
             if(data==body.userIdLike){
                  await firestore.collection("Streams").doc(element.id).update({
                    Likes: admin.firestore.FieldValue.arrayRemove(body.userIdLike)})
                  await firestore.collection("Streams").doc(element.id).update({
                    DisLikes: admin.firestore.FieldValue.arrayUnion(body.userIdLike)})
                  }
             })   
         })
        });
    } catch (err) {
      console.log(err);
    }
  }

  async addCategorie(body){
    try {
      await firestore.collection("Categories").add(body.data);
    } catch (err) {
      console.log(err);
    }
  }

  async addElementCategorie(body){
    try {
      await firestore.collection("Categories").doc(body.docId).update(body.data);
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = Database;
