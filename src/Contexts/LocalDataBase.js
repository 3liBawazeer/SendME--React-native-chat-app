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
    console.log('OPEN DB [ ChatyDB ] ERROR :::::( ', err.message);
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

      await db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            TablesName.contactsLive +
            ' (ID INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT)',
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

  const checkTables = (name) => { 
    const promise = new Promise((resolve, reject) => {
        if (name == TablesName.contactsLive) {
          db.transaction(tx => {
            tx.executeSql(
               `SELECT * FROM ${TablesName.contactsLive}`,
              [],
              (tx, res) => {
                console.log(res.rows , "this is res from count(*)");
                if (res.rows.length == 0) {
                  resolve("add")
                }else if(res.rows.length > 0){
                  resolve("update")
                }
              },
              err => reject(err),
            );
          });
        }
      });
      return promise ;
   }

  useEffect(() => {
    const clearOut = setTimeout(() => {
      createTable();
      getAllMessages();
    }, 200);

    return () => {
      clearTimeout(clearOut);
      setAllMessages([]);
      setLastChats([]);
    };
  }, []);

  useEffect(() => {
    const clearOut = setTimeout(() => {
      checkTables(TablesName.contactsLive)
      getLastChats();
      getMessagesNotRead();
    }, 100);

    return () => {
      clearTimeout(clearOut);
      setMessagesNotRead([]);
    };
  }, []);

  useEffect(() => {
      getcontactsLive();
    return () => {
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
            resolve('SAVE NEW CHAT SUCCEFULY >>>');
            getLastChats();
          },
          err => reject(err),
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
    checkTables(TablesName.contactsLive).then((ch)=>{
      if (ch == "add") {

        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO ' +
              TablesName.contactsLive +
              " (body) VALUES ('"+
              JSON.stringify(data)+
              "') ;",
            [],
            (tx, res) => {
              getcontactsLive()
              console.log(" adddddd SAVE CONTACTS live SUCCESFLUY c0000n74c7");
            },
            err => {
              console.log(err);
              reject(err)
            },
          );
        });

      }else if (ch == "update") {

        db.transaction(tx => {
          tx.executeSql(
            `UPDATE ${TablesName.contactsLive} SET body = 1 WHERE ID == 1 ;`,
            [],
            (x, result) => {
              getcontactsLive()
              console.log(" update SAVE CONTACTS live SUCCESFLUY c0000n74c7");
            },
            err => {
              console.log(' ERROR ON Change isRead to true :( ', err.message);
            },
          );
        });
        
      }
       
    }).catch((err)=>{
      console.log("ERROR ON SAVE CONTACTS LIVE");
    })
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
            console.log(' ERROR ON GET MESSAGES :( on res err sql ', err.message);
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
              console.log(last);
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
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM Messages WHERE isRead == ${'0'}`,
        [],
        (x, result) => {
          let len = result.rows.length;
          if (len > 0) {
            let mesg = [];
            for (let i = 0; i < len; i++) {
              mesg.push(result.rows.item(i));
            }
            setMessagesNotRead(mesg);
            // console.log(
            //   'Messages not read ',
            //   mesg,
            //   '|/*************************',
            // );
          } else {
            setMessagesNotRead([]);
            // console.log(
            //   'Messages not read            is not found',
            //   '|/*************************',
            // );
          }
        },
        err => {
          console.log(' ERROR ON GET MESSAGESNOT READ :( ', err.message);
        },
      );
    });
  };

  const getcontactsLive = () => {
    const last = new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM ' + TablesName.contactsLive + ";",
          [],
          (x, result) => {
            let len = result.rows.length
            console.log(result.rows.length ," lklklklkl");
            if (len == 0) {
                console.log("GET CONTACTS LIVE SUCCESFLU length == 0");
                setcheckChatsAndMessages(o => o + 1);
                setcontactsLive([]);
                resolve([])
            }else if (len > 0) {
                setcheckChatsAndMessages(o => o + 1);
                const arr = JSON.parse(result.rows.item(0).body)
                setcontactsLive(arr);
                console.log(arr,"this is saejjjj");
                resolve(arr);
            }
          },
          err => {
            setcheckChatsAndMessages(o => o + 1);
            console.log(' ERROR ON GET CONTACTS LIVE :( ', err.message);
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
      setAllMessages([]);
      setLastChats([]);
      setMessagesNotRead([]);
    } catch (error) {
      console.log(error, 'on delete database data');
    }
  };

  const checkIsRead = chatId => {
    console.log(chatId);
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE ${TablesName.message} SET isRead = 1 WHERE chat == ${JSON.stringify(chatId)}`,
        [],
        (x, result) => {
          console.log('Change isRead to true Succfuly . ):');
          getMessagesNotRead();
        },
        err => {
          console.log(' ERROR ON Change isRead to true :( ', err.message);
        },
      );
    });
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
        getcontactsLive,
        contactsLive,
        contactsNotReg,
        setcontactsLive,
        setcontactsNotReg,
      }}>
      {children}
    </DataBaseContext.Provider>
  );
};

export default LocalDataBase;
export {db};
export const useLocalDataBase = () => useContext(DataBaseContext);
