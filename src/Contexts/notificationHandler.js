import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';
import { colors } from '../assets/colors';
import { AppState } from 'react-native';

// {
//     id:data.id,
//     content:data.content,
//     sender:data.sender,
//     chat:data.chat,
//     timestamp:data.timestamp,
//     isRead:data.isRead
// }



export const displayNotfee = async (data) => { 

    const sender = JSON.parse(data.sender)

    const nitfe = await notifee.getDisplayedNotifications()
    console.log(nitfe,"&".repeat(100));

    await notifee.requestPermission()

    await notifee.createChannelGroup({
        id: data.chat + "group" || "groupID",
        name: 'group',
      });

   await notifee.createChannel({
        id:data.chat || "channelID",
        name:sender.username || "channelName",
        groupId:data.chat + "group" || "groupID",
        // importance: AppState.currentState == "background" && AndroidImportance.HIGH
    })
   await notifee.displayNotification({
        // title: `<p style="color: #333;"><b>${sender?.username}</span></p></b></p>`,
        data:{
          friendId:sender?.id || "",
          chatId:data.chat,
          friendData: {
            username: sender?.username || "",
            image: sender?.image || "",
            id: sender?.id || "",
            phoneNumber: sender?.phoneNumber,
            FCMtoken:sender?.FCMtoken || "5555"
          }
        },
        android: {
          channelId:data.chat || "channelID",
          color: colors.primary,
          groupSummary:true,
          groupId:data.chat + "group",
          
          actions: [
            {
              title: 'رد',
              icon: 'https://my-cdn.com/icons/reply.png',
              pressAction: {
                id: 'reply',
              },

              input: {
                allowFreeFormInput: true, // set to false
                // choices: ['Yes', 'No', 'Maybe'],
                placeholder: 'اكتب رد ...',

              },

            },
          ],
          style: {
            
            type: AndroidStyle.MESSAGING,
            person: {
              name: sender?.username || "username",
              icon: sender?.image || "https://www.google.com/search?q=userb+png&sca_esv=563438282&sxsrf=AB5stBgHETdYDsp9ucWQIwqux-tyD2rEpg%3A1694116575452&ei=3yr6ZJnsGZytkdUPs5yCqAU&ved=0ahUKEwjZ176FpJmBAxWcVqQEHTOOAFUQ4dUDCBA&uact=5&oq=userb+png&gs_lp=Egxnd3Mtd2l6LXNlcnAiCXVzZXJiIHBuZzIHEAAYDRiABDIHEAAYDRiABDIGEAAYHhgNMgYQABgeGA0yBhAAGB4YDTIGEAAYHhgNMgYQABgeGA0yBhAAGB4YDTIGEAAYHhgNMgYQABgeGA1IsBBQ-gNY3w5wAXgBkAEBmAGAA6ABjhKqAQUyLTUuM7gBA8gBAPgBAagCCsICBxAjGOoCGCfCAgUQABiABMICCxAuGIAEGMcBGNEDwgIHEAAYigUYQ8ICBRAuGIAEwgIIEAAYywEYgATCAgoQABjLARiABBgKwgIGEAAYHhgKwgILEAAYBRgeGPEEGArCAggQABgFGB4YCsICBBAAGB7CAgsQABgeGA8Y8QQYCsICBRAhGKAB4gMEGAAgQYgGAQ&sclient=gws-wiz-serp&bshm=rimc/1#vhid=KnR9uI1e8d4qTM&vssid=l",

            },
            group:true,

            messages: [
              {
                text: data?.content || "no meesages" ,
                timestamp: Date.now() - data?.timestamp, 
              },
              
            ],

            },
        },
      });
 }