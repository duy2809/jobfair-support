/* eslint-disable jsx-a11y/alt-text */
import React, { useRef } from 'react';
import { notification } from 'antd';
import './style.scss'

const Avatar = ({ preview, setImage, avatar }) => {
  const fileInputRef = useRef();

  const changeImageHandler = (e) => {
    const file = e.taperget.files[0];
    const fileType = file.name.split('.')[file.name.split('.')-1]

    if (file?.size > 4194304 || (fileType !== 'jpg' && fileType !== 'png')) {
      
      notification.error({
        message: '.jpg, .png, サイズ4MB未満の画像を選択してください',
        duration: 2,
      });   
      return;
    }
    if (file && file.type.substr(0, 5) === 'image') {
      setImage(file);
    } else {
      setImage(null);
    }
  };

  return (
    <div className="avatar">
      <input
        type='file'
        style={{ display: 'none' }}
        ref={fileInputRef}
        accept='image/*'
        onChange={(e) => changeImageHandler(e)}
      />
      {preview ? (
        <img
          src={preview}
          onClick={() => {
            setImage(null);
          }}
        />
      ) : (
        <img
          src=''
          className="avatar-img"
          src={`${avatar}`}
          onClick={(e) => {
            e.preventDefault();
            fileInputRef.current.click();
          }}
        />
      )}
    </div>
  );
};

export default Avatar;
