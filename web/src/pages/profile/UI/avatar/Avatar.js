/* eslint-disable jsx-a11y/alt-text */
import React, { useRef } from 'react';
import { notification } from 'antd';
import './style.scss'

const Avatar = ({ preview, setImage }) => {
  const fileInputRef = useRef();

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    if (file?.size > 4194304) {
      notification.error({
        message: 'サイズ4MB未満の画像を選択してください',
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
          src='/images/profile/avatar/1.png'
          className="avatar-img"
          // src='/images/alexad.jpg'
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
