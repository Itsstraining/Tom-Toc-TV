
var admin = require("firebase-admin");
var serviceAccount = require("./keys/key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();
class Database {
  constructor() {

  }

  async editUserInfo(body) {
    let temp;
    try {
      await firestore.collection("UserInfo")
      .where('UserId', '==', body.userId).get().then(res => {
        res.forEach(element => {
           return temp=element.id ;
        });
      });
      await firestore.collection("UserInfo").doc(temp).update(body.data);
    } catch (err) {
      console.log(err);
    }
  }

  async getUserInfo(body) {
    let temp;
    try {
      await firestore.collection("UserInfo")
      .where('UserId', '==', body.userId).get().then(res => {
        res.forEach(element => {
           return temp=element.data() ;
        });
      });
      return temp
      // await firestore.collection("UserInfo").doc(temp).update(body.data);
    } catch (err) {
      console.log(err);
    }
  }

  async createUser(body) {
    let temp;
    try {
      
      let checkUser=false;
      let findUser = await firestore.collection("Users").get()
      findUser.forEach(doc => {
        // console.log(doc.data())
        if(doc.id == body.docUser ){
          return checkUser=true;
        }
      });
      // console.log(checkUser)
      if(!checkUser){
      let result = await firestore.collection("Users").add(body.data);
      // let temp= result.data();
      }
    } catch (err) {
      console.log(err);
    }
  }

  ////STREAM FUNCTION

  /// Tạo stream
  async createStream(body) {
    let temp;
    try {
     temp = await firestore.collection("Streams").add(body).then((data)=>{
       return data.id;
     });
      let string = temp.id;
      let checkUser = await firestore.collection("Streams").doc(string).get();
      let StreamID = checkUser.data().HostId;
      await firestore.collection("Users").doc(StreamID).update({ "isStreaming": true });
      return temp;
    } catch (err) {
      console.log(err);
    }
  }
  //Xóa stream
  async endStream(bodydata) {
    try {
      let string;
      await firestore.collection("Streams").doc(bodydata.streamId).get().then((data) => {
        string = data.data().HostId;
      })
      await firestore.collection("Streams").doc(bodydata.streamId).delete();
      await firestore.collection("Users").doc(string).update({ "isStreaming": false });
    } catch (err) {
    }
  }

  async addChat(data) {
    try {
      await firestore.collection("Streams").doc(data.streamId).update({
        Messages: admin.firestore.FieldValue.arrayUnion({ UserId: data.UserId, mess: data.message })
      })
    } catch (err) {
      console.log(err);
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
             }) 
         })
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

}
module.exports = Database;