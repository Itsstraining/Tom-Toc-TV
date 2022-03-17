var admin = require("firebase-admin");
var serviceAccount = require("./keys/key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
class Database {
  constructor() {}

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
    } catch (err) {}
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
        // console.log(doc.data())
        if (doc.id == body.docUser) {
          return (checkUser = true);
        }
      });
      // console.log(checkUser)
      if (!checkUser) {
        let result = await firestore.collection("Users").add(body.data);
        // let temp= result.data();
      }
    } catch (err) {
      console.log(err);
    }
  }

  ////STREAM FUNCTION

  // api lấy  thông tin cá nhân của người dùng
  async getItemid(){
    let temp;
    (await firestore.collection("UserInfo")
    .get())
    .docs.map((data)=>{
      temp = data.data();
    })
    return temp;
  }
  //// category
  async getCategory(){
    let temp=[];
    (await firestore.collection("Categories").get()
    ).docs.map((data) => {
      temp.push(data.data().categoryName);
    })
    console.log(temp)
    return temp;
  }
  /// Tạo stream
  async createStream(data) {
    return new Promise(async (resolve, reject) => {
      let temp = await (await firestore.collection("Streams").add(data)).get();
      let checkUser = temp.data();
      let StreamID = checkUser.HostId;
      await firestore
        .collection("Users")
        .doc(StreamID)
        .update({ isStreaming: true });
      resolve(temp.id);
    });
  }
  //Xóa stream
  async endStream(bodydata) {
    try {
      let string;
      await firestore
        .collection("Streams")
        .doc(bodydata.streamId)
        .get()
        .then((data) => {
          string = data.data().HostId;
        });
      await firestore.collection("Streams").doc(bodydata.streamId).delete();
      await firestore
        .collection("Users")
        .doc(string)
        .update({ isStreaming: false });
    } catch (err) {}
  }

  async addChat(data) {
    try {
      let length=await firestore.collection("Streams").doc(data.streamId).get().then( (data)=>{
        return  data.data().Messages.length;
      })
      await firestore
        .collection("Streams")
        .doc(data.streamId)
        .update({
          Messages: admin.firestore.FieldValue.arrayUnion({
            UserId: data.UserId,
            UserName:data.UserName,
            messNum:length,
            mess: data.message,
          }),
        });
    } catch (err) {
      console.log(err);
    }
  }
  ////END STREAM FUNCTION

  async createSubcribe(body) {
    try {
      await firestore
        .collection("UserInfo")
        .where("UserId", "==", body.userIdStream)
        .get()
        .then((value) => {
          value.forEach((element) => {
            element.data().Subcriber.forEach(async (data) => {
              if (data != body.userIdSubcriber) {
                await firestore
                  .collection("UserInfo")
                  .doc(element.id)
                  .update({
                    Subcriber: admin.firestore.FieldValue.arrayUnion(
                      body.userIdSubcriber
                    ),
                  });
                res.send({ message: "theo dõi thành công" });
              } else {
                res.send({ message: "đã theo dõi" });
              }
            });
          });
        });
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = Database;
