import React, {useState, useContext, createContext, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'ChatyDB',
    location: 'default',
  },
  res => {
    // console.log('OPEN DB [ ChatyDB ] SUCCFULY :::::) ');
  },
  err => {
    // console.log('OPEN DB [ ChatyDB ] ERROR :::::( ', err.message);
  },
);

const TablesName = {
  message: 'Messages',
  lastChats: 'last_chats',
  contactsLive: 'contacts_live',
  contactsNoteReg: 'contacts_notreg',
};

const DataBaseContext = createContext({});

const LocalDataBase = ({children}) => {
  // MAIN COMPONENT //

  const [AllMessages, setAllMessages] = useState([]);
  const [MessagesNotRead, setMessagesNotRead] = useState([]);
  const [LastChats, setLastChats] = useState([]);
  const [contactsLive, setcontactsLive] = useState([]);
  const [contactsNotReg, setcontactsNotReg] = useState([]);

  const [checkChatsAndMessages, setcheckChatsAndMessages] = useState(0);
  const [loadCreatTables, setloadCreatTables] = useState(false);

  // select count(*) from employee | for check

  const createTable = async () => {
    try {
      // MESSAGES

      await db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            TablesName.message +
            '(id TEXT,content TEXT, sender TEXT, chat TEXT, timestamp TEXT, isRead TEXT);',
          [],
          () => {
            // console.log('CREATE MESSAGES TABLE SUCCESSFULY :) ...');
          },
          err => console.log('CREATE MESSAGES TABLE ERROR :( ', err),
        );
      });

      // LAST CHATS

      await db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            TablesName.lastChats +
            ' (ID INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT)',
          [],
          () => {
            // console.log('CREATE LAST CHATS TABLE SUCCESSFULY :) ...');
          },
          err => console.log('CREATE LAST CHATS TABLE ERROR :( ', err),
        );
      });

      // ContactsLive
      // {"FCMtoken": "fcmToken", "__v": 15, "_id": "64ff3074a1f75ac2fc8abe3c", "countryKey": "+967", "friends": [], "groups": [], "image": "https://firebasestorage.googleapis.com/v0/b/sendme-98b81.appspot.com/o/usersImgaes%2F713263323-profile.png?alt=media&token=a8916b3e-b618-4f8e-a840-fa925c125538", "messagesStatus": [], "phoneNumber": 713263323, "unReadMessages": [], "username": "Ali Bawazir"}
      await db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            TablesName.contactsLive +
            '(ID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, countryKey TEXT, phoneNumber TEXT, userId TEXT, image TEXT)',
          [],
          () => {
            // console.log('CREATE CONTACTS LIVE TABLE SUCCESSFULY :) ...');
          },
          err => console.log('CREATE CONTACTS LIVE TABLE ERROR :( ', err),
        );
      });

      // ContactsNotReg

      // await db.transaction(tx => {
      //   tx.executeSql(
      //     'CREATE TABLE IF NOT EXISTS ' +
      //       TablesName.contactsNoteReg +
      //       ' (ID INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT)',
      //     [],
      //     () => {
      //       // console.log('CREATE CONTACTS NOT REG TABLE SUCCESSFULY :) ...');
      //     },
      //     err => console.log('CREATE CONTACTS NOT REG TABLE ERROR :( ', err),
      //   );
      // });
    } catch (error) {
      console.log(error, ' :: ERROR ON CREATE TABLES :: ');
    }
  };

  const checkTables = name => {
    const promise = new Promise((resolve, reject) => {
      if (name == TablesName.contactsLive) {
        db.transaction(tx => {
          tx.executeSql(
            `SELECT * FROM ${TablesName.contactsLive}`,
            [],
            (tx, res) => {
              if (res.rows.length == 0) {
                resolve('add');
              } else if (res.rows.length > 0) {
                resolve('update');
              }
            },
            err => reject(err),
          );
        });
      }
    });
    return promise;
  };

  useEffect(() => {
    const clearOut = setTimeout(() => {
      createTable();
      getAllMessages();
    }, 50);

    return () => {
      clearTimeout(clearOut);
      setAllMessages([]);
      setLastChats([]);
    };
  }, []);

  useEffect(() => {
    const clearOut = setTimeout(() => {
      // checkTables(TablesName.contactsLive)
      getLastChats();
      getMessagesNotRead();
    }, 100);

    return () => {
      clearTimeout(clearOut);
      setMessagesNotRead([]);
    };
  }, []);

  useEffect(() => {
    const clearOut = setTimeout(() => {
      getcontactsLive();
    }, 100);

    return () => {
      clearTimeout(clearOut);
      setcontactsLive([]);
    };
  }, []);

  const saveLastChat = data => {
    const n = new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO ' +
            TablesName.lastChats +
            " (body) VALUES ('" +
            JSON.stringify(data) +
            "')",
          [],
          (tx, res) => {
            getLastChats();
            resolve('SAVE NEW CHAT SUCCEFULY >>>');
          },
          err => {
            reject(err);
            console.log('error : on saveLastChat =>  ', err);
          },
        );
      });
    });
    return n;
  };

  const saveMessage = data => {
    // console.log(data, '|||||||||||||{{}}}}}KCCF<CFLCFLC<FLC<FLC<FL<C');
    const n = new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO ${TablesName.message} (id,content,sender,chat,timestamp,isRead) VALUES (?,?,?,?,?,?)`,
          [
            data.id,
            data.content,
            data.sender,
            data.chat,
            JSON.stringify(data.timestamp),
            data.isRead,
          ],
          (tx, res) => {
            resolve('SAVE MESSAGE SUCCEFULY >>>');
            getAllMessages();
          },
          err => reject(err),
        );
      });
    });
    return n;
  };

  const saveContactsLive = async data => {

      const newContact = [];
      const lastContact = []
      data.filter((item)=>{
        const find = contactsLive.find((ele)=>item?._id == ele.userId)
        if (find) {
          lastContact.push(item)
        } else {
          newContact.push(item)
        }
      });

      
     let SqlQuiryAdd ;
     let SqlQuiryUpdate ;

      SqlQuiryAdd = `INSERT INTO ${TablesName.contactsLive} (userId,username,countryKey,phoneNumber,image) VALUES (?,?,?,?,?)`
      newContact.map((ele)=>{
        db.transaction(tx => {
          tx.executeSql(
            SqlQuiryAdd,
            [ele?._id, ele?.username, ele?.countryKey, ele?.phoneNumber, ele?.image],
            (x, result) => {
              getcontactsLive();
              console.log(' save your contact finshed 👍');
            },
            err => {
              console.log(
                '🧐 error on save your contact : ',
                err.message,
              );
            },
          );
        });
      });


      SqlQuiryUpdate = `UPDATE ${TablesName.contactsLive} set username = ?,countryKey = ?,phoneNumber = ?, image = ? where userId = ?`
      lastContact.map((ele)=>{
        db.transaction(tx => {
          tx.executeSql(
            SqlQuiryUpdate,
            [ele?.username, ele?.countryKey, ele?.phoneNumber, ele?.image, ele?._id],
            (x, result) => {
              getcontactsLive();
              console.log(' update SAVE CONTACTS live SUCCESFLUY c0000n74c7');
            },
            err => {
              console.log(
                ' ERROR ON SAVE CONTACTS live SUCCESFLUY c0000n74c7 :( ',
                err.message,
              );
            },
          );
        });
      });

    
  };

  // const saveContactsNotReg = data => {
  //   const n = new Promise((resolve, reject) => {
  //     db.transaction(tx => {
  //       tx.executeSql(
  //         'INSERT INTO ' +
  //           TablesName.contactsNoteReg +
  //           " (body) VALUES ('" +
  //           JSON.stringify(data) +
  //           "')",
  //         [],
  //         (tx, res) => {
  //           getcontactsNotReg()
  //           console.log("SAVE CONTACTS NOT REG SUCCESFLUY");
  //         },
  //         err => reject(err),
  //       );
  //     });
  //   });
  //   return n;
  // };

  const getAllMessages = () => {
    try {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM ${TablesName.message}`,
          [],
          (x, result) => {
            let len = result.rows.length;
            if (len > 0) {
              // console.log(' GET MESSAGES SUCCFULY :) ');
              let mesg = [];
              for (let i = 0; i < len; i++) {
                mesg.push(result.rows.item(i));
              }
              setAllMessages(mesg);
              setcheckChatsAndMessages(o => o + 1);
              // JSON.parse(mesg[0].body)
              // console.log(mesg,`
              // this is get all mesages from sqlite
              // `);
            } else {
              setcheckChatsAndMessages(o => o + 1);
              // console.log('Not Found messages ...');
            }
          },
          err => {
            setcheckChatsAndMessages(o => o + 1);
            console.log(
              ' ERROR ON GET MESSAGES :( on res err sql ',
              err.message,
            );
          },
        );
      });
    } catch (error) {
      setcheckChatsAndMessages(o => o + 1);
      console.log(error, ' :: ERROR ON GET MESSAGES :: on cach try ');
    }
  };

  const getLastChats = data => {
    const last = new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM ' + TablesName.lastChats,
          [],
          (x, result) => {
            let len = result.rows.length;
            if (len > 0) {
              // console.log(" GET LAST CHATS SUCCFULY :) ");
              let last = [];
              for (let i = 0; i < len; i++) {
                last.push(JSON.parse(result.rows.item(i).body));
              }
              setcheckChatsAndMessages(o => o + 1);
              setLastChats(last);
              // console.log(last);
              resolve(last);
            } else {
              //  console.log("NOT FOUND IN CHAT IN THE LAST MOMMENT ...");
              resolve([]);
              setcheckChatsAndMessages(o => o + 1);
            }
          },
          err => {
            setcheckChatsAndMessages(o => o + 1);
            reject(err);
            console.log(' ERROR ON LAST CHATS :( ', err.message);
          },
        );
      });
    });
    return last;
  };

  const getMessagesNotRead = () => {
    const promis = new Promise((resolve,reject)=>{
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM Messages WHERE isRead = 0 OR isRead = 1`,
          [],
          (x, result) => {
            let len = result.rows.length;
            if (len > 0) {
              let mesg = [];
              for (let i = 0; i < len; i++) {
                mesg.push(result.rows.item(i));
              }
              setMessagesNotRead(mesg);
              setcheckChatsAndMessages(o => o + 1);
              resolve(mesg)
            } else {
              setMessagesNotRead([]);
              setcheckChatsAndMessages(o => o + 1);
              resolve([])
              // console.log(
              //   'Messages not read            is not found',
              //   '|/*************************',
              // );
            }
          },
          err => {
            setcheckChatsAndMessages(o => o + 1);
            reject(err)
            console.log(' ERROR ON GET MESSAGESNOT READ :( ', err.message);
          },
        );
      });
    })
    return promis
  };

  const getcontactsLive = () => {
    const last = new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM ' + TablesName.contactsLive + ';',
          [],
          (x, result) => {
            let len = result.rows.length;
            // console.log(result.rows.length ," lklklklkl");
            console.log('ALL ConTact = ', len);
            if (len == 0) {
              // console.log("GET CONTACTS LIVE SUCCESFLU length == 0");
              setcheckChatsAndMessages(o => o + 1);
              setcontactsLive([]);
              resolve([]);
            } else if (len > 0) {
              setcheckChatsAndMessages(o => o + 1);
              let arr = []
              for (let i = 0; i < result.rows.length; i++) {
                 arr.push(result.rows.item(i))
              }
              setcontactsLive(arr);
              resolve(arr);
            }
          },
          err => {
            setcheckChatsAndMessages(o => o + 1);
            console.log(' ERROR ON GET CONTACTS LIVE 🧐 ', err.message);
            reject(err);
          },
        );
      });
    });
    return last;
  };

  // const getcontactsNotReg = () => {
  //   const last = new Promise((resolve, reject) => {
  //     db.transaction(tx => {
  //       tx.executeSql(
  //         'SELECT * FROM ' + TablesName.contactsNoteReg,
  //         [],
  //         (x, result) => {

  //           if (result.rows.length == 0) {
  //             console.log("GET CONTACTS NOT REG SUCCESFLUY length == 0");
  //             setcheckChatsAndMessages(o => o + 1);
  //             setcontactsNotReg([]);
  //             resolve([])
  //         }else{
  //             let len = result.rows.item(0).body;
  //             console.log("GET CONTACTS NOT REG SUCCESFLUY length == "+result.rows.length);
  //             setcheckChatsAndMessages(o => o + 1);
  //             const arr = JSON.parse(len)
  //             setcontactsNotReg(arr);
  //             resolve(arr);
  //         }

  //           // let len = result.rows.item(0).body;
  //           // const arr = JSON.parse(len)
  //           // if (len == undefined) {
  //           //   setcontactsNotReg([]);
  //           //   setcheckChatsAndMessages(o => o + 1);
  //           //   resolve([])
  //           // }else{
  //           //   setcontactsNotReg(arr);
  //           //   setcheckChatsAndMessages(o => o + 1);
  //           //   resolve(arr);
  //           // }
  //         },
  //         err => {
  //           setcheckChatsAndMessages(o => o + 1);
  //           console.log(' ERROR ON GET CONTACTS LIVE :( ', err.message);
  //           reject(err);
  //         },
  //       );
  //     });
  //   });
  //   return last;
  // };

  const RemoveAllData = async () => {
    try {
      
      await db.transaction(tx => {
        tx.executeSql(`DELETE FROM ${TablesName.message}`);
      });
      await db.transaction(tx => {
        tx.executeSql(`DELETE FROM ${TablesName.lastChats}`);
      });
      await db.transaction(tx => {
        tx.executeSql(`DELETE FROM ${TablesName.contactsLive}`);
      });
      await db.transaction(tx => {
        tx.executeSql(`DELETE FROM ${TablesName.contactsNoteReg}`);
      });
      console.log('DATABASE DELETED SUCCESFUl');
      
    } catch (error) {
      console.log(error, 'on delete database data');
      return false
    }
  };

  const deleteMessagesByIds = async (messageIds) => {
  await  db.transaction((tx) => {
      const placeholders = messageIds.map(() => '?').join(',');
      const sql = `DELETE FROM ${TablesName.message} WHERE id IN (${placeholders})`;
  
      tx.executeSql(sql, messageIds, (_, resultSet) => {
        getAllMessages()
        getMessagesNotRead()
        console.log('تم حذف الرسائل بنجاح');
      }, (_, error) => {
        console.log('حدث خطأ أثناء حذف الرسائل:', error.message);
      });
    });
  };


  const checkIsRead = chatId => {
    // console.log(chatId);
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE ${
          TablesName.message
        } SET isRead = 1 WHERE chat == ${JSON.stringify(chatId)}`,
        [],
        (x, result) => {
          // console.log('Change isRead to true Succfuly . ):');
          getMessagesNotRead();
        },
        err => {
          console.log(' ERROR ON Change isRead to true :( ', err.message);
        },
      );
    });
  };

  const updateMultipleMessages = async (messageIds, newContent) => {
    const updateQuery = `UPDATE messages SET content = ? WHERE id IN (${messageIds.join(
      ',',
    )})`;

    try {
      await db.transaction(async transaction => {
        await transaction.executeSql(updateQuery, [newContent]);
      });

      console.log('تم تعديل الرسائل بنجاح');
    } catch (error) {
      console.error('حدث خطأ أثناء تعديل الرسائل:', error);
    }
  };

  const changeMessageStatus = async (messageIds, status) => {
    if (messageIds.length != 0) {
      try {
        await messageIds.map(async item => {
          console.log(JSON.parse(JSON.stringify(item)));
          const updateQuery = `UPDATE ${
            TablesName.message
          } SET isRead = ${status} WHERE id == ${JSON.stringify(item)}`;
          await db.transaction(tx => {
            tx.executeSql(
              updateQuery,
              [],
              (x, result) => {
                console.log(`Change isRead to ${status} Succfuly . ):`);
                getAllMessages();
                getMessagesNotRead();
              },
              err => {
                console.log(' ERROR ON Change isRead to true :( ', err, status);
              },
            );
          });
        });
        return true;
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <DataBaseContext.Provider
      value={{
        AllMessages,
        setAllMessages,
        LastChats,
        setLastChats,
        getLastChats,
        saveMessage,
        saveLastChat,
        checkIsRead,
        MessagesNotRead,
        getMessagesNotRead,
        checkChatsAndMessages,
        RemoveAllData,
        saveContactsLive,
        // saveContactsNotReg,
        // getcontactsNotReg,
        setMessagesNotRead,
        getcontactsLive,
        contactsLive,
        contactsNotReg,
        setcontactsLive,
        setcontactsNotReg,
        changeMessageStatus,
        deleteMessagesByIds
      }}>
      {children}
    </DataBaseContext.Provider>
  );
};

export default LocalDataBase;
export {db};
export const useLocalDataBase = () => useContext(DataBaseContext);
