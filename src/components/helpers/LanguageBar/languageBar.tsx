import React, { useState, useEffect } from 'react';
import i18n from '../../../i18n';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router';
import Select, { OnChangeValue } from 'react-select';
import { List } from 'immutable';
// const languages = [
//       { label: 'English', value: 'en' },
//       {
//         label: "Chineese", value: "zh"
//       }
// ]
// class LanguageBar extends React.Component {
//   constructor(props: any) {
//     super(props);
//   }
// }
const LanguageBar = () => {
  const languages = [
    { id:1,label: 'English', text: 'EN' , value: 'en' },
    {
      id:2, label: "Chineese", text: '中文' , value: "zh"
    }
  ]
  const changeLocale = (e: any) => {
    console.log('changing', e.target.id);
    //   const lang = localStorage.getItem('i18nextLng');
    //  (lang == 'en' || lang == 'en-GB') ? i18n.changeLanguage('zh') : i18n.changeLanguage('en');
    i18n.changeLanguage(e.target.id);
  }
  const mystyle = {
    padding: "6px",
    fontFamily: "Arial",
    cursor: "pointer"
  };
  return (
    <>
    <div>
      {languages.map((lang) => (
        <span className="langs" style={mystyle} id={lang.value} key={lang.text} onClick={changeLocale}>{lang.text}</span>
      ))}
    </div>
    </>
  );
};
export default LanguageBar;