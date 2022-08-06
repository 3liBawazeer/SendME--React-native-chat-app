import React,{useState,useContext,createContext,useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SQLite from "react-native-sqlite-storage"

const db = SQLite.openDatabase(
    {
    name:"ChatyDB",
    location:'default',
    },
    (res)=>{
      console.log("OPEN DB [ ChatyDB ] SUCCFULY :::::) ",)
    },
    (err)=>{console.log("OPEN DB [ ChatyDB ] ERROR :::::( ",err.message);},
);

const TablesName = {
  message:"Messages",
  lastChats:"last_chats"
}

let saveMessage;
let getLastChats;

const saveLastChat = (data) => {
  const n = new Promise((resolve,reject)=>{
    db.transaction((tx)=>{
      tx.executeSql(
          "INSERT INTO "+TablesName.lastChats+" (body) VALUES ('"+JSON.stringify(data)+"')",
          [],
          (tx,res)=>{
            console.log("SAVE NEW CHAT SUCCEFULY >>>");
            resolve("SAVE NEW CHAT SUCCEFULY >>>")
            getLastChats()
           },
           (err)=> reject(err),
       )
      })
  })
  return n
 }

 const CheckIsRead = (chatId) => { 
  db.transaction((tx)=>{
    tx.executeSql(
        "UPDATE table",
        [],
        (x,result)=>{
        let len = result.rows.length;
        if (len > 0) {
            console.log(" GET MESSAGES SUCCFULY :) ");
            let mesg = []
            for(let i = 0 ; i < len;i++){
                mesg.push(JSON.parse(result.rows.item(i).body))
            }
             setAllMessages(mesg)
             // JSON.parse(mesg[0].body)
             // console.log(mesg,`
             // this is get all mesages from sqlite
             // `);
        }else{
            console.log("Not Found messages ...");
        }
        
        },
        (err)=>{
            console.log(" ERROR ON GET MESSAGES :( ", err.message );
        }
    )
})
  }

const DataBaseContext = createContext({})

const LocalDataBase = ({children}) => { // MAIN COMPONENT //

  const [AllMessages, setAllMessages] = useState([]);
  const [LastChats, setLastChats] = useState([]);

      useEffect(() => {
      const clearOut = setTimeout(() => {
          createTable()
          getAllMessages()
        }, 100);

        return ()=>{
          clearTimeout(clearOut)
          setAllMessages([])
          setLastChats([])
        }
      }, [])

      useEffect(()=>{
        const clearOut = setTimeout(() => {
          getLastChats()
        }, 100);
        return ()=>{
          clearTimeout(clearOut)
        }
      },[])
  
      const createTable = async () => { 
      await  db.transaction((tx)=>{
             tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "+TablesName.message+" (ID INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT)",
                [],
                ()=>{
                    console.log("CREATE MESSAGES TABLE SUCCESSFULY :) ...");
                },
                err => console.log("CREATE MESSAGES TABLE ERROR :( ",err)
            )
        });
        await  db.transaction((tx)=>{
          tx.executeSql(
             "CREATE TABLE IF NOT EXISTS "+TablesName.lastChats+" (ID INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT)",
             [],
             ()=>{
                 console.log("CREATE LAST CHATS TABLE SUCCESSFULY :) ...");
             },
             err => console.log("CREATE LAST CHATS TABLE ERROR :( ",err)
         )
     });

    };


      saveMessage = (data) => {
      // console.log(data.chat,"|||||||||||||||||||||||||||||||||||||||||||||||||||||||||");
       const n = new Promise((resolve,reject)=>{
           db.transaction((tx)=>{
             tx.executeSql(
                 "INSERT INTO "+TablesName.message+" (body) VALUES ('"+JSON.stringify(data)+"')",
                 [],
                 (tx,res)=>{
                   resolve("SAVE MESSAGE SUCCEFULY >>>")
                   getAllMessages()
                  },
                  (err)=> reject(err),
              )
             })
         })
         return n
       }
      
       const getAllMessages = () => { 
         db.transaction((tx)=>{
             tx.executeSql(
                 "SELECT * FROM Messages",
                 [],
                 (x,result)=>{
                 let len = result.rows.length;
                 if (len > 0) {
                     console.log(" GET MESSAGES SUCCFULY :) ");
                     let mesg = []
                     for(let i = 0 ; i < len;i++){
                         mesg.push(JSON.parse(result.rows.item(i).body))
                     }
                      setAllMessages(mesg)
                      // JSON.parse(mesg[0].body)
                      // console.log(mesg,`
                      // this is get all mesages from sqlite
                      // `);
                 }else{
                     console.log("Not Found messages ...");
                 }
                 
                 },
                 (err)=>{
                     console.log(" ERROR ON GET MESSAGES :( ", err.message );
                 }
             )
         })
       };


       getLastChats =  (data) =>{
        const last = new Promise((resolve,reject)=>{
          db.transaction((tx)=>{
            tx.executeSql(
                "SELECT * FROM "+TablesName.lastChats,
                [],
                (x,result)=>{
                let len = result.rows.length;
                if (len > 0) {
                    console.log(" GET LAST CHATS SUCCFULY :) ");
                    let last = []
                    for(let i = 0 ; i < len;i++){
                        last.push(JSON.parse(result.rows.item(i).body))
                    }
                     setLastChats(last)
                     console.log(last);
                     resolve(last)
                }else{
                   console.log("NOT FOUND IN CHAT IN THE LAST MOMMENT ...");
                   resolve([])
                }
                
                },
                (err)=>{
                    reject(err)
                    console.log(" ERROR ON GET MESSAGES :( ", err.message );
                }
            )
        })
        })
        return last
       } 

       


  return (
    <DataBaseContext.Provider value={{AllMessages,setAllMessages,LastChats,setLastChats}} >
      {children}
    </DataBaseContext.Provider>
  )
}

export default LocalDataBase
export {saveMessage,getLastChats,saveLastChat,db}
export const useLocalDataBase = () => useContext(DataBaseContext) ;

