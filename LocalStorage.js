import { StyleSheet, Text, View,TextInput, FlatList, Button } from 'react-native'
import React,{useState,useEffect} from 'react'
import SQLite from "react-native-sqlite-storage"

const db = SQLite.openDatabase(
    {
    name:"ChatyDB",
    location:'default',
    },
    (res)=>{
      console.log("openDatabase SUCCFULY ::::: ",)
    },
    (err)=>{console.log("Error on openDatabase ::::: ",err.message);},
);


 

const LocalStorage = () => {

    

    useEffect(() => {
       const clearTime = setTimeout(() => {
            createTable()
            getMessages()
        }, 100);
        return ()=>{
        clearTimeout
        }
    }, [])
    
    const createTable = () => { 
        db.transaction((tx)=>{
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS Messages(ID INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT , sender TEXT , chat TEXT ,timestamp INTEGER)",
                [],
                ()=>{
                    // console.log("create table successfuly ...");
                },
                err => console.log(err)
            )
        })
     };

     const getMessages = () => { 
        db.transaction((tx)=>{
            tx.executeSql(
                "SELECT content, sender, chat, timestamp FROM Messages",
                [],
                (x,result)=>{
                let len = result.rows.length;
                if (len > 0) {
                    let mesg = []
                    for(let i = 0 ; i < len;i++){
                        mesg.push(result.rows.item(i))
                    }
                     setAllMessages(mesg)
                }else{
                    console.log("Not Found messages ...");
                }
                
                },
                (err)=>{
                    console.log(err.message,"error on get message");
                }
            )
        })
      }

    const [message, setmessage] = useState("")
    const [AllMessages, setAllMessages] = useState([])

  return (
    <View style={{flex:1}}>
      <View style={{flex:1}}>
        
        <FlatList
        data={AllMessages}
        keyExtractor={(_,x)=>x.toString()}
        renderItem={({item,index})=>(
            <View style={{margin:10,padding:10,backgroundColor:"#08d"}}>
               <Text style={{color:"#fff",fontSize:20}} > {item?.content} </Text>
            </View>
        )}
        />

      </View>
      <Button title='delete' onPress={ async()=>{

        await db.transaction(async (tx)=>{
            await tx.executeSql(
                "DELETE FROM Messages",
                [],
                (tx,res)=>{
                getMessages()
                setAllMessages([])
                },
                (err)=> console.log(err.message,"error on save message"),
            )
            })

      }} />
      <Button title='save' onPress={()=>saveMessage()} />
      <TextInput placeholder='Enter your messages...' value={message} onChangeText={(t)=>setmessage(t)} />
    </View>
  )
}

export default LocalStorage

const styles = StyleSheet.create({})