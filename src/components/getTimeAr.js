import moment from 'moment';
import {
  Pressable,
  StyleSheet,
  View,
  Platform,
  Image,
  Text,
  FlatList,
  StatusBar,
  TextInput,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState, useRef} from 'react';
import { colors } from '../assets/colors';

let id = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const enToAr = s =>
  s.replace(/[0-9]/g, function (w) {
    return id[+w];
  });

const getDate = date => {
  let get = new Date(date);

  return {
    D: get.getDate(),
    M: get.getMonth(),
    Y: get.getFullYear(),
    date: get.getFullYear() + '/' + get.getMonth() + '/' + get.getDate(),
  };
};

const formatDate = date => {
  let d = date;
  let ndate = new Date(d);
  const dateMo = moment(ndate).format('hh:mm A');
  let h = ndate.getHours();
  let m = ndate.getMinutes();
  let s = ndate.getSeconds();
  let id = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const arToEn = s =>
  s.replace(/[0-9]/g, function (w) {
    return id[+w];
  });
  const pm = dateMo.replace(/PM/, 'م');
  const am = pm.replace(/AM/, 'ص');
  return arToEn(am);
};

const GetDateLastMessages = ({date, item, index, messages}) => {
  
  
  let todayDate = new Date(Date.now());
  let m = todayDate.getMonth() + 1;
  let y = todayDate.getFullYear();
  let d = todayDate.getDate();
  // console.log(messages," <?echo this is message come to your tiime function;ty ?>");
  
  const today = messages.find(item => {
    let dat = new Date(JSON.parse(item.timestamp));
    let Mm = dat.getMonth() + 1;
    let Yy = dat.getFullYear();
    let Dd = dat.getDate();
    return y == Yy && m == Mm && d == Dd;
  });
  
  const yester = messages.find(item => {
    let dat = new Date(JSON.parse(item.timestamp));
    let Mm = dat.getMonth() + 1;
    let Yy = dat.getFullYear();
    let Dd = dat.getDate();
    return y == Yy && m == Mm && d - 1 == Dd;
  });
  
  let arr = [];

  console.log(messages[0],"this is one message'");

  const LongTimeAgo = messages?.filter(item => {
    // let dat = new Date(JSON.parse(item.timestamp));
    // let Mm = dat.getMonth() + 1;
    // let Yy = dat.getFullYear();
    // let Dd = dat.getDate();
    const find = arr.find(ite => {
      const d =
      getDate(JSON.parse(ite.timestamp)).D ==
      getDate(JSON.parse(item.timestamp)).D;
      const m =
      getDate(JSON.parse(ite.timestamp)).M ==
      getDate(JSON.parse(item.timestamp)).M;
      const y =
      getDate(JSON.parse(ite.timestamp)).Y ==
      getDate(JSON.parse(item.timestamp)).Y;
      return d && m && y;
    });
    if (!find || arr.length == 0) {
      arr.push(item);
    }
    return !find;
  });
  
  console.log(yester,"hellodjnf ksbdskfhskldshdkwdjfegf klsfh");
  
  if (today?.id == item?.id) {
    return (
      <View
        style={{alignItems: 'center', justifyContent: 'center', margin: 10}}>
        <View style={{backgroundColor: colors.secondry+88, padding: 7, borderRadius: 10}}>
          <Text style={{color: colors.typograf}}> اليوم </Text>
        </View>
      </View>
    );
  } else if (yester?.id == item?.id) {
    return (
      <View
        style={{alignItems: 'center', justifyContent: 'center', margin: 10}}>
        <View style={{backgroundColor: colors.secondry+88, padding: 7, borderRadius: 10}}>
          <Text style={{color: colors.typograf}}> أمس </Text>
        </View>
      </View>
    );
  } else if (LongTimeAgo?.includes(item)) {
    return (
      <View
        style={{alignItems: 'center', justifyContent: 'center', margin: 10}}>
        <View style={{backgroundColor: colors.secondry+88, padding: 7, borderRadius: 10}}>
          <Text style={{color: colors.typograf}}>
            {enToAr(getDate(JSON.parse(item.timestamp)).date)}
          </Text>
        </View>
      </View>
    );
  }

  return <></>;
};

export {formatDate, GetDateLastMessages};
