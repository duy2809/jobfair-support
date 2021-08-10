const fullwidthReg = /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g
const onlyNumberReg = new RegExp(/^[0-9]+$/)
const specialCharacterReg = new RegExp(/[!@#$%^&*()_[+\-=\]{};':"\\|,.<>?]/g)
const alphanumericReg = new RegExp(/^[a-z0-9]+$/i)
const vietnameseReg = new RegExp(/[àÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ]/g)
/*
^         Start of string
[a-z0-9]  a or b or c or ... z or 0 or 1 or ... 9
+         one or more times (change to * to allow empty string)
$         end of string
/i        case-insensitive
*/

export const isFullWidth = (string) => {
  if (string.toString().match(fullwidthReg)) return true
  return false
}

export const toHalfWidth = (fullwidthNum) => fullwidthNum.replace(/[Ａ-Ｚａ-ｚ０-９]/g,
  (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))

export const dateFormat = 'YYYY/MM/DD'

export const Reg = {
  onlyNumber: onlyNumberReg,
  specialCharacter: specialCharacterReg,
  alphanumeric: alphanumericReg,
  vietnamese: vietnameseReg,
}

export const unSaveChangeConfirm = (active) => {
  if (active) {
    window.onbeforeunload = (event) => {
      const e = event || window.event
      e.preventDefault()
      if (e) {
        const msg = 'Are you sure you want to exit?'
        event.returnValue = msg
        return msg
      }
      return ''
    }
  }
}
